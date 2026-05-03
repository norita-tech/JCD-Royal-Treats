require('dotenv').config();
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(require('cors')());
app.use(express.json());

/* Paystack webhook needs the raw body — mount before json() for that route */
app.use('/api/paystack/webhook', express.raw({ type: 'application/json' }));

/* Serve uploaded product images */
app.use('/uploads', express.static(path.join(__dirname, 'data', 'uploads')));

/* Serve the frontend (parent directory) */
app.use(express.static(path.join(__dirname, '..')));

/* API routes */
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/paystack', require('./routes/paystack'));

/* Fallback — serve index.html for any unknown path */
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   👑  JCD Royal Treats — Server Ready   ║
║   Open: http://localhost:${PORT}           ║
║   Admin password: ${(process.env.ADMIN_PASSWORD || 'admin123').padEnd(22)}║
╚══════════════════════════════════════════╝
  `);
});
