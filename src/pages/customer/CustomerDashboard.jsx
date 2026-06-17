import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getNowShowing, getUpcoming } from "../../data/movies";
import { theatres } from "../../data/theatres";
import MovieCard from "../../components/movie/MovieCard";
import "./CustomerDashboard.css";

const BANNER_MOVIE = getNowShowing()[0];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const nowShowing = getNowShowing();
  const upcoming = getUpcoming();
  const userCity = user?.preferredLocation || "Mumbai";
  const localTheatres = theatres.filter(t => t.city === userCity && t.status === "approved").slice(0, 3);
  const displayTheatres = localTheatres.length > 0
    ? localTheatres
    : theatres.filter(t => t.status === "approved").slice(0, 3);

  const handleBookNow = (movieId) => {
    navigate(`/customer/movie/${movieId}`);
  };

  return (
    <div className="dashboard-page">
      <section
        className="hero-banner-380"
        style={{ backgroundImage: `url(${BANNER_MOVIE.banner})` }}
      >
        <div className="hero-380-overlay" />
        <div className="hero-380-content">
          <div className="hero-380-left">
            <img
              src={BANNER_MOVIE.poster}
              alt={BANNER_MOVIE.title}
              className="hero-380-poster"
              onError={(e) => {
                e.target.src = `https://placehold.co/400x600/1a1a26/ffffff?text=${encodeURIComponent(BANNER_MOVIE.title)}`;
              }}
            />
          </div>
          <div className="hero-380-right">
            <div className="hero-380-meta-badges">
              <span className="hero-380-rating">⭐ {BANNER_MOVIE.rating} IMDb</span>
              {BANNER_MOVIE.genre.map((g) => (
                <span key={g} className="hero-380-genre-pill">{g}</span>
              ))}
              <span className="hero-380-date">{BANNER_MOVIE.releaseDate}</span>
              <span className="hero-380-lang">{BANNER_MOVIE.language}</span>
            </div>
            <h1 className="hero-380-title">{BANNER_MOVIE.title}</h1>
            <p className="hero-380-desc">{BANNER_MOVIE.description}</p>
            <div className="hero-380-actions">
              <button
                type="button"
                onClick={() => handleBookNow(BANNER_MOVIE.id)}
                className="btn btn-primary btn-lg"
                id="hero-book-now"
              >
                🎟️ Book Tickets
              </button>
              <a
                href={BANNER_MOVIE.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
                id="hero-watch-trailer"
              >
                ▶ Watch Trailer
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="dashboard-content">
        <div className="welcome-strip-redesign">
          <div>
            <h2>
              Welcome back,{" "}
              <span className="user-name-highlight">
                {user?.name ? user.name.split(" ")[0] : "Guest"}
              </span>{" "}
              👋
            </h2>
            <p className="welcome-subtitle">
              Explore movies and reserve seats in your favorite theatres around {userCity}
            </p>
          </div>
          <div className="quick-nav-btns">
            <Link to="/customer/movies" className="btn btn-outline btn-sm">All Movies</Link>
            {user && (
              <Link to="/customer/history" className="btn btn-secondary btn-sm">My Bookings</Link>
            )}
          </div>
        </div>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Trending <span>Movies</span></h2>
            <Link to="/customer/movies" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div className="movies-scroll-row movies-scroll-row--desktop">
            {nowShowing.map((movie) => (
              <div key={movie.id} className="movies-scroll-item">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          <div className="movies-grid-row movies-grid-row--mobile">
            {nowShowing.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section className="dashboard-section dashboard-section--spaced">
          <div className="section-header">
            <h2 className="section-title">🔜 Upcoming <span>Movies</span></h2>
            <Link to="/customer/movies?status=upcoming" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div className="movies-scroll-row movies-scroll-row--desktop">
            {upcoming.map((movie) => (
              <div key={movie.id} className="movies-scroll-item">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          <div className="movies-grid-row movies-grid-row--mobile">
            {upcoming.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section className="dashboard-section dashboard-section--spaced">
          <div className="section-header">
            <h2 className="section-title">📍 Nearby <span>Theatres</span></h2>
          </div>
          <div className="nearby-theatres-grid">
            {displayTheatres.map((theatre) => (
              <div key={theatre.id} className="theatre-glass-card">
                <div className="theatre-card-header">
                  <div className="theatre-card-title-group">
                    <h3>{theatre.name}</h3>
                    <p className="theatre-card-distance">📍 {theatre.distance} away · {theatre.city}</p>
                  </div>
                  <div className="theatre-card-rating">
                    <span>⭐</span> {theatre.rating}
                  </div>
                </div>
                <div className="theatre-card-info">
                  <p className="theatre-shows-label">
                    Available Shows:{" "}
                    <span className="shows-highlight">{theatre.screens * 3} Daily Shows</span>
                  </p>
                </div>
                <div className="theatre-card-footer">
                  <Link
                    to={`/customer/theatre?theatreId=${theatre.id}`}
                    className="btn btn-primary btn-sm theatre-book-btn"
                  >
                    Book Seats
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
