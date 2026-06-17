import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import "./Navbar.css";

const CineVerseLogo = ({ to }) => (
  <Link to={to} className="navbar-logo">
    <span className="logo-icon">🎬</span>
    <span className="logo-text">Cine<span>Verse</span></span>
  </Link>
);

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isCustomerNav = user?.role === "customer" || !isAuthenticated;
  const logoLink = isAuthenticated && user?.role === "customer"
    ? "/customer/dashboard"
    : "/customer/movies";

  const guestNavLinks = [
    { label: "Movies", path: "/customer/movies" },
    { label: "Theatres", path: "/customer/theatre" },
    { label: "Sign In", path: "/login" },
  ];

  const customerNavLinks = [
    { label: "Movies", path: "/customer/movies" },
    { label: "Theatres", path: "/customer/theatre" },
    { label: "Bookings", path: "/customer/history" },
    { label: "Profile", path: "/customer/profile" },
  ];

  const navLinks = !isAuthenticated
    ? guestNavLinks
    : user?.role === "customer"
      ? customerNavLinks
      : [];

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "customer") return "/customer/dashboard";
    if (user.role === "owner") return "/owner/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/login";
  };

  const isActive = (path) => location.pathname === path;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (location.pathname !== "/customer/movies") {
      navigate(`/customer/movies?search=${encodeURIComponent(value)}`);
    } else {
      setSearchParams(value ? { search: value } : {});
    }
  };

  const currentSearch = searchParams.get("search") || "";

  const notifications = [
    { id: 1, text: "🎉 Booking Confirmed for Spider-Man", time: "2 hours ago" },
    { id: 2, text: "🍿 Mid-week offer: 20% off on popcorn combo!", time: "1 day ago" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <CineVerseLogo to={logoLink} />

          {isCustomerNav && (
            <div className="navbar-links">
              {navLinks.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-link ${isActive(path) ? "active" : ""}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {isCustomerNav && (
          <div className="navbar-search-container">
            <span className="nav-search-icon">🔍</span>
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Search movies or theatres..."
              value={currentSearch}
              onChange={handleSearchChange}
              aria-label="Search movies or theatres"
            />
          </div>
        )}

        <div className="navbar-right">
          {isCustomerNav && (
            <button
              type="button"
              className="navbar-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
              <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
              <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
            </button>
          )}

          {isAuthenticated ? (
            <div className="navbar-actions">
              {user?.role === "customer" && (
                <div className="nav-bell-wrapper">
                  <button
                    type="button"
                    className="nav-bell-btn"
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setUserMenuOpen(false);
                    }}
                    aria-label="Notifications"
                  >
                    <span>🔔</span>
                    <span className="bell-badge" />
                  </button>
                  {notificationsOpen && (
                    <div className="notifications-dropdown">
                      <div className="notifications-header">
                        <h4>Notifications</h4>
                      </div>
                      <div className="notifications-list">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="notification-item">
                            <p>{notif.text}</p>
                            <span>{notif.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="nav-avatar-wrapper">
                <button
                  type="button"
                  className="nav-avatar"
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationsOpen(false);
                  }}
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  {user?.avatar || "U"}
                </button>
                {userMenuOpen && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      <p className="nav-dropdown-name">{user?.name}</p>
                      <p className="nav-dropdown-role">{user?.role}</p>
                    </div>
                    <div className="nav-dropdown-divider" />
                    <Link to={getDashboardLink()} className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <span>🏠</span> Dashboard
                    </Link>
                    {user?.role === "customer" && (
                      <>
                        <Link to="/customer/profile" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                          <span>👤</span> Profile
                        </Link>
                        <Link to="/customer/settings" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                          <span>⚙️</span> Settings
                        </Link>
                      </>
                    )}
                    <div className="nav-dropdown-divider" />
                    <button type="button" className="nav-dropdown-item danger" onClick={handleLogout}>
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="navbar-auth-btns">
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {isCustomerNav && mobileOpen && (
        <>
          <div className="navbar-mobile-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="navbar-mobile-drawer">
            <div className="navbar-mobile-search">
              <span className="nav-search-icon">🔍</span>
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Search movies or theatres..."
                value={currentSearch}
                onChange={handleSearchChange}
                aria-label="Search movies or theatres"
              />
            </div>
            <nav className="navbar-mobile-links">
              {navLinks.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-mobile-link ${isActive(path) ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
            {!isAuthenticated && (
              <div className="navbar-mobile-auth">
                <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
