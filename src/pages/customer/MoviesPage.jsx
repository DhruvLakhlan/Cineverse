import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { movies, genres } from "../../data/movies";
import { useBooking } from "../../context/BookingContext";
import "./MoviesPage.css";

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setMovie } = useBooking();
  const search = searchParams.get("search") || "";
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const setSearch = (val) => {
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const languages = ["All", "Hindi", "English", "Tamil", "Telugu", "Malayalam", "Kannada"];

  const filtered = useMemo(() => {
    let result = movies.filter((m) => {
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.genre.some(g => g.toLowerCase().includes(search.toLowerCase())) ||
        m.director.toLowerCase().includes(search.toLowerCase());
      const matchGenre = selectedGenre === "All" || m.genre.includes(selectedGenre);
      const matchLanguage = selectedLanguage === "All" || m.language === selectedLanguage;
      const matchStatus = selectedStatus === "all" || m.status === selectedStatus;
      return matchSearch && matchGenre && matchLanguage && matchStatus;
    });

    // Sort
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "duration") {
      result.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [search, selectedGenre, selectedLanguage, selectedStatus, sortBy]);

  const handleBookTickets = (movie) => {
    setMovie(movie);
    navigate("/customer/location");
  };

  return (
    <div className="movies-page fade-in">
      <div className="movies-header">
        <div>
          <h1 className="movies-heading">Movies</h1>
          <p className="movies-subtitle">Discover trending and upcoming movies</p>
        </div>
      </div>

      {/* Filters */}
      <div className="movies-filters">
        {/* Search */}
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="movie-search"
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field search-input"
          />
          {search && (
            <button type="button" className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">✕</button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="sort-dropdown-wrapper">
          <select
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Sort by Rating</option>
            <option value="duration">Sort by Duration</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Status filter */}
      <div className="filter-pills">
        {[
          { val: "all", label: "All Movies" },
          { val: "now_showing", label: "Now Showing" },
          { val: "upcoming", label: "Upcoming" },
        ].map(opt => (
          <button
            type="button"
            key={opt.val}
            id={`filter-${opt.val}`}
            className={`filter-pill ${selectedStatus === opt.val ? "active" : ""}`}
            onClick={() => setSelectedStatus(opt.val)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Genre chips */}
      <div className="genre-chips">
        {genres.map(g => (
          <button
            type="button"
            key={g}
            id={`genre-${g}`}
            className={`genre-chip ${selectedGenre === g ? "active" : ""}`}
            onClick={() => setSelectedGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Language chips */}
      <div className="language-chips">
        {languages.map(lang => (
          <button
            type="button"
            key={lang}
            className={`language-chip ${selectedLanguage === lang ? "active" : ""}`}
            onClick={() => setSelectedLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Movie Cards */}
      <div className="movies-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: "4rem" }}>🎬</div>
            <p>No movies match your search. Try different filters.</p>
          </div>
        ) : (
          filtered.map(movie => (
            <div key={movie.id} className="movie-card">
              <div className="movie-poster-wrapper">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-poster"
                  onError={e => { e.target.src = `https://placehold.co/400x600/1a1a26/ffffff?text=${encodeURIComponent(movie.title)}`; }}
                />
                <div className="movie-rating-badge">
                  ⭐ {movie.rating}
                </div>
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                  <span className="movie-genre">{movie.genre.join(", ")}</span>
                  <span className="movie-duration">{movie.duration} min</span>
                </div>
                <button
                  type="button"
                  className="book-tickets-btn"
                  onClick={() => handleBookTickets(movie)}
                  disabled={movie.status !== "now_showing"}
                >
                  {movie.status === "now_showing" ? "Book Tickets" : "Coming Soon"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
