import { useState } from "react";
import "./SettingsPage.css";

const Toggle = ({ checked, onChange, id, label }) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    className={`settings-toggle ${checked ? "on" : ""}`}
    onClick={() => onChange(!checked)}
  >
    <span className="settings-toggle-knob" />
  </button>
);

const SettingsRow = ({ icon, title, desc, settingKey, settings, onChange }) => (
  <div className="settings-row">
    <div className="settings-row-info">
      <span className="settings-row-icon" aria-hidden="true">{icon}</span>
      <div>
        <p className="settings-row-title">{title}</p>
        <p className="settings-row-desc">{desc}</p>
      </div>
    </div>
    <Toggle id={`toggle-${settingKey}`} checked={settings[settingKey]} onChange={v => onChange(settingKey, v)} label={title} />
  </div>
);

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    bookingConfirmation: true, promotions: false, reminders: true, newMovies: true, priceAlerts: false,
  });
  const [account, setAccount] = useState({ twoFactor: false, dataSharing: false });

  const updateNotif = (key, val) => setNotifications(p => ({ ...p, [key]: val }));
  const updateAccount = (key, val) => setAccount(p => ({ ...p, [key]: val }));

  return (
    <div className="settings-page fade-in container">
      <div className="settings-page-header">
        <h1>Account <span className="text-accent">Settings</span></h1>
        <p className="text-muted">Manage your preferences and account settings</p>
      </div>

      <div className="settings-sections">
        <div className="card">
          <h3>🔔 Notification Preferences</h3>
          <p className="settings-card-desc">Choose which notifications you receive</p>
          <SettingsRow icon="🎟️" title="Booking Confirmations" desc="Receive confirmations for every booking" settingKey="bookingConfirmation" settings={notifications} onChange={updateNotif} />
          <SettingsRow icon="🎬" title="New Movie Alerts" desc="Get notified when new movies are added" settingKey="newMovies" settings={notifications} onChange={updateNotif} />
          <SettingsRow icon="⏰" title="Show Reminders" desc="Remind me 1 hour before my shows" settingKey="reminders" settings={notifications} onChange={updateNotif} />
          <SettingsRow icon="🏷️" title="Promotions & Offers" desc="Exclusive deals and discount codes" settingKey="promotions" settings={notifications} onChange={updateNotif} />
          <SettingsRow icon="💰" title="Price Drop Alerts" desc="Alert when ticket prices drop" settingKey="priceAlerts" settings={notifications} onChange={updateNotif} />
        </div>

        <div className="card">
          <h3>🔐 Account Security</h3>
          <p className="settings-card-desc">Manage your account security settings</p>
          <SettingsRow icon="🛡️" title="Two-Factor Authentication" desc="Add an extra layer of security to your account" settingKey="twoFactor" settings={account} onChange={updateAccount} />
          <SettingsRow icon="📊" title="Data Sharing" desc="Share anonymous usage data to improve CineVerse" settingKey="dataSharing" settings={account} onChange={updateAccount} />
        </div>

        <div className="card settings-card-danger">
          <h3>⚠️ Danger Zone</h3>
          <p className="settings-card-desc">Irreversible actions for your account</p>
          <div className="settings-danger-actions">
            <button type="button" className="btn btn-outline btn-outline-danger" id="delete-account-btn">
              Delete Account
            </button>
            <button type="button" className="btn btn-secondary" id="export-data-btn">Export My Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}
