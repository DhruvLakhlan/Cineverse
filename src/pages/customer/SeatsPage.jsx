import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { SeatGrid, SeatLegend } from "../../components/booking/Seat";
import "./SeatsPage.css";

// Generate a mock seat map for the screen
function generateSeats(screen, occupancyPct) {
  const rows = "ABCDEFGHIJ".slice(0, screen.rows);
  const cols = screen.cols;
  const totalSeats = rows.length * cols;
  const occupiedCount = Math.floor((occupancyPct / 100) * totalSeats);

  const seats = [];
  let occupiedPlaced = 0;

  [...rows].forEach((row, rowIdx) => {
    for (let col = 1; col <= cols; col++) {
      const id = `${row}${col}`;
      // Determine seat type based on row position
      let type = "regular";
      if (rowIdx < 2) type = "vip";
      else if (rowIdx < 4) type = "premium";

      // Randomly occupy some seats
      const isOccupied = occupiedPlaced < occupiedCount && Math.random() < occupancyPct / 100;
      if (isOccupied) occupiedPlaced++;

      seats.push({ id, type, status: isOccupied ? "occupied" : "available", isSelected: false });
    }
  });

  return seats;
}

export default function SeatsPage() {
  const { booking, setSelectedSeats } = useBooking();
  const navigate = useNavigate();

  if (!booking.show) { navigate("/customer/showtime"); return null; }

  const [seats, setSeats] = useState(() =>
    generateSeats(booking.screen, booking.show.occupancy)
  );
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSeatSelect = (seat) => {
    setSeats(prev => prev.map(s =>
      s.id === seat.id ? { ...s, isSelected: !s.isSelected } : s
    ));
    setSelectedIds(prev =>
      prev.includes(seat.id) ? prev.filter(id => id !== seat.id) : [...prev, seat.id]
    );
  };

  const selectedSeatData = useMemo(() =>
    seats.filter(s => s.isSelected).map(s => ({
      id: s.id, type: s.type
    })),
    [seats]
  );

  const totalAmount = useMemo(() =>
    selectedSeatData.reduce((sum, s) => sum + (booking.show.price[s.type] || 0), 0),
    [selectedSeatData, booking.show]
  );

  const handleProceed = () => {
    setSelectedSeats(selectedSeatData);
    navigate("/customer/summary");
  };

  return (
    <div className="seats-page fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1>Select <span className="text-accent">Seats</span></h1>
        <p className="text-muted" style={{ marginTop: 6 }}>
          {booking.movie.title} · {booking.theatre.name} · {booking.show.time}
        </p>
      </div>

      {/* Curved Cinema Screen */}
      <div className="curved-screen-container">
        <div className="curved-screen">
          <div className="screen-glow"></div>
          <div className="screen-text">SCREEN</div>
        </div>
      </div>

      {/* Legend */}
      <SeatLegend />

      {/* Seat Map */}
      <div className="seat-map-card">
        <SeatGrid seats={seats} onSeatSelect={handleSeatSelect} showScreen={false} />
      </div>

      {/* Booking Summary Card */}
      <div className="booking-summary-card">
        <div className="summary-section">
          <div style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.6)" }}>Selected Seats</div>
          {selectedIds.length > 0 ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              {selectedIds.map(id => {
                const seat = seats.find(s => s.id === id);
                const colorMap = { vip: "#a78bfa", premium: "#FFD700", regular: "#60a5fa" };
                return (
                  <span key={id} style={{
                    background: "rgba(24, 24, 27, 0.75)", border: `1.5px solid ${colorMap[seat?.type]}`,
                    borderRadius: 12, padding: "4px 12px", fontSize: "0.8rem", fontWeight: 700,
                    color: colorMap[seat?.type],
                  }}>{id}</span>
                );
              })}
            </div>
          ) : (
            <p className="text-muted text-sm" style={{ marginTop: 8 }}>No seats selected</p>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.6)" }}>Total Amount</div>
          <div className="text-accent" style={{ fontSize: "1.8rem", fontWeight: 800 }}>₹{totalAmount}</div>
        </div>
        <button
          className="btn btn-primary btn-lg"
          id="proceed-to-summary"
          disabled={selectedIds.length === 0}
          onClick={handleProceed}
        >
          Proceed →
        </button>
      </div>
    </div>
  );
}
