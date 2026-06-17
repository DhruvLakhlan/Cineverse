import { useNavigate } from "react-router-dom";
import { getShowsByMovieAndTheatre } from "../../data/shows";
import { useBooking } from "../../context/BookingContext";
import "./BookingFlow.css";

const occupancyColor = (pct) => {
  if (pct >= 90) return { color: "#f87171", label: "Almost Full" };
  if (pct >= 70) return { color: "var(--warning)", label: "Filling Fast" };
  return { color: "var(--success)", label: "Available" };
};

export default function ShowtimePage() {
  const { booking, setShow } = useBooking();
  const navigate = useNavigate();

  if (!booking.screen) { navigate("/customer/screen"); return null; }

  const shows = getShowsByMovieAndTheatre(booking.movie.id, booking.theatre.id)
    .filter(s => s.screenId === booking.screen.id);

  const displayShows = shows.length > 0
    ? shows
    : getShowsByMovieAndTheatre(booking.movie.id, booking.theatre.id);

  const handleSelect = (show) => {
    setShow(show);
    navigate("/customer/seats");
  };

  return (
    <div className="booking-step-page fade-in">
      <div className="booking-step-header">
        <h1>Select <span className="text-accent">Showtime</span></h1>
        <p className="booking-context">
          {booking.movie.title} · {booking.theatre.name} · {booking.screen.name}
        </p>
      </div>

      {displayShows.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: "3rem" }} aria-hidden="true">🕐</div>
          <p>No shows available for today</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/customer/theatre")}>
            Try Another Theatre
          </button>
        </div>
      ) : (
        <div>
          <div className="showtime-date">
            📅 Today, {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <div className="showtime-grid">
            {displayShows.map(show => {
              const occ = occupancyColor(show.occupancy);
              return (
                <button
                  key={show.id}
                  type="button"
                  id={`show-${show.id}`}
                  className="showtime-card"
                  onClick={() => handleSelect(show)}
                >
                  <div className="showtime-card-time">{show.time}</div>
                  <div className="showtime-card-status" style={{ color: occ.color }}>
                    ● {occ.label} ({show.occupancy}%)
                  </div>
                  <div className="showtime-prices">
                    <span className="showtime-price">Regular: ₹{show.price.regular}</span>
                    <span className="showtime-price premium">Premium: ₹{show.price.premium}</span>
                    <span className="showtime-price vip">VIP: ₹{show.price.vip}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
