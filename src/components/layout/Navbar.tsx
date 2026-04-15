import { NavLink, useLocation } from 'react-router-dom';
import { useRace } from '../../context/RaceContext';
import './Navbar.css';

export default function Navbar() {
  const { state, isLive } = useRace();
  const location = useLocation();

  const isRaceControl = location.pathname === '/race-control';
  const isSimulator = location.pathname === '/simulator';

  return (
    <nav className="navbar" id="main-navbar">
      <NavLink to="/" className="navbar__logo">
        <div className="navbar__logo-icon">GS</div>
        <span className="navbar__logo-text">GridSync</span>
      </NavLink>

      <div className="navbar__center">
        {isRaceControl && (
          <div className="navbar__session-badge">
            <span className="btn btn--primary" style={{ padding: '2px 10px', fontSize: '0.65rem' }}>
              PIT WALL
            </span>
            {isLive && <span className="badge badge--live">LIVE</span>}
          </div>
        )}

        {isRaceControl && (
          <span className="navbar__session-text">
            ROUND {state.round}: {state.raceName} | LAP {state.currentLap}/{state.totalLaps}
          </span>
        )}

        {isSimulator && (
          <>
            <span className="navbar__session-text" style={{ marginRight: '16px' }}>The Simulator</span>
            <NavLink to="/simulator?tab=telemetry" className={`navbar__link ${location.search.includes('tab=telemetry') || !location.search ? 'navbar__link--active' : ''}`}>Telemetry</NavLink>
            <NavLink to="/simulator?tab=setup" className={`navbar__link ${location.search.includes('tab=setup') ? 'navbar__link--active' : ''}`}>Setup</NavLink>
            <NavLink to="/simulator?tab=strategy" className={`navbar__link ${location.search.includes('tab=strategy') ? 'navbar__link--active' : ''}`}>Strategy</NavLink>
            <NavLink to="/simulator?tab=laps" className={`navbar__link ${location.search.includes('tab=laps') ? 'navbar__link--active' : ''}`}>Laps</NavLink>
          </>
        )}

        {!isRaceControl && !isSimulator && (
          <ul className="navbar__nav">
            <li><NavLink to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>The Paddock</NavLink></li>
            <li><NavLink to="/race-control" className={`navbar__link ${location.pathname === '/race-control' ? 'navbar__link--active' : ''}`}>Race Control</NavLink></li>
            <li><NavLink to="/simulator" className={`navbar__link ${location.pathname === '/simulator' ? 'navbar__link--active' : ''}`}>Simulator</NavLink></li>
            <li><NavLink to="/archive" className={`navbar__link ${location.pathname === '/archive' ? 'navbar__link--active' : ''}`}>Archive</NavLink></li>
            <li><NavLink to="/profile" className={`navbar__link ${location.pathname === '/profile' ? 'navbar__link--active' : ''}`}>Profile</NavLink></li>
          </ul>
        )}
      </div>

      <div className="navbar__right">
        <span className="navbar__time">
          SESSION TIME: {state.sessionTime}
        </span>
        <div className="navbar__actions">
          <NavLink to="/profile" className="navbar__icon-btn" title="Profile">👤</NavLink>
          <button className="navbar__icon-btn" title="Settings">⚙️</button>
        </div>
      </div>
    </nav>
  );
}
