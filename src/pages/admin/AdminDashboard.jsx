import { users } from "../../data/users";
import { theatres } from "../../data/theatres";
import { getAllBookings } from "../../data/bookings";
import { movies } from "../../data/movies";
import "../dashboard/DashboardPages.css";

const StatCard = ({ icon, label, value, color = "var(--accent-primary)", sub }) => (
  <div className="glass-card dashboard-stat-card">
    <div className="dashboard-stat-icon" style={{ background: `${color}15`, border: `1px solid ${color}30`, width: 52, height: 52, fontSize: "1.5rem" }}>{icon}</div>
    <div>
      <div className="dashboard-stat-value" style={{ color, fontSize: "2.2rem" }}>{value}</div>
      <div className="dashboard-stat-label">{label}</div>
      {sub && <div className="dashboard-stat-trend" style={{ marginTop: 6 }}>↑ {sub}</div>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const allBookings = getAllBookings();
  const totalRevenue = allBookings.reduce((s, b) => s + b.totalAmount, 0);

  const genreCount = movies.reduce((acc, m) => {
    m.genre.forEach(g => { acc[g] = (acc[g] || 0) + 1; });
    return acc;
  }, {});
  const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="fade-in container" style={{ paddingTop: 20 }}>
      <div className="dashboard-page-header">
        <h1>Admin <span className="text-accent">Dashboard</span></h1>
        <p className="text-muted">Platform overview and analytics</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        <StatCard icon="👥" label="Total Users" value={users.length} color="var(--accent-secondary)" sub="2 new this week" />
        <StatCard icon="🎭" label="Total Theatres" value={theatres.length} color="var(--accent-purple)" sub="1 pending" />
        <StatCard icon="🎟️" label="Total Bookings" value={allBookings.length} color="var(--accent-gold)" sub="20% up" />
        <StatCard icon="💰" label="Platform Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}K`} color="#4ade80" sub="38% up" />
      </div>

      <div className="grid-2" style={{ gap: 24 }}>
        {/* Genre Distribution */}
        <div className="glass-card dashboard-section-card">
          <h3 className="dashboard-section-title" style={{ borderColor: "var(--accent-secondary)" }}>Top Genres</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {topGenres.map(([genre, count]) => (
              <div key={genre}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.88rem" }}>
                  <span style={{ fontWeight: 600 }}>{genre}</span>
                  <span style={{ color: "var(--text-muted)" }}>{count} movies</span>
                </div>
                <div className="genre-bar-track">
                  <div className="genre-bar-fill" style={{ width: `${(count / movies.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card dashboard-section-card">
          <h3 className="dashboard-section-title">Recent Bookings</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {allBookings.slice(0, 5).map(b => (
              <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border-color)" }}>
                <div>
                  <p style={{ fontWeight: 750, fontSize: "0.92rem", color: "var(--text-primary)" }}>{b.movieTitle}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>ID: {b.id} • {b.showDate}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 800, color: "var(--accent-primary)" }}>₹{b.totalAmount}</p>
                  <span className={`badge badge-${b.status === "confirmed" ? "success" : b.status === "cancelled" ? "danger" : "info"}`} style={{ fontSize: "0.68rem", fontWeight: 750, textTransform: "uppercase", marginTop: 4, display: "inline-block" }}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
