const express = require('express');
const https   = require('https');
const crypto  = require('crypto');
const db      = require('../db');
const router  = express.Router();

const SECRET = () => process.env.PAYSTACK_SECRET_KEY;

function paystackPost(endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.paystack.co',
      port: 443, path: endpoint, method: 'POST',
      headers: {
        Authorization: `Bearer ${SECRET()}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, res => {
      let buf = '';
      res.on('data', c => { buf += c; });
      res.on('end', () => { try { resolve(JSON.parse(buf)); } catch (e) { reject(e); } });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function paystackGet(endpoint) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.paystack.co',
      port: 443, path: endpoint, method: 'GET',
      headers: { Authorization: `Bearer ${SECRET()}` },
    }, res => {
      let buf = '';
      res.on('data', c => { buf += c; });
      res.on('end', () => { try { resolve(JSON.parse(buf)); } catch (e) { reject(e); } });
    });
    req.on('error', reject);
    req.end();
  });
}

/* POST /api/paystack/initialize
   Body: { email, amount (ZAR), orderRef, callbackUrl } */
router.post('/initialize', async (req, res) => {
  if (!SECRET()) {
    return res.status(503).json({ error: 'Paystack not configured — add PAYSTACK_SECRET_KEY to .env' });
  }
  const { email, amount, orderRef, callbackUrl } = req.body;
  if (!email || !amount || !orderRef) {
    return res.status(400).json({ error: 'email, amount and orderRef are required' });
  }
  try {
    const response = await paystackPost('/transaction/initialize', {
      email,
      amount: Math.round(amount * 100), // Paystack expects kobo/cents
      reference: orderRef,
      callback_url: callbackUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout.html`,
      currency: 'ZAR',
      metadata: { order_ref: orderRef },
    });
    if (!response.status) return res.status(400).json({ error: response.message });
    res.json({ authorizationUrl: response.data.authorization_url, reference: response.data.reference });
  } catch (err) {
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

/* GET /api/paystack/verify/:reference  — called after Paystack redirects back */
router.get('/verify/:reference', async (req, res) => {
  if (!SECRET()) return res.status(503).json({ error: 'Paystack not configured' });
  try {
    const response = await paystackGet(`/transaction/verify/${encodeURIComponent(req.params.reference)}`);
    if (response.data?.status === 'success') {
      db.prepare("UPDATE orders SET status='confirmed', paystack_ref=? WHERE ref=?")
        .run(req.params.reference, response.data.metadata?.order_ref || req.params.reference);
    }
    res.json({ status: response.data?.status, reference: req.params.reference });
  } catch {
    res.status(500).json({ error: 'Verification failed' });
  }
});

/* POST /api/paystack/webhook  — Paystack event push */
router.post('/webhook', (req, res) => {
  if (!SECRET()) return res.sendStatus(200);

  const signature = crypto.createHmac('sha512', SECRET()).update(req.body).digest('hex');
  if (signature !== req.headers['x-paystack-signature']) return res.sendStatus(401);

  const event = JSON.parse(req.body);
  if (event.event === 'charge.success') {
    const ref = event.data?.reference;
    if (ref) {
      db.prepare("UPDATE orders SET status='confirmed', paystack_ref=? WHERE ref=?").run(ref, ref);
    }
  }
  res.sendStatus(200);
});

module.exports = router;
