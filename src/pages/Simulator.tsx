import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import CircuitLoader from '../components/ui/CircuitLoader';
import './Simulator.css';

// Corner analysis data
const cornerData = [
  { corner: 'T1', maxV: 330.0, lanV: 204.2, delta: +0.12 },
  { corner: 'T2', maxV: 223.6, lanV: 203.6, delta: +0.12 },
  { corner: 'T3', maxV: 188.7, lanV: 182.5, delta: +0.12 },
  { corner: 'T4', maxV: 185.6, lanV: 182.0, delta: +0.14 },
  { corner: 'T5', maxV: 133.0, lanV: 182.0, delta: -0.14 },
  { corner: 'T6', maxV: 130.0, lanV: 183.9, delta: -0.10 },
  { corner: 'T7', maxV: 132.5, lanV: 188.5, delta: +0.15 },
  { corner: 'T8', maxV: 132.5, lanV: 188.5, delta: +0.15 },
  { corner: 'T10', maxV: 133.5, lanV: 188.5, delta: -0.14 },
  { corner: 'T13', maxV: 130.9, lanV: 196.2, delta: -0.29 },
  { corner: 'T14', maxV: 133.7, lanV: 192.3, delta: -0.20 },
  { corner: 'T15', maxV: 120.6, lanV: 193.4, delta: +0.20 },
  { corner: 'T16', maxV: 121.3, lanV: 130.1, delta: -0.22 },
  { corner: 'T17', maxV: 126.6, lanV: 183.6, delta: -0.20 },
  { corner: 'T18', maxV: 123.0, lanV: 182.1, delta: +0.15 },
];

// Generate telemetry timeline data
const generateTimelineData = () => {
  const data = [];
  for (let i = 0; i <= 18; i++) {
    const t = i / 18;
    data.push({
      turn: `T${i}`,
      speed1: 180 + Math.sin(t * Math.PI * 6) * 80 + Math.random() * 20,
      speed2: 175 + Math.sin(t * Math.PI * 6 + 0.2) * 85 + Math.random() * 20,
      throttle1: Math.max(0, Math.sin(t * Math.PI * 6) * 50 + 50 + Math.random() * 10),
      throttle2: Math.max(0, Math.sin(t * Math.PI * 6 + 0.15) * 50 + 48 + Math.random() * 10),
      brake1: Math.max(0, -Math.sin(t * Math.PI * 6) * 60 + Math.random() * 15),
      brake2: Math.max(0, -Math.sin(t * Math.PI * 6 + 0.1) * 65 + Math.random() * 15),
      delta: Math.sin(t * Math.PI * 4) * 0.15 + (Math.random() - 0.5) * 0.05,
    });
  }
  return data;
};

export default function Simulator() {
  const location = useLocation();
  const [activeOverlays, setActiveOverlays] = useState({ speed: true, throttle: true, brake: true, delta: true });
  const [playing, setPlaying] = useState(true);
  const [scrubberPos, setScrubberPos] = useState(38);
  const [timelineData] = useState(generateTimelineData);
  const [setupStrategy, setSetupStrategy] = useState('quali'); // new state
  const [activeDriverLap, setActiveDriverLap] = useState<'driver1' | 'driver2' | 'both'>('both');
  const [isBuffering, setIsBuffering] = useState(false);

  const driver1 = { name: 'Max Verstappen', code: 'VER', number: 33, car: 'RB20', color: '#3671C6', lap: 42, time: '1:31.455' };
  const driver2 = { name: 'Lando Norris', code: 'NOR', number: 4, car: 'MCL38', color: '#FF8000', lap: 39, time: '1:31.311' };

  // Animate scrubber
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setScrubberPos(prev => (prev + 0.5) % 100);
    }, 100);
    return () => clearInterval(id);
  }, [playing]);

  // Buffer on tab switch
  useEffect(() => {
    setIsBuffering(true);
    const timer = setTimeout(() => {
      setIsBuffering(false);
      setTimeout(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        let elementId = 'simulator-page';
        if (tab === 'setup' || tab === 'strategy') elementId = 'setup-strategy-panel';
        else if (tab === 'laps') elementId = 'ghost-lap-panel';
        else if (tab === 'telemetry') elementId = 'telemetry-timeline-panel';
        
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }, 1200);
    return () => clearTimeout(timer);
  }, [location.search]);

  const toggleOverlay = (key: keyof typeof activeOverlays) => {
    setActiveOverlays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleLap = (target: 'driver1' | 'driver2') => {
    setActiveDriverLap(prev => {
      if (prev === 'both') return target === 'driver1' ? 'driver2' : 'driver1';
      if (prev === target) return 'both'; // can't unselect last, default back to both? Or just toggle back to both.
      return 'both'; 
    });
  };

  if (isBuffering) {
    return (
      <div className="simulator bg-grid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)' }}>
        <CircuitLoader size={160} label="LOADING TELEMETRY..." />
      </div>
    );
  }

  return (
    <div className="simulator bg-grid" id="simulator-page">
      {/* Left Sidebar */}
      <div className="simulator__sidebar panel" id="setup-strategy-panel">
        <div className="sim-sidebar-section">
          <div className="sim-sidebar-section__title">Active Drivers</div>
          <div className="sim-driver-pill" style={{ background: `${driver1.color}33`, color: driver1.color }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: driver1.color }} />
            {driver1.name}
          </div>
          <div className="sim-driver-pill" style={{ background: `${driver2.color}33`, color: driver2.color }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: driver2.color }} />
            {driver2.name}
          </div>
        </div>

        <div className="sim-sidebar-section">
          <div className="sim-sidebar-section__title">Setup Strategy</div>
          <select 
            className="sim-strategy-select" 
            value={setupStrategy} 
            onChange={(e) => setSetupStrategy(e.target.value)}
          >
            <option value="quali">Qualifying (Aggressive)</option>
            <option value="race">Race Pace (Medium)</option>
            <option value="wet">Wet Setup (High Downforce)</option>
          </select>
        </div>

        <div className="sim-sidebar-section">
          <div className="sim-sidebar-section__title">Laps</div>
          <div 
            className={`sim-lap-pill ${activeDriverLap === 'driver1' || activeDriverLap === 'both' ? 'sim-lap-pill--active' : ''}`}
            onClick={() => toggleLap('driver1')}
          >
            <span className="sim-lap-pill__dot" style={{ background: driver1.color }} />
            Lap {driver1.lap} ({driver1.code})
          </div>
          <div 
            className={`sim-lap-pill ${activeDriverLap === 'driver2' || activeDriverLap === 'both' ? 'sim-lap-pill--active' : ''}`}
            onClick={() => toggleLap('driver2')}
          >
            <span className="sim-lap-pill__dot" style={{ background: driver2.color }} />
            Lap {driver2.lap} ({driver2.code})
          </div>
        </div>

        <div className="sim-sidebar-section">
          <div className="sim-sidebar-section__title">Data Overlays</div>
          {Object.entries(activeOverlays).map(([key, val]) => (
            <label key={key} className="sim-overlay-toggle">
              <input
                type="checkbox"
                checked={val}
                onChange={() => toggleOverlay(key as keyof typeof activeOverlays)}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Ghost Lap Visualizer */}
      <div className="panel simulator__ghost-lap" id="ghost-lap-panel">
        <div className="ghost-lap__header-row">
          <div>
            <span className="panel__title">Ghost Lap Visualizer</span>
            <div className="ghost-lap__driver-info">
              <span style={{ color: driver1.color }}>Blue:</span> {driver1.name} #{driver1.number} {driver1.car} | {' '}
              <span style={{ color: driver2.color }}>Red:</span> {driver2.name} #{driver2.number} {driver2.car}
            </div>
          </div>
          <span className="ghost-lap__circuit-badge">Suzuka Circuit</span>
        </div>

        {/* Delta overlay */}
        <div className="ghost-lap__delta">
          <div className="ghost-lap__delta-value">+0.14s</div>
          <div className="ghost-lap__delta-label">Lando Ahead</div>
        </div>

        <div className="ghost-lap__svg-area">
          <svg viewBox="0 0 760 480" style={{ width: '100%', height: '100%' }}>
            <defs>
              <filter id="ghost-glow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Track with delta coloring */}
            <path
              d="M 140,200 C 140,175 160,135 200,115 C 240,95 280,75 320,65 C 360,55 400,50 440,55 C 480,60 510,75 530,95 C 550,115 560,145 550,175 C 540,205 510,225 490,245 C 470,265 460,285 470,315 C 480,345 510,365 540,375 C 570,385 600,390 620,395 C 640,400 660,410 670,430 C 680,450 670,470 650,485 C 630,500 600,505 570,500 C 540,495 510,485 480,470 C 450,455 420,445 390,445 C 360,445 330,450 300,460 C 270,470 240,475 210,470 C 180,465 160,445 150,420 C 140,395 135,365 135,335 C 135,305 137,265 138,245 C 139,225 140,210 140,200 Z"
              fill="none"
              stroke="rgba(0, 255, 135, 0.5)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#ghost-glow)"
            />
            {/* Segments where driver 2 is faster (red) */}
            <path
              d="M 530,95 C 550,115 560,145 550,175 C 540,205 510,225 490,245"
              fill="none"
              stroke="rgba(225, 6, 0, 0.6)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#ghost-glow)"
            />
            {/* Main track outline */}
            <path
              d="M 140,200 C 140,175 160,135 200,115 C 240,95 280,75 320,65 C 360,55 400,50 440,55 C 480,60 510,75 530,95 C 550,115 560,145 550,175 C 540,205 510,225 490,245 C 470,265 460,285 470,315 C 480,345 510,365 540,375 C 570,385 600,390 620,395 C 640,400 660,410 670,430 C 680,450 670,470 650,485 C 630,500 600,505 570,500 C 540,495 510,485 480,470 C 450,455 420,445 390,445 C 360,445 330,450 300,460 C 270,470 240,475 210,470 C 180,465 160,445 150,420 C 140,395 135,365 135,335 C 135,305 137,265 138,245 C 139,225 140,210 140,200 Z"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
            />

            {/* Turn labels */}
            {['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12','T13','T14','T15','T16','T17','T18','T19'].map((t, i) => {
              const positions = [
                [200,100],[270,70],[320,55],[380,48],[430,52],[480,58],[530,88],[555,130],
                [555,170],[530,210],[500,245],[475,280],[480,330],[530,370],[590,390],
                [650,420],[670,465],[620,500],[250,460]
              ];
              const [x, y] = positions[i] || [0, 0];
              return (
                <text key={t} x={x} y={y} fill="var(--text-tertiary)" fontSize="9" fontFamily="Inter" fontWeight="600">
                  {t}
                </text>
              );
            })}

            {/* Driver 1 position */}
            <circle cx={420} cy={50} r="6" fill={driver1.color} stroke="white" strokeWidth="1.5" />
            <text x={430} y={42} fill="white" fontSize="10" fontFamily="Orbitron" fontWeight="700">MAX</text>

            {/* Driver 2 position */}
            <circle cx={560} cy={160} r="6" fill={driver2.color} stroke="white" strokeWidth="1.5" />
            <text x={570} y={152} fill="white" fontSize="10" fontFamily="Orbitron" fontWeight="700">Lando</text>

            {/* Sector line */}
            <text x={220} y={140} fill="var(--text-tertiary)" fontSize="10" fontFamily="Inter">Sector</text>
          </svg>
        </div>

        <div className="ghost-lap__legend">
          <div className="ghost-lap__legend-section">
            <strong>Active Cars</strong>
            <div className="ghost-lap__legend-item">
              <span className="ghost-lap__legend-line" style={{ background: driver1.color }} />
              Blue: {driver1.name} #{driver1.number} {driver1.car}
            </div>
            <div className="ghost-lap__legend-item">
              <span className="ghost-lap__legend-line" style={{ background: driver2.color }} />
              Red: {driver2.name} #{driver2.number} {driver2.car}
            </div>
          </div>
          <div className="ghost-lap__legend-section">
            <strong>Delta Coloring</strong>
            <div className="ghost-lap__legend-item">
              <span className="ghost-lap__legend-line" style={{ background: '#00FF87' }} />
              Green: Max faster
            </div>
            <div className="ghost-lap__legend-item">
              <span className="ghost-lap__legend-line" style={{ background: '#E10600' }} />
              Red: Lando faster
            </div>
          </div>
        </div>
      </div>

      {/* Corner Analysis Table */}
      <div className="panel simulator__corner-analysis" id="corner-analysis-panel">
        <div className="panel__header">
          <span className="panel__title">Corner-by-Corner Analysis</span>
        </div>
        <div className="corner-table">
          <div className="corner-table__header">
            <span>Corner</span>
            <span style={{ textAlign: 'right' }}>Max Vmax</span>
            <span style={{ textAlign: 'right' }}>Lan Vmax</span>
            <span style={{ textAlign: 'right' }}>Delta</span>
          </div>
          {cornerData.map(row => (
            <div key={row.corner} className="corner-table__row">
              <span className="corner-table__corner">{row.corner}</span>
              <span className="corner-table__speed" style={{ textAlign: 'right' }}>{row.maxV.toFixed(1)}</span>
              <span className="corner-table__speed" style={{ textAlign: 'right' }}>{row.lanV.toFixed(1)}</span>
              <span className={`corner-table__delta ${row.delta >= 0 ? 'corner-table__delta--positive' : 'corner-table__delta--negative'}`}>
                {row.delta >= 0 ? '+' : ''}{row.delta.toFixed(2)}s
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry Timeline */}
      <div className="panel simulator__timeline" id="telemetry-timeline-panel">
        <div className="panel__header">
          <span className="panel__title">Telemetry Timeline</span>
          <div className="timeline__driver-times">
            <span className="timeline__driver-time">
              <span style={{ color: driver1.color }}>Verstappen:</span> {driver1.time}
            </span>
            <span className="timeline__driver-time">
              <span style={{ color: driver2.color }}>Norris:</span> {driver2.time}
            </span>
          </div>
        </div>
        <div className="timeline__charts">
          {/* Speed Chart */}
          {activeOverlays.speed && (
            <div className="timeline__chart-row">
              <span className="timeline__chart-label">1. Speed (km/h)</span>
              <div className="timeline__chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 2, right: 5, bottom: 0, left: 0 }}>
                    <XAxis dataKey="turn" tick={{ fontSize: 7, fill: '#5A6178' }} interval={1} />
                    <YAxis tick={{ fontSize: 7, fill: '#5A6178' }} width={25} domain={[100, 340]} />
                    {(activeDriverLap === 'driver1' || activeDriverLap === 'both') && <Line type="monotone" dataKey="speed1" stroke={driver1.color} dot={false} strokeWidth={1.5} isAnimationActive={false} />}
                    {(activeDriverLap === 'driver2' || activeDriverLap === 'both') && <Line type="monotone" dataKey="speed2" stroke={driver2.color} dot={false} strokeWidth={1.5} isAnimationActive={false} />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Throttle Chart */}
          {activeOverlays.throttle && (
            <div className="timeline__chart-row">
              <span className="timeline__chart-label">2. Throttle (%)</span>
              <div className="timeline__chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 2, right: 5, bottom: 0, left: 0 }}>
                    <XAxis dataKey="turn" tick={{ fontSize: 7, fill: '#5A6178' }} interval={1} />
                    <YAxis tick={{ fontSize: 7, fill: '#5A6178' }} width={25} domain={[0, 100]} />
                    {(activeDriverLap === 'driver1' || activeDriverLap === 'both') && <Line type="monotone" dataKey="throttle1" stroke={driver1.color} dot={false} strokeWidth={1.5} isAnimationActive={false} />}
                    {(activeDriverLap === 'driver2' || activeDriverLap === 'both') && <Line type="monotone" dataKey="throttle2" stroke={driver2.color} dot={false} strokeWidth={1.5} isAnimationActive={false} />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Brake Chart */}
          {activeOverlays.brake && (
            <div className="timeline__chart-row">
              <span className="timeline__chart-label">3. Brake (Bar/%)</span>
              <div className="timeline__chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 2, right: 5, bottom: 0, left: 0 }}>
                    <XAxis dataKey="turn" tick={{ fontSize: 7, fill: '#5A6178' }} interval={1} />
                    <YAxis tick={{ fontSize: 7, fill: '#5A6178' }} width={25} domain={[0, 100]} />
                    {(activeDriverLap === 'driver1' || activeDriverLap === 'both') && <Line type="monotone" dataKey="brake1" stroke={driver1.color} dot={false} strokeWidth={1.5} isAnimationActive={false} />}
                    {(activeDriverLap === 'driver2' || activeDriverLap === 'both') && <Line type="monotone" dataKey="brake2" stroke={driver2.color} dot={false} strokeWidth={1.5} isAnimationActive={false} />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Time Gained/Lost */}
          {activeOverlays.delta && (
            <div className="timeline__chart-row">
              <span className="timeline__chart-label">4. Time Gained/Lost (s)</span>
              <div className="timeline__chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 2, right: 5, bottom: 0, left: 0 }}>
                    <XAxis dataKey="turn" tick={{ fontSize: 7, fill: '#5A6178' }} interval={1} />
                    <YAxis tick={{ fontSize: 7, fill: '#5A6178' }} width={25} domain={[-0.3, 0.3]} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                    <Line type="monotone" dataKey="delta" stroke="#00FF87" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Playback Controls */}
        <div className="timeline__controls">
          <button className="timeline__play-btn" onClick={() => setPlaying(!playing)}>
            {playing ? '⏸' : '▶'}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={scrubberPos}
            onChange={e => setScrubberPos(Number(e.target.value))}
            className="timeline__scrubber"
          />
          <span className="timeline__time">0:{String(Math.floor(scrubberPos * 1.58)).padStart(2, '0')}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}</span>
          <div className="timeline__nav-btns">
            <button className="timeline__nav-btn">◀</button>
            <button className="timeline__nav-btn">▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}
