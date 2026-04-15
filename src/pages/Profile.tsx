import { useState } from 'react';
import { drivers } from '../data/drivers';
import './Profile.css';

export default function Profile() {
  const [favoriteDriver, setFavoriteDriver] = useState('VER');
  const [notifications, setNotifications] = useState({
    raceStart: true,
    pitStops: true,
    incidents: false,
    results: true,
  });

  const favoriteDriverData = drivers.find(d => d.code === favoriteDriver);

  return (
    <div className="profile bg-grid" id="profile-page">
      <div className="profile__content">
        <div className="profile__header">
          <h1 className="profile__title">Super License</h1>
          <p className="profile__subtitle">Your GridSync Profile</p>
        </div>

        <div className="profile__grid">
          {/* User Card */}
          <div className="panel profile__user-card">
            <div className="profile__avatar">
              <span className="profile__avatar-icon">🏎️</span>
            </div>
            <h2 className="profile__user-name">Race Fan</h2>
            <p className="profile__user-email">fan@gridsync.app</p>
            <div className="profile__user-stats">
              <div className="profile__user-stat">
                <span className="profile__user-stat-value">42</span>
                <span className="profile__user-stat-label">Races Watched</span>
              </div>
              <div className="profile__user-stat">
                <span className="profile__user-stat-value">128</span>
                <span className="profile__user-stat-label">Predictions</span>
              </div>
              <div className="profile__user-stat">
                <span className="profile__user-stat-value">76%</span>
                <span className="profile__user-stat-label">Accuracy</span>
              </div>
            </div>
          </div>

          {/* Favorite Driver */}
          <div className="panel profile__favorite">
            <div className="panel__header">
              <span className="panel__title">Favorite Driver</span>
            </div>
            <div className="profile__favorite-current" style={{ borderColor: favoriteDriverData?.teamColor }}>
              <span className="profile__favorite-number" style={{ color: favoriteDriverData?.teamColor }}>
                #{favoriteDriverData?.number}
              </span>
              <div>
                <span className="profile__favorite-name">{favoriteDriverData?.firstName} {favoriteDriverData?.lastName}</span>
                <span className="profile__favorite-team">{favoriteDriverData?.team}</span>
              </div>
              <span className="profile__favorite-flag">{favoriteDriverData?.countryFlag}</span>
            </div>
            <select
              className="profile__driver-select"
              value={favoriteDriver}
              onChange={e => setFavoriteDriver(e.target.value)}
            >
              {drivers.map(d => (
                <option key={d.code} value={d.code}>
                  {d.firstName} {d.lastName} — {d.team}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications */}
          <div className="panel profile__notifications">
            <div className="panel__header">
              <span className="panel__title">Notifications</span>
            </div>
            {Object.entries(notifications).map(([key, val]) => (
              <label key={key} className="profile__notif-toggle">
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                <input
                  type="checkbox"
                  checked={val}
                  onChange={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className="profile__toggle-input"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
