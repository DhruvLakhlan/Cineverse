import { Link } from "react-router-dom";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  const statusLabel = movie.status === "now_showing" ? "Now Showing" : "Upcoming";
  const statusClass = movie.status === "now_showing" ? "badge-success" : "badge-info";

  const starCount = Math.round(movie.rating / 2);
  const starsString = "★".repeat(starCount) + "☆".repeat(5 - starCount);

  return (
    <Link to={`/customer/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster-wrapper">
        <img
          src={movie.poster}
          alt={movie.title}
          className="movie-poster"
          onError={e => { e.target.src = `https://placehold.co/400x600/1a1a26/ffffff?text=${encodeURIComponent(movie.title)}`; }}
        />
        <div className="movie-overlay" aria-hidden="true">
          <span className="movie-play-btn">▶</span>
        </div>
        <div className="movie-status">
          <span className={`badge ${statusClass}`}>{statusLabel}</span>
        </div>
        <div className="movie-rating-badge">
          <span>⭐</span>
          <span>{movie.rating}</span>
        </div>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-stars-rating" aria-label={`Rating ${movie.rating} out of 10`}>{starsString}</div>
        <div className="movie-meta">
          <span className="movie-genre">{movie.genre[0]}</span>
          <span className="movie-duration">⏱ {movie.duration}m</span>
        </div>
        <div className="movie-footer-row">
          <span className="movie-lang">{movie.language}</span>
          <span className="movie-book-label">Book Now</span>
        </div>
      </div>
    </Link>
  );
}
