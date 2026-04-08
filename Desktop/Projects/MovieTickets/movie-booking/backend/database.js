const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cinema.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    time TEXT NOT NULL,
    total_seats INTEGER DEFAULT 20
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER NOT NULL,
    seat_number INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    FOREIGN KEY (show_id) REFERENCES shows(id),
    UNIQUE(show_id, seat_number)
  )`);

  db.get('SELECT COUNT(*) as c FROM shows', (err, row) => {
    if (row && row.c === 0) {
      const stmt = db.prepare('INSERT INTO shows (title, time) VALUES (?, ?)');
      stmt.run('Avengers: Endgame', '10:00 AM');
      stmt.run('Interstellar', '1:00 PM');
      stmt.run('The Dark Knight', '4:00 PM');
      stmt.run('Inception', '7:00 PM');
      stmt.finalize();
    }
  });
});

module.exports = db;
