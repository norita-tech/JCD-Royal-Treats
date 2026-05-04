/* Uses the built-in node:sqlite module (Node.js 22.5+, stable in v23.4+) —
   no native compilation required. */
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs   = require('fs');

/* All persistent data lives in server/data/ so a Railway Volume can be
   mounted there without overwriting any server code files. */
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, 'jcd_treats.db'));

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

try { db.exec('ALTER TABLE products ADD COLUMN weight INTEGER DEFAULT 250'); } catch {}
try { db.exec('ALTER TABLE products ADD COLUMN unit TEXT DEFAULT \'piece\''); } catch {}
try { db.exec("UPDATE products SET unit = 'litre' WHERE name IN ('Chin Chin', 'Peanut Burger') AND (unit IS NULL OR unit = 'piece')"); } catch {}

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    price       REAL    NOT NULL,
    category    TEXT    NOT NULL,
    description TEXT    NOT NULL,
    emoji       TEXT    DEFAULT '🍞',
    bg          TEXT    DEFAULT 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    featured    INTEGER DEFAULT 0,
    badge       TEXT,
    image_url   TEXT,
    created_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    ref            TEXT UNIQUE NOT NULL,
    first_name     TEXT NOT NULL,
    last_name      TEXT NOT NULL,
    email          TEXT NOT NULL,
    phone          TEXT NOT NULL,
    address        TEXT NOT NULL,
    city           TEXT NOT NULL,
    postal         TEXT NOT NULL,
    notes          TEXT,
    payment_method TEXT NOT NULL,
    subtotal       REAL NOT NULL,
    delivery_fee   REAL NOT NULL,
    total          REAL NOT NULL,
    status         TEXT DEFAULT 'pending',
    paystack_ref   TEXT,
    created_at     TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id     INTEGER NOT NULL,
    product_id   INTEGER,
    product_name TEXT NOT NULL,
    price        REAL NOT NULL,
    qty          INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
`);

/* Seed default products once */
const isEmpty = db.prepare('SELECT COUNT(*) AS n FROM products').get().n === 0;
if (isEmpty) {
  db.exec('BEGIN');
  try {
    const insert = db.prepare(`
      INSERT INTO products (name, price, category, description, emoji, bg, featured, badge, weight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    /* weights in grams per unit */
    const rows = [
      ['Banana Bread',   7.50, 'baked',  'Moist, golden banana bread made with ripe bananas, butter and a hint of cinnamon.',          '🍌', 'linear-gradient(135deg,#f6d365,#fda085)', 1, 'Bestseller',   500 ],
      ['Puff Puff',      4.50, 'fried',  'Light, fluffy deep-fried dough balls dusted with sugar — a West African classic.',           '🟡', 'linear-gradient(135deg,#d4a96a,#c8860a)', 1, 'Fan Favourite', 300 ],
      ['Chin Chin',      5.50, 'fried',  'Crunchy, lightly sweetened fried dough snack. Addictive and perfect for snacking.',         '✨', 'linear-gradient(135deg,#ffecd2,#fcb69f)', 0, null,            250 ],
      ['Peanut Burger',  5.00, 'snacks', 'Crispy peanut-coated patties with a satisfying crunch in every bite.',                      '🥜', 'linear-gradient(135deg,#c8a97e,#6b4226)', 1, null,            200 ],
      ['Meat Pie',       6.50, 'savory', 'Golden pastry filled with seasoned minced meat, potatoes and carrots.',                     '🥧', 'linear-gradient(135deg,#d4a96a,#7d4e2d)', 1, 'Popular',       200 ],
      ['Fish Roll',      6.00, 'savory', 'Flaky pastry rolled with seasoned fish filling — a perfect snack any time.',                '🐟', 'linear-gradient(135deg,#a1c4fd,#c2e9fb)', 0, null,            150 ],
      ['Scotch Egg',     7.00, 'savory', 'Hard-boiled egg wrapped in seasoned meat, breaded and fried to golden perfection.',         '🥚', 'linear-gradient(135deg,#ffeaa7,#dfe6e9)', 1, null,            200 ],
      ['Plantain Chips', 4.00, 'chips',  'Crispy sliced plantain chips, lightly salted — great for snacking anytime.',                '🍃', 'linear-gradient(135deg,#f9ca24,#f0932b)', 0, null,            100 ],
      ['Potato Chips',   3.50, 'chips',  'House-made potato chips, thinly sliced and perfectly seasoned.',                           '🥔', 'linear-gradient(135deg,#f8b500,#e17055)', 0, null,            100 ],
    ];
    for (const r of rows) insert.run(...r);
    db.exec('COMMIT');
    console.log('✅ Database seeded with 9 default products.');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

module.exports = db;
