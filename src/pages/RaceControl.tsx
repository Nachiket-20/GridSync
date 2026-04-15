import { useRace } from '../context/RaceContext';
import { drivers as allDrivers } from '../data/drivers';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect, useRef } from 'react';
import './RaceControl.css';

// Helper: get team color from driver code
const getTeamColor = (code: string): string => {
  const d = allDrivers.find(dr => dr.code === code);
  return d?.teamColor || '#FFFFFF';
};

// ─── Leaderboard Component ───
function Leaderboard() {
  const { state } = useRace();

  return (
    <div className="panel leaderboard" id="leaderboard-panel">
      <div className="panel__header">
        <span className="panel__title">Live Leaderboard</span>
      </div>
      <div className="leaderboard__header">
        <span>Rank</span>
        <span>Driver</span>
        <span style={{ textAlign: 'right' }}>Last Lap</span>
        <span style={{ textAlign: 'right' }}>Gap</span>
      </div>
      <div className="leaderboard__table">
        {state.drivers.map((d, i) => (
          <div
            key={d.driverCode}
            className={`leaderboard__row ${i === 0 ? 'leaderboard__row--p1' : ''}`}
            id={`leaderboard-row-${d.driverCode}`}
          >
            <span className="leaderboard__pos">
              P{d.position}
            </span>
            <div className="leaderboard__driver">
              <span className="leaderboard__driver-name">
                <span
                  className="leaderboard__team-bar"
                  style={{ backgroundColor: getTeamColor(d.driverCode) }}
                />
                {allDrivers.find(dr => dr.code === d.driverCode)?.firstName?.charAt(0)}.{' '}
                <strong>{allDrivers.find(dr => dr.code === d.driverCode)?.lastName?.toUpperCase()}</strong>
                <span style={{ fontSize: '0.6rem', marginLeft: '2px' }}>
                  {allDrivers.find(dr => dr.code === d.driverCode)?.countryFlag}
                </span>
              </span>
              <span className="leaderboard__team-name">
                {allDrivers.find(dr => dr.code === d.driverCode)?.team}
              </span>
            </div>
            <span className="leaderboard__lap">
              <span className={`badge badge--tyre-${d.tyreCompound === 'S' ? 'soft' : d.tyreCompound === 'M' ? 'medium' : 'hard'}`}>
                {d.tyreCompound}
              </span>
            </span>
            <span className={`leaderboard__gap ${i === 0 ? 'leaderboard__gap--leader' : ''}`}>
              {i === 0 ? d.lastLap : d.gap}
            </span>
          </div>
        ))}
      </div>
      <div className="leaderboard__expand">⌄</div>
    </div>
  );
}

// ─── Track Map Component (Enhanced) ───
function TrackMap() {
  const { state } = useRace();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  // Suzuka track path (stylized)
  const trackPath = "M 120,200 C 120,180 140,140 180,120 C 220,100 260,80 300,70 C 340,60 380,55 420,60 C 460,65 490,80 510,100 C 530,120 540,150 530,180 C 520,210 490,230 470,250 C 450,270 440,290 450,320 C 460,350 490,370 520,380 C 550,390 580,395 600,400 C 620,405 640,415 650,435 C 660,455 650,475 630,490 C 610,505 580,510 550,505 C 520,500 490,490 460,475 C 430,460 400,450 370,450 C 340,450 310,455 280,465 C 250,475 220,480 190,475 C 160,470 140,450 130,425 C 120,400 115,370 115,340 C 115,310 117,270 118,250 C 119,230 120,210 120,200 Z";

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // DRS zones
  const drsZone1 = "M 180,120 C 220,100 260,80 300,70 C 340,60 380,55 420,60";
  const drsZone2 = "M 190,475 C 160,470 140,450 130,425 C 120,400 115,370 115,340";

  // Corner markers
  const corners = [
    { x: 160, y: 130, label: '1', name: 'Turn 1' },
    { x: 300, y: 58, label: '2', name: 'S-Curves' },
    { x: 420, y: 52, label: '3', name: '' },
    { x: 520, y: 100, label: '5', name: 'Dunlop' },
    { x: 540, y: 175, label: '7', name: '' },
    { x: 470, y: 260, label: '8', name: 'Degner' },
    { x: 445, y: 325, label: '10', name: '' },
    { x: 520, y: 385, label: '11', name: '130R' },
    { x: 650, y: 445, label: '13', name: 'Spoon' },
    { x: 615, y: 500, label: '15', name: '' },
    { x: 370, y: 460, label: '16', name: 'Hairpin' },
    { x: 195, y: 482, label: '17', name: '' },
  ];

  return (
    <div className="panel track-map" id="track-map-panel">
      <div className="panel__header track-map__header">
        <div>
          <span className="panel__title">Track Map</span>
          <span className="track-map__circuit-name"> Suzuka Circuit</span>
        </div>
        <div className="track-map__header-right">
          <div className="track-map__speed-badge">
            <span className="track-map__speed-label">TOP SPEED</span>
            <span className="track-map__speed-value">{state.drivers[0]?.speed || 0}<small> km/h</small></span>
          </div>
          <div className="track-map__mini-timer">
            <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>LAP TIME</span>
            <span className="track-map__mini-timer-value">{state.sessionTime}</span>
          </div>
        </div>
      </div>
      <div className="track-map__svg-container">
        <svg viewBox="0 0 760 560" className="track-map__svg">
          <defs>
            {/* Animated gradient for track */}
            <linearGradient id="track-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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

            {/* Sector gradients */}
            <linearGradient id="sector1-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E10600" />
              <stop offset="100%" stopColor="#FF6B35" />
            </linearGradient>
            <linearGradient id="sector2-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <linearGradient id="sector3-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#E10600" />
            </linearGradient>

            {/* DRS zone gradient */}
            <linearGradient id="drs-gradient">
              <stop offset="0%" stopColor="#00E676" stopOpacity="0">
                <animate attributeName="stopOpacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#00E676" stopOpacity="0.8">
                <animate attributeName="stopOpacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#00E676" stopOpacity="0">
                <animate attributeName="stopOpacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            {/* Glow filters */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="dot-glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="soft-glow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient atmosphere */}
          <circle cx="380" cy="280" r="200" fill="radial-gradient(circle, rgba(225,6,0,0.03) 0%, transparent 70%)" />
          <circle cx="380" cy="280" r="180" fill="none" stroke="rgba(225,6,0,0.02)" strokeWidth="1" strokeDasharray="4 8" />

          {/* Track surface (wide shadow) */}
          <path d={trackPath} fill="none" stroke="rgba(225, 6, 0, 0.08)" strokeWidth="42" strokeLinecap="round" strokeLinejoin="round" />

          {/* Track kerb effect (outer) */}
          <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />

          {/* Track inner asphalt */}
          <path d={trackPath} fill="none" stroke="rgba(225, 6, 0, 0.12)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />

          {/* Main track line with animated gradient */}
          <path
            ref={pathRef}
            d={trackPath}
            fill="none"
            stroke="url(#track-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Track center dashes (racing line) */}
          <path
            d={trackPath}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeDasharray="8 16"
            strokeLinecap="round"
          />

          {/* DRS Zones */}
          <path d={drsZone1} fill="none" stroke="url(#drs-gradient)" strokeWidth="6" strokeLinecap="round" />
          <path d={drsZone2} fill="none" stroke="url(#drs-gradient)" strokeWidth="6" strokeLinecap="round" />

          {/* DRS Labels */}
          <g>
            <rect x="280" y="42" width="40" height="14" rx="3" fill="rgba(0,230,118,0.2)" stroke="rgba(0,230,118,0.4)" strokeWidth="0.5" />
            <text x="300" y="53" fill="#00E676" fontSize="8" fontFamily="Orbitron" fontWeight="700" textAnchor="middle">DRS</text>
          </g>
          <g>
            <rect x="100" y="370" width="40" height="14" rx="3" fill="rgba(0,230,118,0.2)" stroke="rgba(0,230,118,0.4)" strokeWidth="0.5" />
            <text x="120" y="381" fill="#00E676" fontSize="8" fontFamily="Orbitron" fontWeight="700" textAnchor="middle">DRS</text>
          </g>

          {/* Start/Finish line */}
          <line x1="113" y1="260" x2="127" y2="260" stroke="white" strokeWidth="3" />
          <line x1="113" y1="260" x2="113" y2="252" stroke="white" strokeWidth="1" />
          <line x1="127" y1="260" x2="127" y2="252" stroke="white" strokeWidth="1" />
          <rect x="107" y="244" width="26" height="10" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <text x="120" y="252" fill="white" fontSize="6" textAnchor="middle" fontFamily="Orbitron" fontWeight="600">S/F</text>

          {/* Sector markers */}
          <g>
            <text x="230" y="88" fill="#FF6B35" fontSize="9" fontFamily="Orbitron" fontWeight="600">SECTOR 1</text>
            <line x1="230" y1="92" x2="290" y2="92" stroke="#FF6B35" strokeWidth="1" opacity="0.5" />
          </g>
          <g>
            <text x="538" y="145" fill="#FFD700" fontSize="9" fontFamily="Orbitron" fontWeight="600">SECTOR 2</text>
            <line x1="538" y1="149" x2="598" y2="149" stroke="#FFD700" strokeWidth="1" opacity="0.5" />
          </g>
          <g>
            <text x="560" y="510" fill="#E10600" fontSize="9" fontFamily="Orbitron" fontWeight="600">SECTOR 3</text>
            <line x1="560" y1="514" x2="620" y2="514" stroke="#E10600" strokeWidth="1" opacity="0.5" />
          </g>

          {/* Corner markers */}
          {corners.map(c => (
            <g key={c.label}>
              <circle cx={c.x} cy={c.y} r="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              <text x={c.x} y={c.y + 3} fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="Orbitron" fontWeight="600" textAnchor="middle">
                {c.label}
              </text>
              {c.name && (
                <text x={c.x + 14} y={c.y + 3} fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="Inter" fontWeight="500">
                  {c.name}
                </text>
              )}
            </g>
          ))}

          {/* Driver positions */}
          {state.drivers.slice(0, 8).map((d, i) => {
            const teamColor = getTeamColor(d.driverCode);
            let x = 385, y = 290, tx = 385, ty = 290;

            if (pathRef.current && pathLength > 0) {
              // Get point exactly on the path. Modulo to ensure bounds.
              const progress = (d.trackProgress + 0.12) % 1; // offset so cars start near start/finish instead of arbitrary edge
              const point = pathRef.current.getPointAtLength(progress * pathLength);
              x = point.x;
              y = point.y;

              const trailProgress = (progress - 0.015 + 1) % 1;
              const tPoint = pathRef.current.getPointAtLength(trailProgress * pathLength);
              tx = tPoint.x;
              ty = tPoint.y;
            }

            return (
              <g key={d.driverCode}>
                {/* Trail line */}
                <line x1={tx} y1={ty} x2={x} y2={y} stroke={teamColor} strokeWidth="2" opacity="0.3" strokeLinecap="round" />
                {/* Outer pulse */}
                <circle cx={x} cy={y} r="10" fill={teamColor} opacity="0.15" filter="url(#dot-glow)">
                  {i === 0 && <animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" />}
                </circle>
                {/* Main dot */}
                <circle cx={x} cy={y} r="6" fill={teamColor} stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                {/* Inner highlight */}
                <circle cx={x - 1.5} cy={y - 1.5} r="2" fill="rgba(255,255,255,0.4)" />
                {/* Label bg */}
                <rect
                  x={x + (i % 2 === 0 ? 10 : -52)}
                  y={y - 18}
                  width="42"
                  height="13"
                  rx="3"
                  fill="rgba(0,0,0,0.7)"
                  stroke={teamColor}
                  strokeWidth="0.5"
                  opacity="0.9"
                />
                {/* Label */}
                <text
                  x={x + (i % 2 === 0 ? 31 : -31)}
                  y={y - 9}
                  fill="white"
                  fontSize="8"
                  fontFamily="Orbitron"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {d.driverCode}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── Strategy Matrix Component ───
function StrategyMatrix() {
  const { state } = useRace();

  const TyreBadge = ({ compound }: { compound: 'S' | 'M' | 'H' }) => (
    <span className={`badge badge--tyre-${compound === 'S' ? 'soft' : compound === 'M' ? 'medium' : 'hard'}`}>
      {compound}
    </span>
  );

  return (
    <div className="panel strategy-matrix" id="strategy-matrix-panel">
      <div className="panel__header">
        <span className="panel__title">Strategy Matrix</span>
        <span className="panel__subtitle">Tyre: current · Lap {state.currentLap}</span>
      </div>

      <div className="strategy-matrix__header-row">
        <span></span>
        <span>Stint 1</span>
        <span>Stint 2</span>
        <span>Stint 3</span>
      </div>

      <div className="strategy-matrix__grid">
        {state.drivers.map(d => (
          <div key={d.driverCode} className="strategy-matrix__row">
            <span className="strategy-matrix__pos">P{d.position}</span>
            {d.stints.map((stint, si) => (
              <div key={si} className="strategy-matrix__stint">
                <TyreBadge compound={stint.compound} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="strategy-matrix__legend">
        <span className="strategy-matrix__legend-item">
          <span className="badge badge--tyre-soft" style={{ width: 14, height: 14, fontSize: '0.5rem' }}>S</span>
          SOFT
        </span>
        <span className="strategy-matrix__legend-item">
          <span className="badge badge--tyre-medium" style={{ width: 14, height: 14, fontSize: '0.5rem' }}>M</span>
          MEDIUM
        </span>
        <span className="strategy-matrix__legend-item">
          <span className="badge badge--tyre-hard" style={{ width: 14, height: 14, fontSize: '0.5rem' }}>H</span>
          HARD
        </span>
      </div>
    </div>
  );
}

// ─── Live Telemetry Component ───
function LiveTelemetry() {
  const { state } = useRace();
  const [chartData, setChartData] = useState<Array<{ time: number; speed1: number; speed2: number; rpm1: number; rpm2: number }>>([]);
  const counterRef = useRef(0);
  const lastTickRef = useRef('');

  useEffect(() => {
    const d1 = state.drivers[0];
    const d2 = state.drivers[1];
    if (!d1 || !d2) return;

    // Throttle: only update when sessionTime string changes (once per second)
    const tickKey = state.sessionTime;
    if (tickKey === lastTickRef.current) return;
    lastTickRef.current = tickKey;

    counterRef.current += 1;
    setChartData(prev => [
      ...prev.slice(-35),
      {
        time: counterRef.current,
        speed1: d1.speed,
        speed2: d2.speed,
        rpm1: d1.rpm / 50,
        rpm2: d2.rpm / 50,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sessionTime]);

  const d1Color = getTeamColor(state.drivers[0]?.driverCode || 'VER');
  const d2Color = getTeamColor(state.drivers[1]?.driverCode || 'PER');

  return (
    <div className="panel live-telemetry" id="telemetry-panel">
      <div className="panel__header">
        <span className="panel__title">Live Telemetry</span>
        <div className="live-telemetry__legend">
          <span className="live-telemetry__legend-item">
            <span className="live-telemetry__legend-dot" style={{ background: d1Color }} />
            {state.drivers[0]?.driverCode}
          </span>
          <span className="live-telemetry__legend-item">
            <span className="live-telemetry__legend-dot" style={{ background: d2Color }} />
            {state.drivers[1]?.driverCode}
          </span>
        </div>
      </div>
      <div className="live-telemetry__chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <XAxis dataKey="time" hide />
            <YAxis domain={[100, 350]} tick={{ fontSize: 9, fill: '#5A6178' }} width={30} />
            <YAxis yAxisId="right" orientation="right" domain={[100, 350]} tick={{ fontSize: 9, fill: '#5A6178' }} width={30} />
            <Tooltip
              contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
              labelStyle={{ display: 'none' }}
            />
            <Line type="monotone" dataKey="speed1" stroke={d1Color} dot={false} strokeWidth={2} name="Speed" isAnimationActive={false} />
            <Line type="monotone" dataKey="speed2" stroke={d2Color} dot={false} strokeWidth={2} name="Speed" isAnimationActive={false} />
            <Line type="monotone" dataKey="rpm1" stroke={d1Color} dot={false} strokeWidth={1} strokeDasharray="4 4" yAxisId="right" name="RPM" isAnimationActive={false} />
            <Line type="monotone" dataKey="rpm2" stroke={d2Color} dot={false} strokeWidth={1} strokeDasharray="4 4" yAxisId="right" name="RPM" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Sector Times Component ───
function SectorTimes() {
  const { state } = useRace();

  return (
    <div className="panel sector-times" id="sector-times-panel">
      <div className="panel__header">
        <span className="panel__title">Sector Times</span>
      </div>
      <div className="sector-times__table">
        {state.drivers.slice(0, 3).map(d => (
          <div key={d.driverCode} className="sector-times__row">
            <span
              className="sector-times__driver-code"
              style={{ borderColor: getTeamColor(d.driverCode), color: getTeamColor(d.driverCode) }}
            >
              {d.driverCode}
            </span>
            <span className="sector-times__time">{d.sectorTimes.s1}</span>
            <span className="sector-times__time">{d.sectorTimes.s2}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Race Control Page ───
export default function RaceControl() {
  return (
    <div className="race-control bg-grid" id="race-control-page">
      {/* Left: Leaderboard */}
      <div className="race-control__left">
        <Leaderboard />
      </div>

      {/* Center: Track Map (hero) + Live Telemetry */}
      <div className="race-control__center">
        <div className="race-control__track-area">
          <TrackMap />
        </div>
        <div className="race-control__telemetry-area">
          <LiveTelemetry />
        </div>
      </div>

      {/* Right: Strategy Matrix + Sector Times */}
      <div className="race-control__right">
        <StrategyMatrix />
        <SectorTimes />
      </div>
    </div>
  );
}

