import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cities } from "../../data/theatres";
import { useBooking } from "../../context/BookingContext";
import "./BookingFlow.css";

export default function LocationPage() {
  const { booking, setCity } = useBooking();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = cities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city) => {
    setCity(city.name);
    navigate("/customer/theatre");
  };

  if (!booking.movie) {
    navigate("/customer/movies");
    return null;
  }

  return (
    <div className="booking-step-page fade-in">
      <div className="booking-step-header">
        <h1>Select <span className="text-accent">City</span></h1>
        <p className="booking-context">
          Booking for: <strong>{booking.movie.title}</strong>
        </p>
      </div>

      <div className="booking-search-wrap">
        <span className="booking-search-icon" aria-hidden="true">🔍</span>
        <input
          id="city-search"
          type="text"
          placeholder="Search city..."
          className="input-field booking-search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search city"
        />
      </div>

      <div className="grid-3 city-grid">
        {filtered.map(city => (
          <button
            key={city.id}
            type="button"
            id={`city-${city.id}`}
            className="city-card"
            onClick={() => handleSelect(city)}
          >
            <span className="city-card-icon" aria-hidden="true">🏙️</span>
            <div>
              <p className="city-card-name">{city.name}</p>
              <p className="city-card-state">{city.state}</p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: "3rem" }} aria-hidden="true">🏙️</div>
          <p>No cities found</p>
        </div>
      )}
    </div>
  );
}
