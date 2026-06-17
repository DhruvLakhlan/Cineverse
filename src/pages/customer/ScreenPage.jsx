import { useNavigate } from "react-router-dom";
import { getScreensByTheatre } from "../../data/screens";
import { useBooking } from "../../context/BookingContext";
import "./BookingFlow.css";

const typeColors = {
  IMAX: "#06B6D4", "Dolby Atmos": "#7C3AED", "4DX": "#F59E0B",
  VIP: "#a78bfa", Premium: "#F59E0B", Recliner: "#22C55E",
  "4K": "#06B6D4", Standard: "#94A3B8",
};

export default function ScreenPage() {
  const { booking, setScreen } = useBooking();
  const navigate = useNavigate();

  if (!booking.theatre) { navigate("/customer/theatre"); return null; }

  const screens = getScreensByTheatre(booking.theatre.id);

  const handleSelect = (screen) => {
    setScreen(screen);
    navigate("/customer/showtime");
  };

  const handleKeyDown = (e, screen) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(screen);
    }
  };

  return (
    <div className="booking-step-page fade-in">
      <div className="booking-step-header">
        <h1>Select <span className="text-accent">Screen</span></h1>
        <p className="booking-context">
          {booking.movie.title} · {booking.theatre.name}
        </p>
      </div>

      <div className="grid-2 screen-select-grid">
        {screens.map(screen => {
          const color = typeColors[screen.type] || "#94A3B8";
          return (
            <div
              key={screen.id}
              id={`screen-${screen.id}`}
              className="card screen-select-card"
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(screen)}
              onKeyDown={(e) => handleKeyDown(e, screen)}
            >
              <div className="screen-select-top">
                <div>
                  <h3>{screen.name}</h3>
                  <span
                    className="screen-type-badge"
                    style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                  >
                    {screen.type}
                  </span>
                </div>
                <div className="screen-capacity">
                  <div className="screen-capacity-value">{screen.capacity}</div>
                  <div className="screen-capacity-label">seats</div>
                </div>
              </div>
              <div className="screen-select-meta">
                📐 {screen.rows} rows × {screen.cols} cols
              </div>
              <div className="screen-select-footer">
                <span className="btn btn-primary btn-sm">Select →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
