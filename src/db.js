const sqlite3 = require('sqlite3').verbose();

// Allow database file path to be configured via env (useful for Fly volumes)
const dbPath = process.env.DATABASE_PATH || './agent.db';

const db = new sqlite3.Database(dbPath, (err) =>{
    if(err){
        console.error("Error opening database: ", err.message)
    } else{
        console.log(`Connected to SQLite database at ${dbPath}`);
    }
});

db.serialize(()=>{
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      purpose TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
      `);
});

module.exports= db;