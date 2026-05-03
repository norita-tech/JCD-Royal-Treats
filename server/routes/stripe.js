const express = require('express');
const router  = express.Router();
const db      = require('../db');

function getStripe() {
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
}

/* POST /api/stripe/create-checkout-session */
router.post('/create-checkout-session', async (req, res) => {
  const { firstName, lastName, email, phone, address, city, postal,
          notes, items, subtotal, deliveryFee, total, currency, rate } = req.body;

  if (!firstName || !lastName || !email || !phone || !items?.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const ref     = `JCD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const cur     = (currency || 'CHF').toLowerCase();
  const convRate = parseFloat(rate) || 1;

  db.exec('BEGIN');
  let orderId;
  try {
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO orders (ref, first_name, last_name, email, phone, address, city, postal,
                          notes, payment_method, subtotal, delivery_fee, total, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'stripe', ?, ?, ?, 'pending_payment')
    `).run(ref, firstName, lastName, email, phone, address || '', city || '', postal || '',
           notes || '', subtotal, deliveryFee, total);
    orderId = lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price, qty)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const item of items) {
      insertItem.run(orderId, item.id || null, item.name, item.price, item.qty);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    return res.status(500).json({ error: 'Failed to save order' });
  }

  try {
    const stripe = getStripe();
    const lineItems = items.map(item => ({
      price_data: {
        currency: cur,
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * convRate * 100),
      },
      quantity: item.qty,
    }));

    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: cur,
          product_data: { name: 'Delivery' },
          unit_amount: Math.round(deliveryFee * convRate * 100),
        },
        quantity: 1,
      });
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${baseUrl}/checkout.html?stripe_success=true&ref=${ref}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/checkout.html?stripe_cancelled=true`,
      metadata: { orderRef: ref },
    });

    res.json({ url: session.url, ref });
  } catch (err) {
    db.prepare('DELETE FROM order_items WHERE order_id = ?').run(orderId);
    db.prepare('DELETE FROM orders WHERE ref = ?').run(ref);
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* POST /api/stripe/verify — called after Stripe redirects back */
router.post('/verify', async (req, res) => {
  const { sessionId, orderRef } = req.body;
  if (!sessionId || !orderRef) return res.status(400).json({ error: 'Missing fields' });

  try {
    const stripe  = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' && session.metadata?.orderRef === orderRef) {
      db.prepare(`UPDATE orders SET status = 'paid' WHERE ref = ?`).run(orderRef);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Payment not confirmed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
