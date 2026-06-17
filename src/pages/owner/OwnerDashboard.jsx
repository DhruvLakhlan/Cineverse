import { useAuth } from "../../context/AuthContext";
import { getAllBookings } from "../../data/bookings";
import { movies } from "../../data/movies";
import { shows } from "../../data/shows";
import "../dashboard/DashboardPages.css";

const StatCard = ({ icon, label, value, color = "var(--accent-primary)", trend }) => (
  <div className="glass-card dashboard-stat-card">
    <div className="dashboard-stat-icon-wrap">
      <div className="dashboard-stat-icon" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>{icon}</div>
      {trend && <span className="dashboard-stat-trend">↑ {trend}</span>}
    </div>
    <div>
      <div className="dashboard-stat-value" style={{ color }}>{value}</div>
      <div className="dashboard-stat-label">{label}</div>
    </div>
  </div>
);

export default function OwnerDashboard() {
  const { user } = useAuth();
  const allBookings = getAllBookings();
  const ownerBookings = allBookings.filter(b => b.theatreId === 1);
  const revenue = ownerBookings.reduce((s, b) => s + b.totalAmount, 0);
  const activeShows = shows.filter(s => s.theatreId === 1).length;

  return (
    <div className="fade-in container" style={{ paddingTop: 20 }}>
      <div className="dashboard-page-header">
        <h1>Theatre <span className="text-accent">Dashboard</span></h1>
        <p className="text-muted">Welcome back, <strong style={{ color: "var(--text-primary)" }}>{user?.name}</strong></p>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        <StatCard icon="🎬" label="Total Movies" value={movies.length} color="var(--accent-secondary)" trend="2 this week" />
        <StatCard icon="🎟️" label="Total Bookings" value={ownerBookings.length} color="var(--accent-purple)" trend="12% up" />
        <StatCard icon="🕐" label="Active Shows" value={activeShows} color="var(--accent-gold)" />
        <StatCard icon="💰" label="Revenue (₹)" value={`${(revenue / 1000).toFixed(1)}K`} color="#4ade80" trend="18% up" />
      </div>

      {/* Recent Bookings */}
      <div className="glass-card dashboard-section-card">
        <h3 className="dashboard-section-title">Recent Bookings</h3>
        {ownerBookings.length === 0 ? (
          <div className="empty-state" style={{ padding: "40px 0" }}>
            <p>No bookings yet</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Movie</th>
                  <th>Seats</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ownerBookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700, color: "#FFFFFF" }}>{b.id}</td>
                    <td>{b.movieTitle}</td>
                    <td style={{ fontWeight: 600, color: "var(--accent-secondary)" }}>{b.seats.join(", ")}</td>
                    <td>{b.showDate}</td>
                    <td style={{ color: "var(--accent-primary)", fontWeight: 800 }}>₹{b.totalAmount}</td>
                    <td>
                      <span className={`badge badge-${b.status === "confirmed" ? "success" : b.status === "cancelled" ? "danger" : "info"}`} style={{ textTransform: "uppercase", fontSize: "0.72rem", fontWeight: 750 }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
