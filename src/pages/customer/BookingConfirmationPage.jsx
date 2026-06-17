import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import "./BookingConfirmation.css";

export default function BookingConfirmationPage() {
  const { booking, generateBookingId, resetBooking } = useBooking();
  const bookingId = useMemo(() => generateBookingId(), []);

  if (!booking.selectedSeats?.length) {
    return (
      <div className="empty-state" style={{ minHeight: "60vh" }}>
        <p>No booking in progress</p>
        <Link to="/customer/movies" className="btn btn-primary">Browse Movies</Link>
      </div>
    );
  }

  const { movie, theatre, screen, show, selectedSeats, totalAmount } = booking;
  const grand = totalAmount + selectedSeats.length * 30 + Math.round(totalAmount * 0.18);

  return (
    <div className="confirmation-page fade-in">
      {/* Success Animation */}
      <div className="confirmation-success">
        <div className="success-ring">
          <span className="success-icon" aria-hidden="true">✓</span>
        </div>
        <h1>Booking <span className="text-accent">Confirmed!</span></h1>
        <p className="text-muted">Your tickets have been booked successfully</p>
      </div>

      {/* Ticket Card */}
      <div className="ticket-card">
        <div className="ticket-header">
          <div className="ticket-logo">
            <div style={{ background: "var(--accent-primary)", borderRadius: "var(--radius-lg)", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>▶</div>
            <span style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--text-primary)" }}>Cine<span className="text-accent">Verse</span></span>
          </div>
          <div className="ticket-id">
            <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Booking ID</span>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>{bookingId}</span>
          </div>
        </div>

        <div className="ticket-divider">
          <div className="ticket-hole left" />
          <div className="ticket-dashes" />
          <div className="ticket-hole right" />
        </div>

        <div className="ticket-body">
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
            <img src={movie.poster} alt={movie.title} style={{ width: 100, borderRadius: "18px", objectFit: "cover", aspectRatio: "2/3", border: "1px solid rgba(255, 255, 255, 0.1)" }} onError={e => e.target.style.display = "none"} />
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: 6, fontWeight: 800, color: "var(--text-primary)" }}>{movie.title}</h2>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>{movie.genre.join(", ")} · {movie.duration} min</p>
            </div>
          </div>

          <div className="ticket-details-grid">
            <div className="ticket-detail"><span>🎭 Theatre</span><strong>{theatre.name}</strong></div>
            <div className="ticket-detail"><span>🖥️ Screen</span><strong>{screen.name}</strong></div>
            <div className="ticket-detail"><span>📅 Date</span><strong>{show.date}</strong></div>
            <div className="ticket-detail"><span>🕐 Show</span><strong>{show.time}</strong></div>
          </div>

          <div className="ticket-seats">
            <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)" }}>Seats</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {selectedSeats.map(s => (
                <span key={s.id} className="badge badge-secondary" style={{ borderRadius: "var(--radius-lg)", padding: "6px 14px", fontWeight: 700, fontSize: "0.9rem" }}>{s.id}</span>
              ))}
            </div>
          </div>

          <div className="ticket-divider">
            <div className="ticket-hole left" />
            <div className="ticket-dashes" />
            <div className="ticket-hole right" />
          </div>

          {/* QR Placeholder */}
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div className="qr-placeholder">
              <div className="qr-inner">QR</div>
              <p style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", marginTop: 8, textAlign: "center" }}>Scan at venue</p>
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: 6 }}>Total Paid</div>
              <div className="text-accent" style={{ fontSize: "2.2rem", fontWeight: 900 }}>₹{grand}</div>
              <div className="text-success" style={{ fontSize: "0.85rem", marginTop: 6, display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
                <span>✓</span> Payment Successful
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
        <Link to="/customer/history" className="btn btn-secondary btn-lg" id="view-booking-history" onClick={resetBooking}>
          View Booking History
        </Link>
        <Link to="/customer/movies" className="btn btn-primary btn-lg" id="book-more-movies" onClick={resetBooking}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
