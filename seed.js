const Database = require("better-sqlite3");
const db = new Database("url.db");

db.prepare(
    "CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY, url TEXT NOT NULL)"
).run();
