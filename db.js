const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database(process.env.DB_PATH || "./resto.db")

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `)

    db.run(`
    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price INTEGER,
      stock INTEGER,
      image TEXT,
      owner_id INTEGER
    )
  `)

    db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total INTEGER,
      created_at TEXT
    )
  `)

    db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      menu_id INTEGER,
      qty INTEGER,
      price INTEGER
    )
  `)
})

module.exports = db