import React, { useEffect, useState } from 'react';
import './App.css';

const API = 'http://localhost:5000';

export default function App() {
  const [tab, setTab] = useState('book');
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [printTicket, setPrintTicket] = useState(null);

  useEffect(() => { fetchShows(); }, []);
  useEffect(() => { if (tab === 'history') fetchHistory(); }, [tab]);

  const fetchShows = async () => {
    const res = await fetch(`${API}/shows`);
    setShows(await res.json());
  };

  const fetchHistory = async () => {
    const res = await fetch(`${API}/history`);
    setHistory(await res.json());
  };

  const selectShow = async (show) => {
    if (show.available_seats === 0) return;
    setSelectedShow(show);
    setSelectedSeats([]);
    setMsg(null);
    const res = await fetch(`${API}/shows/${show.id}/seats`);
    const data = await res.json();
    setSeats(data.seats);
  };

  const toggleSeat = (seat) => {
    if (seat.is_booked) return;
    setSelectedSeats(prev =>
      prev.includes(seat.seat_number)
        ? prev.filter(s => s !== seat.seat_number)
        : [...prev, seat.seat_number]
    );
  };

  const bookSeats = async () => {
    if (!customerName.trim() || selectedSeats.length === 0) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ show_id: selectedShow.id, seat_numbers: selectedSeats, customer_name: customerName })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Booked seats: ${selectedSeats.join(', ')} for ${customerName} — Rs. ${data.total}` });
        setSelectedSeats([]);
        setCustomerName('');
        await selectShow(selectedShow);
        await fetchShows();
      } else {
        setMsg({ type: 'error', text: data.error });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error. Is backend running?' });
    }
    setLoading(false);
  };

  const cancelSeat = async (seat) => {
    const res = await fetch(`${API}/cancel`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ show_id: selectedShow.id, seat_number: seat.seat_number })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ type: 'success', text: `Seat ${seat.seat_number} cancelled` });
      await selectShow(selectedShow);
      await fetchShows();
    } else {
      setMsg({ type: 'error', text: data.error });
    }
  };

  const totalAmount = selectedShow ? selectedSeats.length * selectedShow.price : 0;

  const totalStats = {
    bookings: history.length,
    seats: history.reduce((a, h) => a + h.seats.length, 0),
    spent: history.reduce((a, h) => a + h.total, 0)
  };

  return (
    <div className="app">
      <header>
        <h1>CineBook</h1>
        <p>Book your movie tickets</p>
      </header>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'book' ? 'active' : ''}`} onClick={() => setTab('book')}>Book tickets</button>
        <button className={`tab-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>Booking history</button>
      </div>

      {tab === 'book' && (
        <>
          <div className="shows-grid">
            {shows.map(show => (
              <div
                key={show.id}
                className={`show-card ${selectedShow?.id === show.id ? 'active' : ''} ${show.available_seats === 0 ? 'full' : ''}`}
                onClick={() => selectShow(show)}
              >
                <h3>{show.title}</h3>
                <div className="time">{show.time}</div>
                <div className="seats-left"><span>{show.available_seats}</span> / {show.total_seats} seats</div>
                <div className="price-tag">Rs. {show.price}/seat</div>
                {show.available_seats === 0 && <div className="housefull">HOUSEFULL</div>}
              </div>
            ))}
          </div>

          {selectedShow && (
            <div className="seat-section">
              <h2>{selectedShow.title} — {selectedShow.time}</h2>
              <div className="screen">SCREEN</div>
              <div className="legend">
                <span><div className="dot available"></div> Available</span>
                <span><div className="dot selected"></div> Selected</span>
                <span><div className="dot booked"></div> Booked (click to cancel)</span>
              </div>
              <div className="seat-grid">
                {seats.map(seat => (
                  <div
                    key={seat.seat_number}
                    className={`seat ${seat.is_booked ? 'booked' : ''} ${selectedSeats.includes(seat.seat_number) ? 'selected' : ''}`}
                    onClick={() => seat.is_booked ? cancelSeat(seat) : toggleSeat(seat)}
                    title={seat.is_booked ? `Booked by ${seat.customer_name}` : `Seat ${seat.seat_number}`}
                  >
                    {seat.seat_number}
                  </div>
                ))}
              </div>
              <div className="booking-form">
                <p className="selected-info">Selected: <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span></p>
                {selectedSeats.length > 0 && (
                  <div className="total-row">
                    <span>Total amount</span>
                    <strong>Rs. {totalAmount.toLocaleString()}</strong>
                  </div>
                )}
                <input type="text" placeholder="Your name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                <button className="btn btn-primary" onClick={bookSeats} disabled={loading || selectedSeats.length === 0 || !customerName.trim()}>
                  {loading ? 'Booking...' : `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`}
                </button>
                {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'history' && (
        <div className="history-section">
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-label">Total bookings</div><div className="stat-val">{totalStats.bookings}</div></div>
            <div className="stat-card"><div className="stat-label">Seats booked</div><div className="stat-val">{totalStats.seats}</div></div>
            <div className="stat-card"><div className="stat-label">Amount spent</div><div className="stat-val">Rs. {totalStats.spent.toLocaleString()}</div></div>
          </div>

          {history.length === 0 ? (
            <p className="empty-msg">No bookings yet. Go book some tickets!</p>
          ) : (
            history.map(h => (
              <div key={h.id} className="hist-card">
                <div className="hist-top">
                  <div>
                    <div className="hist-movie">{h.movie}</div>
                    <div className="hist-time">{h.time}</div>
                  </div>
                  <div className="hist-total">Rs. {h.total.toLocaleString()}</div>
                </div>
                <div className="hist-row"><span>Name</span><strong>{h.name}</strong></div>
                <div className="hist-row"><span>Seats</span><strong>{h.seats.join(', ')}</strong></div>
                <div className="hist-row"><span>Price per seat</span><strong>Rs. {h.price_per_seat}</strong></div>
                <div className="hist-row"><span>Booked at</span><strong>{h.booked_at}</strong></div>
                <button className="btn btn-print" onClick={() => setPrintTicket(printTicket?.id === h.id ? null : h)}>
                  {printTicket?.id === h.id ? 'Hide ticket' : 'Print ticket'}
                </button>

                {printTicket?.id === h.id && (
                  <div className="ticket">
                    <div className="ticket-header">
                      <div className="ticket-title">Movie Ticket</div>
                      <div className="ticket-ref">#{String(h.id).slice(-6)}</div>
                    </div>
                    <div className="ticket-grid">
                      <div className="ticket-item"><label>Movie</label><span>{h.movie}</span></div>
                      <div className="ticket-item"><label>Show time</label><span>{h.time}</span></div>
                      <div className="ticket-item"><label>Name</label><span>{h.name}</span></div>
                      <div className="ticket-item"><label>Seats</label><span>{h.seats.join(', ')}</span></div>
                      <div className="ticket-item"><label>Total paid</label><span>Rs. {h.total.toLocaleString()}</span></div>
                      <div className="ticket-item"><label>Booked at</label><span>{h.booked_at}</span></div>
                    </div>
                    <div className="barcode">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="bar" style={{ height: `${20 + Math.floor(Math.random() * 24)}px` }}></div>
                      ))}
                    </div>
                    <button className="btn btn-primary" onClick={() => window.print()}>Print / Save as PDF</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
