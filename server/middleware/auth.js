const jwt = require('jsonwebtoken');

module.exports = function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized — no token provided' });
  }
  try {
    req.admin = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'jcd-secret-key');
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
