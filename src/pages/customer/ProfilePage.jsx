import { useAuth } from "../../context/AuthContext";
import { getBookingsByUser } from "../../data/bookings";
import { movies } from "../../data/movies";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "Customer User",
    email: user?.email || "customer@cineverse.com",
    mobile: user?.mobile || "+91 98765 43210",
    preferredLocation: user?.preferredLocation || "Mumbai",
  });

  const bookings = getBookingsByUser(user?.id || 1).slice(0, 2);
  const favoriteGenres = ["Action", "Sci-Fi", "Thriller"];

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="profile-page fade-in container">
      <div className="profile-page-header">
        <div>
          <h1>My <span className="text-accent">Profile</span></h1>
          <p className="text-muted">Manage your membership details and settings</p>
        </div>
        <button type="button" className="btn btn-primary" id="edit-profile-btn" onClick={() => editing ? handleSave() : setEditing(true)}>
          {editing ? "💾 Save Changes" : "✏️ Edit Profile"}
        </button>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="glass-card profile-avatar-card">
            <div className="profile-avatar">{user?.avatar || "G"}</div>
            <h3 className="profile-avatar-name">{form.name}</h3>
            <div>
              <span className="badge badge-gold" style={{ padding: "6px 16px", fontSize: "0.75rem", letterSpacing: "1px", fontWeight: 750 }}>
                ⭐ GOLD MEMBER
              </span>
            </div>
            <p className="profile-member-since">
              Member since {new Date(user?.joinDate || Date.now()).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="glass-card profile-genres-card">
            <h4 className="profile-section-title">❤️ Favorite Genres</h4>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {favoriteGenres.map(genre => (
                <span key={genre} className="badge badge-primary" style={{ padding: "6px 12px", textTransform: "none", fontSize: "0.78rem" }}>
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-main">
          <div className="glass-card profile-info-card">
            <h3 className="profile-info-heading">Personal Information</h3>
            <div className="profile-fields-grid">
              {[
                { label: "Full Name", key: "name", icon: "👤" },
                { label: "Email Address", key: "email", icon: "📧" },
                { label: "Mobile Number", key: "mobile", icon: "📱" },
                { label: "Preferred City", key: "preferredLocation", icon: "📍" },
              ].map(f => (
                <div key={f.key} className="input-group">
                  <label className="input-label" htmlFor={`profile-${f.key}`}>{f.icon} {f.label}</label>
                  {editing ? (
                    <input
                      id={`profile-${f.key}`}
                      type="text"
                      className="input-field"
                      value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    />
                  ) : (
                    <div className="profile-field-value">{form[f.key] || "—"}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card profile-bookings-card">
            <div className="profile-bookings-header">
              <h3 className="profile-bookings-title">Recent Bookings</h3>
              <Link to="/customer/history" className="profile-bookings-link">View All →</Link>
            </div>
            {bookings.length === 0 ? (
              <p className="text-muted text-sm">No recent bookings found.</p>
            ) : (
              <div>
                {bookings.map(booking => {
                  const movie = movies.find(m => m.id === booking.movieId);
                  return (
                    <div key={booking.id} className="profile-booking-row">
                      <div className="profile-booking-info">
                        {movie && (
                          <img src={movie.poster} alt={booking.movieTitle} className="profile-booking-poster" />
                        )}
                        <div>
                          <h4 className="profile-booking-title">{booking.movieTitle}</h4>
                          <p className="profile-booking-meta">{booking.showDate} • {booking.showTime}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--accent-primary)" }}>₹{booking.totalAmount}</span>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{booking.seats.length} Seats</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
