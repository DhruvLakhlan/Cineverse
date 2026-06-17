import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "customer" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = register(form.name, form.email, form.password, form.role);
    if (result.success) {
      const map = { customer: "/customer/dashboard", owner: "/owner/dashboard", admin: "/admin/dashboard" };
      navigate(map[result.user.role]);
    }
    setLoading(false);
  };

  const field = (key) => ({
    value: form[key],
    onChange: e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: "" })); },
    className: `input-field ${errors[key] ? "input-error" : ""}`,
  });

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
              Join CineVerse.<br />
              <span>Discover Cinema.</span><br />
              Book in Seconds.
            </h2>
            <p className="brand-subtitle">
              Create an account to browse schedules,<br />
              book your seats,<br />
              and review your favorites.
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
            <h1 className="auth-form-title">Create Account</h1>

            <form onSubmit={handleSubmit} className="auth-form-redesign">
              <div className="input-group">
                <label className="input-label" htmlFor="signup-name">Full Name</label>
                <input id="signup-name" type="text" placeholder="John Doe" {...field("name")} />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="signup-email">Email Address</label>
                <input id="signup-email" type="email" placeholder="you@example.com" {...field("email")} />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="signup-role">I am a...</label>
                <select
                  id="signup-role"
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  className="input-field"
                >
                  <option value="customer">Customer</option>
                  <option value="owner">Theatre Owner</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="signup-password">Password</label>
                <input id="signup-password" type="password" placeholder="••••••••" {...field("password")} />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="signup-confirm">Confirm Password</label>
                <input id="signup-confirm" type="password" placeholder="••••••••" {...field("confirm")} />
                {errors.confirm && <span className="error-text">{errors.confirm}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-lg auth-submit-btn" disabled={loading} id="signup-submit">
                {loading && <span className="btn-spinner" />}
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="auth-footer-text">
              Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
