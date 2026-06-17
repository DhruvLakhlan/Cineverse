import { useAuth } from "../../context/AuthContext";
import { getBookingsByUser } from "../../data/bookings";
import { movies } from "../../data/movies";
import { Link } from "react-router-dom";
import "./BookingHistoryPage.css";

const statusBadges = {
  confirmed: { color: "var(--success)", border: "rgba(34,197,94,0.3)", bg: "rgba(34,197,94,0.1)", label: "Confirmed" },
  completed: { color: "var(--success)", border: "rgba(34,197,94,0.3)", bg: "rgba(34,197,94,0.1)", label: "Confirmed" },
  pending: { color: "var(--warning)", border: "rgba(245,158,11,0.3)", bg: "rgba(245,158,11,0.1)", label: "Pending" },
  cancelled: { color: "#f87171", border: "rgba(239,68,68,0.3)", bg: "rgba(239,68,68,0.1)", label: "Cancelled" },
};

export default function BookingHistoryPage() {
  const { user } = useAuth();
  const bookings = getBookingsByUser(user?.id || 1);

  return (
    <div className="booking-history-page fade-in container">
      <div className="booking-history-header">
        <h1>Booking <span className="text-accent">History</span></h1>
        <p className="text-muted booking-history-count">{bookings.length} total bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state glass-card">
          <div style={{ fontSize: "4rem" }} aria-hidden="true">🎟️</div>
          <p style={{ fontSize: "1.2rem", marginTop: 16 }}>No bookings yet</p>
          <Link to="/customer/movies" className="btn btn-primary btn-lg">Browse Movies</Link>
        </div>
      ) : (
        <div className="booking-history-list">
          {bookings.map(booking => {
            const badge = statusBadges[booking.status] || statusBadges.confirmed;
            const movie = movies.find(m => m.id === booking.movieId);
            return (
              <div key={booking.id} className="glass-card booking-history-card">
                {movie && (
                  <img
                    src={movie.poster}
                    alt={booking.movieTitle}
                    className="booking-history-poster"
                    onError={e => { e.target.style.display = "none"; }}
                  />
                )}
                <div className="booking-history-body">
                  <div className="booking-history-top">
                    <div>
                      <h3 className="booking-history-title">{booking.movieTitle}</h3>
                      <p className="text-muted booking-history-venue">
                        🎭 {booking.theatreName} • {booking.screenName}
                      </p>
                    </div>
                    <span
                      className="booking-history-status"
                      style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="booking-history-details">
                    <span className="text-muted booking-history-detail">📅 Date: <strong style={{ color: "var(--text-primary)" }}>{booking.showDate}</strong></span>
                    <span className="text-muted booking-history-detail">🕐 Time: <strong style={{ color: "var(--text-primary)" }}>{booking.showTime}</strong></span>
                    <span className="text-muted booking-history-detail">💺 Seats: <strong className="text-accent">{booking.seats.join(", ")}</strong></span>
                  </div>

                  <div className="booking-history-footer">
                    <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                      Booking ID: <strong style={{ color: "var(--text-primary)" }}>{booking.id}</strong>
                    </span>
                    <span className="text-accent booking-history-amount">₹{booking.totalAmount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
