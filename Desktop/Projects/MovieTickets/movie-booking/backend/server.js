const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('cinema.db');

const PRICES = { 1: 150, 2: 200, 3: 180, 4: 220 };

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    time TEXT NOT NULL,
    total_seats INTEGER DEFAULT 20,
    price INTEGER DEFAULT 150
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER NOT NULL,
    seat_number INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    booked_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (show_id) REFERENCES shows(id),
    UNIQUE(show_id, seat_number)
  )`);

  db.get('SELECT COUNT(*) as c FROM shows', (err, row) => {
    if (row && row.c === 0) {
      const stmt = db.prepare('INSERT INTO shows (title, time, price) VALUES (?, ?, ?)');
      stmt.run('Avengers: Endgame', '10:00 AM', 150);
      stmt.run('Interstellar', '1:00 PM', 200);
      stmt.run('The Dark Knight', '4:00 PM', 180);
      stmt.run('Inception', '7:00 PM', 220);
      stmt.finalize();
    }
  });
});

// GET all shows
app.get('/shows', (req, res) => {
  const sql = `
    SELECT s.*, (s.total_seats - COUNT(b.id)) as available_seats
    FROM shows s
    LEFT JOIN bookings b ON s.id = b.show_id
    GROUP BY s.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET seats for a show
app.get('/shows/:id/seats', (req, res) => {
  const showId = req.params.id;
  db.get('SELECT * FROM shows WHERE id = ?', [showId], (err, show) => {
    if (err || !show) return res.status(404).json({ error: 'Show not found' });
    db.all('SELECT seat_number, customer_name FROM bookings WHERE show_id = ?', [showId], (err, bks) => {
      const map = {};
      bks.forEach(b => { map[b.seat_number] = b.customer_name; });
      const seats = [];
      for (let i = 1; i <= show.total_seats; i++) {
        seats.push({ seat_number: i, is_booked: !!map[i], customer_name: map[i] || null });
      }
      res.json({ show, seats });
    });
  });
});

// POST book seats
app.post('/book', (req, res) => {
  const { show_id, seat_numbers, customer_name } = req.body;
  if (!show_id || !seat_numbers || seat_numbers.length === 0 || !customer_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.get('SELECT * FROM shows WHERE id = ?', [show_id], (err, show) => {
    if (!show) return res.status(404).json({ error: 'Show not found' });
    db.get('SELECT COUNT(*) as c FROM bookings WHERE show_id = ?', [show_id], (err, row) => {
      if (row.c + seat_numbers.length > show.total_seats) {
        return res.status(400).json({ error: 'Not enough seats available' });
      }
      const placeholders = seat_numbers.map(() => '?').join(',');
      db.all(
        `SELECT seat_number FROM bookings WHERE show_id = ? AND seat_number IN (${placeholders})`,
        [show_id, ...seat_numbers],
        (err, taken) => {
          if (taken.length > 0) {
            return res.status(400).json({ error: `Seats already booked: ${taken.map(s => s.seat_number).join(', ')}` });
          }
          const stmt = db.prepare('INSERT INTO bookings (show_id, seat_number, customer_name) VALUES (?, ?, ?)');
          seat_numbers.forEach(seat => stmt.run(show_id, seat, customer_name));
          stmt.finalize();
          const total = seat_numbers.length * show.price;
          res.json({ message: 'Booking successful!', seats: seat_numbers, total, price_per_seat: show.price });
        }
      );
    });
  });
});

// DELETE cancel booking
app.delete('/cancel', (req, res) => {
  const { show_id, seat_number } = req.body;
  db.get('SELECT * FROM bookings WHERE show_id = ? AND seat_number = ?', [show_id, seat_number], (err, booking) => {
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    db.run('DELETE FROM bookings WHERE show_id = ? AND seat_number = ?', [show_id, seat_number], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Booking cancelled successfully' });
    });
  });
});

// GET booking history
app.get('/history', (req, res) => {
  const sql = `
    SELECT b.id, b.show_id, s.title as movie, s.time, s.price,
      b.customer_name, b.seat_number, b.booked_at
    FROM bookings b
    JOIN shows s ON s.id = b.show_id
    ORDER BY b.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const grouped = {};
    rows.forEach(r => {
      const key = `${r.show_id}_${r.customer_name}_${r.booked_at}`;
      if (!grouped[key]) {
        grouped[key] = {
          id: r.id,
          show_id: r.show_id,
          movie: r.movie,
          time: r.time,
          name: r.customer_name,
          price_per_seat: r.price,
          seats: [],
          booked_at: r.booked_at
        };
      }
      grouped[key].seats.push(r.seat_number);
    });

    const result = Object.values(grouped).map(h => ({
      ...h,
      total: h.seats.length * h.price_per_seat
    }));

    res.json(result);
  });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
