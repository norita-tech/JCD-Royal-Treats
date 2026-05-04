const express      = require('express');
const path         = require('path');
const fs           = require('fs');
const multer       = require('multer');
const db           = require('../db');
const requireAdmin = require('../middleware/auth');
const router       = express.Router();

/* Multer — store images in /uploads, accept jpg/png/webp up to 5 MB */
const uploadsDir = path.join(__dirname, '..', 'data', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
});

/* GET /api/products  — public */
router.get('/', (_req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY id').all();
  res.json(products.map(normalise));
});

/* GET /api/products/:id  — public */
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(normalise(product));
});

/* POST /api/products  — admin only, supports optional image upload */
router.post('/', requireAdmin, upload.single('image'), (req, res) => {
  const { name, price, category, description, emoji, bg, featured, badge, weight, unit } = req.body;
  if (!name || !price || !category || !description) {
    return res.status(400).json({ error: 'name, price, category and description are required' });
  }
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  const result = db.prepare(`
    INSERT INTO products (name, price, category, description, emoji, bg, featured, badge, image_url, weight, unit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name, parseFloat(price), category, description,
    emoji || '🍞',
    bg || 'linear-gradient(135deg,#f6d365,#fda085)',
    parseInt(featured) || 0,
    badge || null,
    image_url,
    parseInt(weight) || 250,
    unit || 'piece'
  );
  res.status(201).json(normalise(db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid)));
});

/* PUT /api/products/:id  — admin only */
router.put('/:id', requireAdmin, upload.single('image'), (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  const { name, price, category, description, emoji, bg, featured, badge, weight, unit } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : existing.image_url;

  db.prepare(`
    UPDATE products SET name=?, price=?, category=?, description=?, emoji=?, bg=?, featured=?, badge=?, image_url=?, weight=?, unit=? WHERE id=?
  `).run(
    name        ?? existing.name,
    price       !== undefined ? parseFloat(price)   : existing.price,
    category    ?? existing.category,
    description ?? existing.description,
    emoji       ?? existing.emoji,
    bg          ?? existing.bg,
    featured    !== undefined ? parseInt(featured)  : existing.featured,
    badge       !== undefined ? badge               : existing.badge,
    image_url,
    weight      !== undefined ? parseInt(weight)    : (existing.weight ?? 250),
    unit        ?? existing.unit ?? 'piece',
    req.params.id
  );
  res.json(normalise(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)));
});

/* DELETE /api/products/:id  — admin only */
router.delete('/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

/* Convert SQLite 0/1 integers to proper JS booleans */
function normalise(p) {
  return { ...p, featured: p.featured === 1 };
}

module.exports = router;
