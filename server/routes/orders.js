const express      = require('express');
const db           = require('../db');
const requireAdmin = require('../middleware/auth');
const router       = express.Router();

/* GET /api/orders  — admin only */
router.get('/', requireAdmin, (_req, res) => {
  const orders = db.prepare(`
    SELECT o.*,
           GROUP_CONCAT(oi.product_name || ' ×' || oi.qty, ', ') AS items_summary
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `).all();
  res.json(orders);
});

/* GET /api/orders/:ref  — public (customer order tracking) */
router.get('/:ref', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE ref = ?').get(req.params.ref);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  res.json({ ...order, items });
});

/* POST /api/orders  — public (customers place orders) */
router.post('/', (req, res) => {
  const { firstName, lastName, email, phone, address, city, postal,
          notes, paymentMethod, items, subtotal, deliveryFee, total } = req.body;

  if (!firstName || !lastName || !email || !phone || !address || !city || !postal || !items?.length) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  const ref = `JCD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  db.exec('BEGIN');
  let orderId;
  try {
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO orders (ref, first_name, last_name, email, phone, address, city, postal,
                          notes, payment_method, subtotal, delivery_fee, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(ref, firstName, lastName, email, phone, address, city, postal,
           notes || '', paymentMethod, subtotal, deliveryFee, total);
    orderId = lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price, qty)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const item of items) {
      insertItem.run(orderId, item.id, item.name, item.price, item.qty);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    return res.status(500).json({ error: 'Failed to save order' });
  }
  res.status(201).json({ ref, orderId });
});

/* PATCH /api/orders/:id/status  — admin only */
router.patch('/:id/status', requireAdmin, (req, res) => {
  const VALID = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  const { status } = req.body;
  if (!VALID.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID.join(', ')}` });
  }
  const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Order not found' });
  res.json({ success: true });
});

module.exports = router;
