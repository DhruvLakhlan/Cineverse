import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import "./BookingSummary.css";

export default function BookingSummaryPage() {
  const { booking } = useBooking();
  const navigate = useNavigate();

  if (!booking.selectedSeats?.length) { navigate("/customer/seats"); return null; }

  const { movie, theatre, screen, show, selectedSeats, totalAmount } = booking;

  const handleConfirm = () => {
    navigate("/customer/confirmation");
  };

  const typeLabel = { regular: "Regular", premium: "Premium", vip: "VIP" };
  const typeColor = { regular: "#60a5fa", premium: "var(--accent-gold)", vip: "#a78bfa" };

  return (
    <div className="summary-page fade-in">
      <h1 style={{ marginBottom: 32, fontSize: "2.5rem", fontWeight: 900, color: "var(--text-primary)" }}>Booking <span className="text-accent">Summary</span></h1>

      <div className="summary-layout">
        {/* Left: Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Movie Info */}
          <div className="summary-card">
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <img src={movie.poster} alt={movie.title} style={{ width: 100, borderRadius: "18px", objectFit: "cover", aspectRatio: "2/3", border: "1px solid rgba(255, 255, 255, 0.1)" }} onError={e => e.target.style.display = "none"} />
              <div>
                <h3 style={{ marginBottom: 10, fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>{movie.title}</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  {movie.genre.map(g => <span key={g} style={{ padding: "4px 12px", borderRadius: "18px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", background: "rgba(24, 24, 27, 0.75)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "rgba(255, 255, 255, 0.7)" }}>{g}</span>)}
                </div>
                <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)" }}>
                  ⏱ {movie.duration} min · {movie.language}
                </p>
              </div>
            </div>
          </div>

          {/* Venue Info */}
          <div className="summary-card">
            <h4 className="summary-section-label">Venue Details</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              <div className="summary-row"><span>🎭 Theatre</span><strong>{theatre.name}</strong></div>
              <div className="summary-row"><span>🖥️ Screen</span><strong>{screen.name}</strong></div>
              <div className="summary-row"><span>📅 Date</span><strong>{show.date}</strong></div>
              <div className="summary-row"><span>🕐 Time</span><strong>{show.time}</strong></div>
            </div>
          </div>

          {/* Seats */}
          <div className="summary-card">
            <h4 className="summary-section-label">Selected Seats ({selectedSeats.length})</h4>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
              {selectedSeats.map(seat => (
                <div key={seat.id} style={{ background: "rgba(24, 24, 27, 0.75)", border: `1.5px solid ${typeColor[seat.type]}`, borderRadius: "18px", padding: "8px 16px", textAlign: "center", transition: "all 300ms ease" }}>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: typeColor[seat.type] }}>{seat.id}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{typeLabel[seat.type]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Price Breakdown */}
        <div className="price-breakdown-card">
          <h4 className="summary-section-label" style={{ marginBottom: 20 }}>Price Breakdown</h4>
          {selectedSeats.map(seat => (
            <div key={seat.id} className="price-row">
              <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem" }}>
                {seat.id} <span style={{ color: typeColor[seat.type] }}>({typeLabel[seat.type]})</span>
              </span>
              <span style={{ fontWeight: 700, color: "#FFFFFF" }}>₹{show.price[seat.type]}</span>
            </div>
          ))}

          <div className="divider" />

          <div className="price-row" style={{ marginBottom: 10 }}>
            <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Convenience Fee</span>
            <span style={{ fontWeight: 700, color: "#FFFFFF" }}>₹{selectedSeats.length * 30}</span>
          </div>
          <div className="price-row">
            <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>GST (18%)</span>
            <span style={{ fontWeight: 700, color: "#FFFFFF" }}>₹{Math.round(totalAmount * 0.18)}</span>
          </div>

          <div className="divider" />

          <div className="price-row total-row">
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>Grand Total</span>
            <span className="total-amount">₹{totalAmount + selectedSeats.length * 30 + Math.round(totalAmount * 0.18)}</span>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 24 }} id="confirm-booking" onClick={handleConfirm}>
            Proceed to Payment
          </button>

          <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.5)" }}>
            Secure payment · No cancellation charges within 2 hrs
          </p>
        </div>
      </div>
    </div>
  );
}
