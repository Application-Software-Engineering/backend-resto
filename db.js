const { createClient } = require("@libsql/client");

const client = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

// Compatibility wrapper to mimic old sqlite3 callback-style API
const db = {
  // For INSERT/UPDATE/DELETE
  run: async (sql, params = [], callback) => {
    try {
      const result = await client.execute({ sql, args: params });
      if (callback) callback.call({ lastID: Number(result.lastInsertRowid) }, null);
    } catch (err) {
      if (callback) callback(err);
      else console.error("DB run error:", err);
    }
  },
  // For SELECT multiple rows
  all: async (sql, params = [], callback) => {
    try {
      const result = await client.execute({ sql, args: params });
      const rows = result.rows.map(row =>
        Object.fromEntries(Object.entries(row).filter(([k]) => isNaN(k)))
      );
      if (callback) callback(null, rows);
    } catch (err) {
      if (callback) callback(err, []);
    }
  },
  // For SELECT single row
  get: async (sql, params = [], callback) => {
    try {
      const result = await client.execute({ sql, args: params });
      const row = result.rows[0]
        ? Object.fromEntries(Object.entries(result.rows[0]).filter(([k]) => isNaN(k)))
        : undefined;
      if (callback) callback(null, row);
    } catch (err) {
      if (callback) callback(err, undefined);
    }
  },
  serialize: (fn) => fn(),
};

// Create tables if they don't exist
(async () => {
  try {
    await client.batch([
      {
        sql: `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT UNIQUE,
          password TEXT
        )`,
        args: [],
      },
      {
        sql: `CREATE TABLE IF NOT EXISTS menus (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price INTEGER,
          stock INTEGER,
          image TEXT,
          owner_id INTEGER
        )`,
        args: [],
      },
      {
        sql: `CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          total INTEGER,
          created_at TEXT
        )`,
        args: [],
      },
      {
        sql: `CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER,
          menu_id INTEGER,
          qty INTEGER,
          price INTEGER
        )`,
        args: [],
      },
    ], "write");
    console.log("✅ Turso DB connected & tables ready");
  } catch (err) {
    console.error("❌ Error initializing Turso DB:", err);
  }
})();

module.exports = db;