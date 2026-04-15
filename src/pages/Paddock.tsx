import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRace } from '../context/RaceContext';
import { drivers } from '../data/drivers';
import './Paddock.css';

// Countdown hook
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) return;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export default function Paddock() {
  const navigate = useNavigate();
  const { state } = useRace();
  const [targetDate] = useState(() => new Date(Date.now() + 6 * 86400000 + 14 * 3600000 + 32 * 60000));
  const countdown = useCountdown(targetDate);
  const pad = (n: number) => String(n).padStart(2, '0');

  const gridDrivers = drivers.slice(0, 8);

  return (
    <div className="paddock bg-grid" id="paddock-page">
      {/* Background effects */}
      <div className="paddock__bg-effects">
        <div className="paddock__bg-glow" />
        <div className="paddock__bg-lines" />
      </div>

      <div className="paddock__content">
        {/* Hero */}
        <div className="paddock__hero">
          <h1 className="paddock__title">The Paddock</h1>
          <p className="paddock__subtitle">Your Ultimate F1 Hub</p>
          <p className="paddock__event-name">Formula 1 Japanese Grand Prix 2024</p>
        </div>

        {/* Countdown */}
        <div className="paddock__countdown-section">
          <h2 className="paddock__next-race">NEXT RACE: SUZUKA, JAPAN</h2>
          <div className="paddock__countdown">
            <div className="paddock__countdown-item">
              <span className="paddock__countdown-value">{pad(countdown.days)}</span>
              <span className="paddock__countdown-label">Days</span>
            </div>
            <span className="paddock__countdown-sep">:</span>
            <div className="paddock__countdown-item">
              <span className="paddock__countdown-value">{pad(countdown.hours)}</span>
              <span className="paddock__countdown-label">Hrs</span>
            </div>
            <span className="paddock__countdown-sep">:</span>
            <div className="paddock__countdown-item">
              <span className="paddock__countdown-value">{pad(countdown.minutes)}</span>
              <span className="paddock__countdown-label">Min</span>
            </div>
            <span className="paddock__countdown-sep">:</span>
            <div className="paddock__countdown-item">
              <span className="paddock__countdown-value">{pad(countdown.seconds)}</span>
              <span className="paddock__countdown-label">Sec</span>
            </div>
          </div>
          <p className="paddock__track-info">
            Track: Suzuka Circuit, Japan <span>|</span> Laps: 53 <span>|</span> Distance: 5.807km <span>|</span> Records: L. Hamilton (2019) 1:30.983
          </p>
        </div>

        {/* Three-column grid: Weather | Track Preview | Starting Grid */}
        <div className="paddock__grid">
          {/* Weather Widget */}
          <div className="panel weather-widget" id="weather-widget">
            <div className="panel__header">
              <span className="panel__title">Live Track Weather</span>
              <span style={{ color: 'var(--text-tertiary)', cursor: 'pointer' }}>•••</span>
            </div>
            <div className="weather-widget__temp">
              <span className="weather-widget__temp-icon">☁️</span>
              <span className="weather-widget__temp-value">{state.weather.temp}</span>
              <span className="weather-widget__temp-unit">°C</span>
            </div>
            <div className="weather-widget__details">
              <div className="weather-widget__detail">
                <span className="weather-widget__detail-label">Track Temp</span>
                <span className="weather-widget__detail-value">{state.weather.trackTemp}°C</span>
              </div>
              <div className="weather-widget__detail">
                <span className="weather-widget__detail-label">Wind</span>
                <span className="weather-widget__detail-value">{state.weather.wind}</span>
              </div>
              <div className="weather-widget__detail">
                <span className="weather-widget__detail-label">Humidity</span>
                <span className="weather-widget__detail-value">{state.weather.humidity}%</span>
              </div>
              <div className="weather-widget__detail">
                <span className="weather-widget__detail-label">Rain Chance</span>
                <span className="weather-widget__detail-value">{state.weather.rainChance}%</span>
              </div>
            </div>
            <div className="weather-widget__condition">
              <span className="weather-widget__condition-label">Condition</span>
              <p className="weather-widget__condition-value">{state.weather.condition}, chance of rain {state.weather.rainChance}%</p>
            </div>
            <div className="weather-widget__chart" />
          </div>

          {/* Track Preview */}
          <div className="panel track-preview" id="track-preview">
            <div className="track-preview__image">
              <svg viewBox="0 0 760 560" className="track-preview__svg">
                <defs>
                  <filter id="track-glow-preview">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="paddock-track-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E10600">
                      <animate attributeName="stopColor" values="#E10600;#FF4136;#E10600" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#FF6B35">
                      <animate attributeName="stopColor" values="#FF6B35;#E10600;#FF6B35" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#E10600">
                      <animate attributeName="stopColor" values="#E10600;#C70039;#E10600" dur="4s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>
                  <linearGradient id="paddock-drs-grad">
                    <stop offset="0%" stopColor="#00E676" stopOpacity="0">
                      <animate attributeName="stopOpacity" values="0;0.7;0" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#00E676" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#00E676" stopOpacity="0">
                      <animate attributeName="stopOpacity" values="0;0.7;0" dur="2s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>
                </defs>

                {/* Track surface */}
                <path
                  d="M 120,200 C 120,180 140,140 180,120 C 220,100 260,80 300,70 C 340,60 380,55 420,60 C 460,65 490,80 510,100 C 530,120 540,150 530,180 C 520,210 490,230 470,250 C 450,270 440,290 450,320 C 460,350 490,370 520,380 C 550,390 580,395 600,400 C 620,405 640,415 650,435 C 660,455 650,475 630,490 C 610,505 580,510 550,505 C 520,500 490,490 460,475 C 430,460 400,450 370,450 C 340,450 310,455 280,465 C 250,475 220,480 190,475 C 160,470 140,450 130,425 C 120,400 115,370 115,340 C 115,310 117,270 118,250 C 119,230 120,210 120,200 Z"
                  fill="none" stroke="rgba(225, 6, 0, 0.1)" strokeWidth="32" strokeLinejoin="round"
                />
                {/* Main track line with animated gradient */}
                <path
                  d="M 120,200 C 120,180 140,140 180,120 C 220,100 260,80 300,70 C 340,60 380,55 420,60 C 460,65 490,80 510,100 C 530,120 540,150 530,180 C 520,210 490,230 470,250 C 450,270 440,290 450,320 C 460,350 490,370 520,380 C 550,390 580,395 600,400 C 620,405 640,415 650,435 C 660,455 650,475 630,490 C 610,505 580,510 550,505 C 520,500 490,490 460,475 C 430,460 400,450 370,450 C 340,450 310,455 280,465 C 250,475 220,480 190,475 C 160,470 140,450 130,425 C 120,400 115,370 115,340 C 115,310 117,270 118,250 C 119,230 120,210 120,200 Z"
                  fill="none" stroke="url(#paddock-track-grad)" strokeWidth="3" filter="url(#track-glow-preview)" strokeLinejoin="round"
                />
                {/* Racing line dashes */}
                <path
                  d="M 120,200 C 120,180 140,140 180,120 C 220,100 260,80 300,70 C 340,60 380,55 420,60 C 460,65 490,80 510,100 C 530,120 540,150 530,180 C 520,210 490,230 470,250 C 450,270 440,290 450,320 C 460,350 490,370 520,380 C 550,390 580,395 600,400 C 620,405 640,415 650,435 C 660,455 650,475 630,490 C 610,505 580,510 550,505 C 520,500 490,490 460,475 C 430,460 400,450 370,450 C 340,450 310,455 280,465 C 250,475 220,480 190,475 C 160,470 140,450 130,425 C 120,400 115,370 115,340 C 115,310 117,270 118,250 C 119,230 120,210 120,200 Z"
                  fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="8 16"
                />
                {/* DRS zones */}
                <path d="M 180,120 C 220,100 260,80 300,70 C 340,60 380,55 420,60" fill="none" stroke="url(#paddock-drs-grad)" strokeWidth="5" strokeLinecap="round" />
                {/* Start/Finish line */}
                <line x1="113" y1="260" x2="127" y2="260" stroke="white" strokeWidth="3" />
                <rect x="107" y="244" width="26" height="10" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <text x="120" y="252" fill="white" fontSize="6" textAnchor="middle" fontFamily="Orbitron" fontWeight="600">S/F</text>
                {/* Corner labels */}
                <text x="300" y="55" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="Orbitron">S-Curves</text>
                <text x="525" y="380" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="Orbitron">130R</text>
                <text x="650" y="450" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="Orbitron">Spoon</text>

                {/* Animated car dot */}
                <circle r="5" fill="#00E5FF" filter="url(#track-glow-preview)">
                  <animateMotion dur="8s" repeatCount="indefinite">
                    <mpath href="#paddock-circuit-path" />
                  </animateMotion>
                </circle>
                <circle r="3" fill="#E10600" opacity="0.6">
                  <animateMotion dur="8s" repeatCount="indefinite" begin="0.5s">
                    <mpath href="#paddock-circuit-path" />
                  </animateMotion>
                </circle>
                <path id="paddock-circuit-path" d="M 120,200 C 120,180 140,140 180,120 C 220,100 260,80 300,70 C 340,60 380,55 420,60 C 460,65 490,80 510,100 C 530,120 540,150 530,180 C 520,210 490,230 470,250 C 450,270 440,290 450,320 C 460,350 490,370 520,380 C 550,390 580,395 600,400 C 620,405 640,415 650,435 C 660,455 650,475 630,490 C 610,505 580,510 550,505 C 520,500 490,490 460,475 C 430,460 400,450 370,450 C 340,450 310,455 280,465 C 250,475 220,480 190,475 C 160,470 140,450 130,425 C 120,400 115,370 115,340 C 115,310 117,270 118,250 C 119,230 120,210 120,200 Z" fill="none" stroke="none" />
              </svg>
              <span className="track-preview__label">Suzuka Circuit · 5.807km</span>
            </div>
          </div>

          {/* Starting Grid */}
          <div className="panel starting-grid" id="starting-grid">
            <div className="panel__header">
              <span className="panel__title">Starting Grid Preview</span>
              <span style={{ color: 'var(--text-tertiary)', cursor: 'pointer' }}>•••</span>
            </div>
            <div className="starting-grid__positions">
              {gridDrivers.map((d, i) => (
                <div
                  key={d.code}
                  className="starting-grid__card"
                  style={{ borderLeftColor: d.teamColor }}
                  id={`grid-card-${d.code}`}
                >
                  <span className="starting-grid__card-pos" style={{ color: d.teamColor }}>P{i + 1}</span>
                  <div className="starting-grid__card-info">
                    <span className="starting-grid__card-pos-small">P{i + 1}</span>
                    <span className="starting-grid__card-name">
                      {d.firstName} <strong>{d.lastName.toUpperCase()}</strong>
                    </span>
                  </div>
                  <span className="starting-grid__card-flag">{d.countryFlag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="paddock__actions">
          <button className="btn" onClick={() => navigate('/race-control')}>Full Weekend Schedule</button>
          <button className="btn btn--primary" onClick={() => navigate('/race-control')}>Latest Driver Stats</button>
          <button className="btn" onClick={() => navigate('/simulator')}>Circuit Information</button>
        </div>
      </div>
    </div>
  );
}
