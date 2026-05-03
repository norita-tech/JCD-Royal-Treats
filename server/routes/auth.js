const express = require('express');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET || 'jcd-secret-key',
    { expiresIn: '8h' }
  );

  res.json({ token });
});

module.exports = router;
