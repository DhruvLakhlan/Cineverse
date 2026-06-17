import { useState } from "react";
import { getScreensByTheatre } from "../../data/screens";
import "../dashboard/DashboardPages.css";

export default function SeatLayoutPage() {
  const screens = getScreensByTheatre(1);
  const [selectedScreen, setSelectedScreen] = useState(screens[0]);
  const [rows, setRows] = useState(selectedScreen?.rows || 8);
  const [cols, setCols] = useState(selectedScreen?.cols || 15);
  const [vipRows, setVipRows] = useState(2);
  const [premiumRows, setPremiumRows] = useState(2);

  const rowLabels = "ABCDEFGHIJKLMNOPQRST".slice(0, rows);

  const getSeatType = (rowIdx) => {
    if (rowIdx < vipRows) return "vip";
    if (rowIdx < vipRows + premiumRows) return "premium";
    return "regular";
  };

  const typeColors = { vip: "#a78bfa", premium: "var(--warning)", regular: "var(--accent-secondary)" };

  return (
    <div className="fade-in">
      <div className="dashboard-page-header">
        <h1>Seat Layout <span className="text-accent">Configuration</span></h1>
      </div>

      <div className="seat-layout-grid">
        <div className="card seat-layout-config">
          <h3 style={{ marginBottom: 16 }}>Configuration</h3>

          <div className="input-group" style={{ marginBottom: 16 }}>
            <label className="input-label" htmlFor="layout-screen">Select Screen</label>
            <select
              id="layout-screen"
              className="input-field"
              value={selectedScreen?.id}
              onChange={e => {
                const s = screens.find(sc => sc.id === Number(e.target.value));
                setSelectedScreen(s); setRows(s.rows); setCols(s.cols);
              }}
            >
              {screens.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div className="input-group">
              <label className="input-label" htmlFor="layout-rows">Rows</label>
              <input id="layout-rows" type="number" className="input-field" min={1} max={20} value={rows} onChange={e => setRows(Number(e.target.value))} />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="layout-cols">Columns</label>
              <input id="layout-cols" type="number" className="input-field" min={1} max={40} value={cols} onChange={e => setCols(Number(e.target.value))} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label" htmlFor="layout-vip" style={{ marginBottom: 8, display: "block" }}>VIP Rows (from front): {vipRows}</label>
            <input id="layout-vip" type="range" min={0} max={Math.min(4, rows)} value={vipRows} onChange={e => setVipRows(Number(e.target.value))} style={{ width: "100%", accentColor: "#a78bfa" }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="input-label" htmlFor="layout-premium" style={{ marginBottom: 8, display: "block" }}>Premium Rows: {premiumRows}</label>
            <input id="layout-premium" type="range" min={0} max={Math.min(6, rows - vipRows)} value={premiumRows} onChange={e => setPremiumRows(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--warning)" }} />
          </div>

          <div className="seat-layout-stats">
            <div className="seat-layout-stat-row">
              <span style={{ color: "#a78bfa" }}>VIP seats</span><span>{vipRows * cols}</span>
            </div>
            <div className="seat-layout-stat-row">
              <span style={{ color: "var(--warning)" }}>Premium seats</span><span>{premiumRows * cols}</span>
            </div>
            <div className="seat-layout-stat-row">
              <span style={{ color: "var(--accent-secondary)" }}>Regular seats</span><span>{(rows - vipRows - premiumRows) * cols}</span>
            </div>
          </div>

          <button type="button" className="btn btn-primary" style={{ width: "100%" }} id="save-layout-btn">💾 Save Layout</button>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 4 }}>Layout Preview</h3>
          <p className="text-muted text-sm" style={{ marginBottom: 20 }}>Total: {rows * cols} seats</p>

          <div className="seat-layout-screen">
            <div className="seat-layout-screen-curve">SCREEN</div>
          </div>

          <div className="seat-layout-preview">
            {[...rowLabels].map((row, rowIdx) => {
              const type = getSeatType(rowIdx);
              return (
                <div key={row} className="seat-layout-row">
                  <span className="seat-layout-row-label">{row}</span>
                  <div className="seat-layout-seats">
                    {Array.from({ length: cols }).map((_, ci) => (
                      <div
                        key={ci}
                        className="seat-layout-seat"
                        style={{ background: `${typeColors[type]}20`, border: `1px solid ${typeColors[type]}50` }}
                      />
                    ))}
                  </div>
                  <span className="seat-layout-row-label">{row}</span>
                </div>
              );
            })}
          </div>

          <div className="seat-layout-legend">
            {[{ type: "vip", label: "VIP" }, { type: "premium", label: "Premium" }, { type: "regular", label: "Regular" }].map(({ type, label }) => (
              <div key={type} className="seat-layout-legend-item">
                <div className="seat-layout-seat" style={{ background: `${typeColors[type]}20`, border: `1px solid ${typeColors[type]}50` }} />
                <span style={{ color: typeColors[type] }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
