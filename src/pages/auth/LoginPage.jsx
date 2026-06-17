import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setGlobalError("");
    await new Promise(r => setTimeout(r, 800));
    const result = login(form.email, form.password);
    if (result.success) {
      const map = { customer: "/customer/dashboard", owner: "/owner/dashboard", admin: "/admin/dashboard" };
      navigate(map[result.user.role]);
    } else {
      setGlobalError(result.error);
    }
    setLoading(false);
  };

  const handleGuestLogin = () => {
    navigate("/customer/movies");
  };

  return (
    <div className="auth-page split-layout fade-in-scale">
      {/* LEFT SIDE: Brand & Feature Collage */}
      <div className="auth-left-panel">
        <div className="collage-bg" />
        <div className="panel-overlay" />
        
        <div className="panel-content">
          <div className="brand-logo">
            <span className="brand-icon">🎬</span>
            <span className="brand-text">Cine<span>Verse</span></span>
          </div>

          <div className="hero-text-group">
            <h2 className="brand-headline">
              Book Tickets.<br />
              <span>Skip the Queue.</span><br />
              Enjoy the Show.
            </h2>
            <p className="brand-subtitle">
              Find movies near you,<br />
              choose your seats,<br />
              and reserve tickets in seconds.
            </p>
          </div>

          <div className="feature-cards-grid">
            <div className="feat-card">
              <div className="feat-icon">🎟</div>
              <div className="feat-info">
                <h4>Instant Booking</h4>
                <p>Reserve seats in under a minute</p>
              </div>
            </div>

            <div className="feat-card">
              <div className="feat-icon">📍</div>
              <div className="feat-info">
                <h4>Nearby Theatres</h4>
                <p>Discover cinemas around you</p>
              </div>
            </div>

            <div className="feat-card">
              <div className="feat-icon">⭐</div>
              <div className="feat-info">
                <h4>Ratings & Reviews</h4>
                <p>Choose the perfect movie night</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Card */}
      <div className="auth-right-panel">
        <div className="auth-card-wrapper">
          <div className="auth-glass-card">
            <h1 className="auth-form-title">Sign in to CineVerse</h1>

            <form onSubmit={handleSubmit} className="auth-form-redesign">
              {globalError && (
                <div className="auth-global-error">
                  <span>⚠️</span> {globalError}
                </div>
              )}

              <div className="input-group">
                <label className="input-label" htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  className={`input-field ${errors.email ? "input-error" : ""}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: "" })); }}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  className={`input-field ${errors.password ? "input-error" : ""}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: "" })); }}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="auth-options">
                <label className="remember-me-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="#" className="forgot-password-link">Forgot Password?</Link>
              </div>

              <button type="submit" className="btn btn-primary btn-lg auth-submit-btn" disabled={loading} id="login-submit">
                {loading && <span className="btn-spinner" />}
                {loading ? "Signing in..." : "Continue"}
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-lg auth-guest-btn"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </button>

            <p className="auth-footer-text">
              Don't have an account? <Link to="/signup" className="auth-link">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
