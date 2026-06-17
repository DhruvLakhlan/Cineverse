import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { theatres, getTheatresByCity, cities } from "../../data/theatres";
import { useBooking } from "../../context/BookingContext";
import "./TheatrePage.css";

export default function TheatrePage() {
  const { booking, setTheatre, setCity } = useBooking();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cityFilter, setCityFilter] = useState(booking.city || "");
  const [search, setSearch] = useState("");

  const theatreId = searchParams.get("theatreId");
  const isBookingFlow = !!booking.movie;

  useEffect(() => {
    if (isBookingFlow && !booking.city) {
      navigate("/customer/location");
    }
  }, [isBookingFlow, booking.city, navigate]);

  const activeCity = booking.city || cityFilter;
  const baseTheatres = activeCity
    ? getTheatresByCity(activeCity)
    : theatres.filter((t) => t.status === "approved");

  const filteredTheatres = baseTheatres.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.address.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (theatreId) {
      const el = document.getElementById(`theatre-${theatreId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [theatreId, filteredTheatres.length]);

  const handleSelect = (theatre) => {
    setTheatre(theatre);
    if (!booking.city) setCity(theatre.city);
    navigate("/customer/screen");
  };

  const handleCityFilter = (cityName) => {
    setCityFilter(cityName);
    if (!booking.city) setCity(cityName);
  };

  if (isBookingFlow && !booking.city) {
    return (
      <div className="theatre-page fade-in">
        <div className="theatre-loading"><span className="spinner" style={{ width: 32, height: 32, marginRight: 12 }} />Loading theatres…</div>
      </div>
    );
  }

  return (
    <div className="theatre-page fade-in">
      <div className="theatre-header">
        <h1>
          {isBookingFlow ? "Select" : "Browse"}{" "}
          <span className="text-accent">Theatre{activeCity ? "" : "s"}</span>
        </h1>
        <p className="theatre-subtitle">
          {isBookingFlow && booking.movie
            ? `${booking.movie.title} · ${booking.city || activeCity || "All cities"}`
            : "Discover premium cinema experiences near you"}
        </p>
      </div>

      {!isBookingFlow && (
        <div className="theatre-filters">
          <div className="theatre-search-wrap">
            <span className="theatre-search-icon">🔍</span>
            <input
              type="text"
              className="input-field theatre-search-input"
              placeholder="Search theatres or cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="theatre-city-chips">
            <button
              type="button"
              className={`theatre-city-chip ${!cityFilter ? "active" : ""}`}
              onClick={() => setCityFilter("")}
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city.id}
                type="button"
                className={`theatre-city-chip ${cityFilter === city.name ? "active" : ""}`}
                onClick={() => handleCityFilter(city.name)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredTheatres.length === 0 ? (
        <div className="empty-state theatre-empty">
          <div className="theatre-empty-icon">🎭</div>
          <p>
            {activeCity
              ? `No theatres in ${activeCity} yet`
              : "No theatres match your search"}
          </p>
          {activeCity ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setCityFilter("");
                if (isBookingFlow) navigate("/customer/location");
              }}
            >
              {isBookingFlow ? "Change City" : "Show All Theatres"}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="theatre-list">
          {filteredTheatres.map((theatre) => (
            <div
              key={theatre.id}
              id={`theatre-${theatre.id}`}
              className="theatre-card glass-card"
              onClick={() => handleSelect(theatre)}
              onKeyDown={(e) => e.key === "Enter" && handleSelect(theatre)}
              role="button"
              tabIndex={0}
            >
              <div className="theatre-card-inner">
                <img
                  src={theatre.image}
                  alt={theatre.name}
                  className="theatre-card-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="theatre-card-body">
                  <div className="theatre-card-top">
                    <div>
                      <h3>{theatre.name}</h3>
                      <p className="theatre-card-address">📍 {theatre.address}</p>
                      {!activeCity && (
                        <span className="theatre-card-city">{theatre.city}</span>
                      )}
                    </div>
                    <div className="theatre-card-meta">
                      <div className="theatre-card-rating">
                        <span>⭐</span>
                        <span>{theatre.rating}</span>
                      </div>
                      <span className="text-muted text-sm">📏 {theatre.distance}</span>
                    </div>
                  </div>
                  <div className="theatre-card-facilities">
                    {theatre.facilities.map((f) => (
                      <span key={f} className="badge badge-secondary">
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="theatre-card-footer">
                    <span className="text-muted text-sm">🖥️ {theatre.screens} Screens</span>
                    <span className="btn btn-primary btn-sm">Select →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
