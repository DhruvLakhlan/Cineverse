import { useParams, useNavigate } from "react-router-dom";
import { getMovieById, getNowShowing } from "../../data/movies";
import { useBooking } from "../../context/BookingContext";
import MovieCard from "../../components/movie/MovieCard";
import "./MovieDetails.css";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setMovie } = useBooking();
  const movie = getMovieById(id);

  if (!movie) {
    return (
      <div className="empty-state" style={{ minHeight: "60vh" }}>
        <div style={{ fontSize: "4rem" }}>🎬</div>
        <p>Movie not found</p>
        <button className="btn btn-primary" onClick={() => navigate("/customer/movies")}>Browse Movies</button>
      </div>
    );
  }

  const handleBookNow = () => {
    setMovie(movie);
    navigate("/customer/location");
  };

  const ratingColor = movie.rating >= 8 ? "#4ade80" : movie.rating >= 6 ? "var(--accent-gold)" : "#f87171";

  // Mock Reviews
  const mockReviews = [
    { id: 1, user: "Karan Johar", text: "Absolute masterpiece! The visuals and storytelling are truly spectacular.", rating: 9 },
    { id: 2, user: "Riya Sen", text: "Great performance by the lead cast. A must-watch with your family.", rating: 8 },
    { id: 3, user: "Amit V", text: "A bit slow in the middle, but the climax makes it fully worth it.", rating: 7 }
  ];

  // Recommended Movies (filter by same status, exclude current)
  const recommended = getNowShowing().filter(m => m.id !== movie.id).slice(0, 4);

  return (
    <div className="movie-details-page fade-in">
      {/* 420px Cinematic Banner */}
      <div className="movie-detail-banner" style={{ backgroundImage: `url(${movie.banner})` }}>
        <div className="movie-detail-banner-overlay" />
      </div>

      <div className="movie-detail-content">
        <div className="movie-detail-layout">
          {/* Poster Container */}
          <div className="movie-detail-poster-col">
            <div className="movie-detail-poster-wrapper">
              <img
                src={movie.poster}
                alt={movie.title}
                className="movie-detail-poster"
                onError={e => { e.target.src = `https://placehold.co/400x600/1a1a26/ffffff?text=${encodeURIComponent(movie.title)}`; }}
              />
              <div className="movie-detail-rating-badge" style={{ color: ratingColor, borderColor: ratingColor }}>
                ⭐ {movie.rating} IMDb
              </div>
            </div>
          </div>

          {/* Info Details */}
          <div className="movie-detail-info">
            {/* Genre Pills */}
            <div className="movie-detail-genres-row">
              {movie.genre.map(g => (
                <span key={g} className="genre-pill">{g}</span>
              ))}
            </div>
            
            <h1 className="movie-detail-title">{movie.title}</h1>

            <div className="movie-detail-meta">
              <div className="meta-item"><span>🎬</span><span>{movie.director}</span></div>
              <div className="meta-item"><span>⏱</span><span>{movie.duration} minutes</span></div>
              <div className="meta-item"><span>🌐</span><span>{movie.language}</span></div>
              <div className="meta-item"><span>📅</span><span>{new Date(movie.releaseDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></div>
            </div>

            <div className="movie-detail-section">
              <h3>Synopsis</h3>
              <p className="movie-synopsis">{movie.description}</p>
            </div>

            {/* Cast Section */}
            <div className="movie-detail-section">
              <h3>Cast</h3>
              <div className="cast-list">
                {movie.cast.map(member => (
                  <div key={member} className="cast-card">
                    <div className="cast-avatar">{member.charAt(0)}</div>
                    <span className="cast-name">{member}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trailer Section */}
            <div className="movie-detail-section">
              <h3>Trailer</h3>
              <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="trailer-link">
                <div className="trailer-card">
                  <div className="trailer-play-icon">▶</div>
                  <span>Watch Official Trailer</span>
                </div>
              </a>
            </div>

            {/* Prices */}
            <div className="movie-detail-prices">
              <h3>Ticket Prices</h3>
              <div className="price-list">
                <div className="price-item">
                  <span className="badge badge-secondary">Regular</span>
                  <span className="price-value">₹{movie.price.regular}</span>
                </div>
                <div className="price-item">
                  <span className="badge badge-gold">Premium</span>
                  <span className="price-value">₹{movie.price.premium}</span>
                </div>
                <div className="price-item">
                  <span className="badge badge-purple">VIP</span>
                  <span className="price-value">₹{movie.price.vip}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="movie-detail-actions">
              {movie.status === "now_showing" ? (
                <button className="btn btn-primary btn-lg" id="book-now-btn" onClick={handleBookNow}>
                  🎟️ Book Tickets
                </button>
              ) : (
                <button className="btn btn-secondary btn-lg" disabled>
                  🔔 Notify Me
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="movie-reviews-section">
          <h3 className="sub-section-title">⭐ Reviews & Ratings</h3>
          <div className="reviews-grid">
            {mockReviews.map((rev) => (
              <div key={rev.id} className="review-glass-card">
                <div className="review-header">
                  <h4>{rev.user}</h4>
                  <span className="review-rating-badge">★ {rev.rating}/10</span>
                </div>
                <p className="review-text">"{rev.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Movies */}
        <div className="movie-recommended-section">
          <h3 className="sub-section-title">📺 Recommended Movies</h3>
          <div className="recommended-grid">
            {recommended.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
