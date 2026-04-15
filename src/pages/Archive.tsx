import { useState } from 'react';
import { drivers } from '../data/drivers';
import CircuitLoader from '../components/ui/CircuitLoader';
import './Archive.css';

interface RaceResult {
  id: string;
  year: number;
  round: number;
  name: string;
  circuit: string;
  country: string;
  date: string;
  winner: string;
  polePosition: string;
  fastestLap: string;
  fastestLapTime: string;
  laps: number;
  distance: string;
  podium: string[];
  highlights: string[];
}

const historicalResults: RaceResult[] = [
  {
    id: '1', year: 2024, round: 18, name: 'Japanese Grand Prix', circuit: 'Suzuka', country: '🇯🇵',
    date: '2024-04-07', winner: 'VER', polePosition: 'VER', fastestLap: 'VER', fastestLapTime: '1:30.983',
    laps: 53, distance: '307.471 km', podium: ['VER', 'PER', 'LEC'],
    highlights: [
      'Verstappen dominates from pole with a 12-second gap',
      'Leclerc overtakes Norris on lap 34 for the final podium spot',
      'Safety car on lap 8 after Stroll crashes at Degner curve',
      'Fastest pit stop by Red Bull: 1.9 seconds'
    ],
  },
  {
    id: '2', year: 2024, round: 17, name: 'Chinese Grand Prix', circuit: 'Shanghai', country: '🇨🇳',
    date: '2024-04-21', winner: 'VER', polePosition: 'VER', fastestLap: 'NOR', fastestLapTime: '1:37.825',
    laps: 56, distance: '305.066 km', podium: ['VER', 'NOR', 'PER'],
    highlights: [
      'First Chinese GP since 2019 — massive crowd of 200,000+',
      'Sprint race won by Verstappen on Saturday',
      'Norris battles Pérez throughout for P2, overtakes on lap 41',
      'DRS train forms in midfield causing strategic chaos'
    ],
  },
  {
    id: '3', year: 2024, round: 16, name: 'Australian Grand Prix', circuit: 'Melbourne', country: '🇦🇺',
    date: '2024-03-24', winner: 'SAI', polePosition: 'VER', fastestLap: 'LEC', fastestLapTime: '1:19.813',
    laps: 58, distance: '306.124 km', podium: ['SAI', 'LEC', 'NOR'],
    highlights: [
      'Sainz wins from P3 after Verstappen retires with brake failure on lap 3',
      'Ferrari 1-2 — first since 2023 Singapore',
      'Red flag on lap 1 after multi-car incident at Turn 1',
      'McLaren shows strong pace with Norris finishing P3'
    ],
  },
  {
    id: '4', year: 2024, round: 15, name: 'Saudi Arabian Grand Prix', circuit: 'Jeddah', country: '🇸🇦',
    date: '2024-03-09', winner: 'VER', polePosition: 'VER', fastestLap: 'LEC', fastestLapTime: '1:31.632',
    laps: 50, distance: '308.450 km', podium: ['VER', 'PER', 'LEC'],
    highlights: [
      'Verstappen leads every lap from pole to flag',
      'Virtual Safety Car deployed twice due to debris',
      'Leclerc sets fastest lap on final lap with fresh softs',
      'Hamilton struggles in P7, 45 seconds off the lead'
    ],
  },
  {
    id: '5', year: 2024, round: 14, name: 'Bahrain Grand Prix', circuit: 'Sakhir', country: '🇧🇭',
    date: '2024-03-02', winner: 'VER', polePosition: 'VER', fastestLap: 'VER', fastestLapTime: '1:31.447',
    laps: 57, distance: '308.238 km', podium: ['VER', 'PER', 'SAI'],
    highlights: [
      'Season opener: Verstappen cruises to dominant victory',
      'Red Bull 1-2 start mirrors 2023 form',
      'Ferrari shows improved pace over 2023 with Sainz P3',
      'Alonso finishes P5 in his 400th F1 start'
    ],
  },
  {
    id: '6', year: 2023, round: 22, name: 'Abu Dhabi Grand Prix', circuit: 'Yas Marina', country: '🇦🇪',
    date: '2023-11-26', winner: 'VER', polePosition: 'VER', fastestLap: 'LEC', fastestLapTime: '1:27.186',
    laps: 58, distance: '306.183 km', podium: ['VER', 'LEC', 'RUS'],
    highlights: [
      'Record-breaking 19th win of the season for Verstappen',
      'Hamilton finishes P9 in his last race for Mercedes',
      'Leclerc secures P2 in championship standings',
      'Season finale under the Yas Marina lights'
    ],
  },
  {
    id: '7', year: 2023, round: 21, name: 'Las Vegas Grand Prix', circuit: 'Las Vegas', country: '🇺🇸',
    date: '2023-11-19', winner: 'VER', polePosition: 'LEC', fastestLap: 'PIA', fastestLapTime: '1:35.490',
    laps: 50, distance: '306.000 km', podium: ['VER', 'LEC', 'PER'],
    highlights: [
      'Inaugural Las Vegas GP under the neon lights of the Strip',
      'Leclerc takes pole but Verstappen clinches race and championship',
      'Piastri sets fastest lap in stunning McLaren debut',
      'Multiple drain cover incidents during practice sessions'
    ],
  },
  {
    id: '8', year: 2023, round: 20, name: 'Brazilian Grand Prix', circuit: 'Interlagos', country: '🇧🇷',
    date: '2023-11-05', winner: 'VER', polePosition: 'VER', fastestLap: 'NOR', fastestLapTime: '1:13.203',
    laps: 71, distance: '305.909 km', podium: ['VER', 'NOR', 'ALO'],
    highlights: [
      'Verstappen wins Sprint and Race double at Interlagos',
      'Norris battles Alonso throughout for P2, finishes ahead by 0.8s',
      'Heavy rain causes red flag during qualifying',
      'Alonso takes 100th F1 podium'
    ],
  },
];

type WatchTab = 'overview' | 'replay' | 'highlights' | 'onboard' | 'analysis';

const flagMap: Record<string, string> = {
  '🇯🇵': 'jp',
  '🇨🇳': 'cn',
  '🇦🇺': 'au',
  '🇸🇦': 'sa',
  '🇧🇭': 'bh',
  '🇦🇪': 'ae',
  '🇺🇸': 'us',
  '🇧🇷': 'br'
};

const getFlagUrl = (emoji: string) => {
  const code = flagMap[emoji];
  return code ? `https://flagcdn.com/w40/${code}.png` : '';
};

// ─── Race Detail Modal ───
function RaceDetailModal({ race, onClose }: { race: RaceResult; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<WatchTab>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const getDriverName = (code: string) => {
    const d = drivers.find(dr => dr.code === code);
    return d ? `${d.firstName} ${d.lastName}` : code;
  };

  const getDriverColor = (code: string) => {
    return drivers.find(d => d.code === code)?.teamColor || '#FFFFFF';
  };

  const getDriverTeam = (code: string) => {
    return drivers.find(d => d.code === code)?.team || '';
  };

  const tabs: { key: WatchTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'replay', label: 'Race Replay', icon: '▶️' },
    { key: 'highlights', label: 'Highlights', icon: '🎬' },
    { key: 'onboard', label: 'Onboard', icon: '🏎️' },
    { key: 'analysis', label: 'Analysis', icon: '📈' },
  ];

  const handleTabChange = (tab: WatchTab) => {
    if (tab !== 'overview') {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    }
    setActiveTab(tab);
  };

  return (
    <div className="race-modal-overlay" onClick={onClose}>
      <div className="race-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="race-modal__header">
          <div className="race-modal__header-left">
            <img src={getFlagUrl(race.country)} alt="Country Flag" className="race-modal__country-flag" />
            <div>
              <h2 className="race-modal__title">{race.name}</h2>
              <p className="race-modal__meta">{race.circuit} · Round {race.round} · {race.date}</p>
            </div>
          </div>
          <button className="race-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="race-modal__tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`race-modal__tab ${activeTab === tab.key ? 'race-modal__tab--active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
            >
              <span className="race-modal__tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="race-modal__content">
          {isLoading ? (
            <div className="race-modal__loading">
              <CircuitLoader size={160} label="Loading race data..." />
            </div>
          ) : activeTab === 'overview' ? (
            <div className="race-modal__overview">
              {/* Podium */}
              <div className="race-modal__podium">
                <h3 className="race-modal__section-title">PODIUM</h3>
                <div className="race-modal__podium-grid">
                  {race.podium.map((code, i) => (
                    <div key={code} className={`race-modal__podium-card race-modal__podium-card--p${i + 1}`}>
                      <span className="race-modal__podium-pos">P{i + 1}</span>
                      <div className="race-modal__podium-bar" style={{ backgroundColor: getDriverColor(code) }} />
                      <span className="race-modal__podium-name">{getDriverName(code)}</span>
                      <span className="race-modal__podium-team">{getDriverTeam(code)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Race Stats */}
              <div className="race-modal__stats-grid">
                <div className="race-modal__stat-card">
                  <span className="race-modal__stat-label">Laps</span>
                  <span className="race-modal__stat-value">{race.laps}</span>
                </div>
                <div className="race-modal__stat-card">
                  <span className="race-modal__stat-label">Distance</span>
                  <span className="race-modal__stat-value">{race.distance}</span>
                </div>
                <div className="race-modal__stat-card">
                  <span className="race-modal__stat-label">Pole Position</span>
                  <span className="race-modal__stat-value" style={{ color: getDriverColor(race.polePosition) }}>
                    {getDriverName(race.polePosition)}
                  </span>
                </div>
                <div className="race-modal__stat-card">
                  <span className="race-modal__stat-label">Fastest Lap</span>
                  <span className="race-modal__stat-value" style={{ color: '#B14FFF' }}>
                    {getDriverName(race.fastestLap)} — {race.fastestLapTime}
                  </span>
                </div>
              </div>

              {/* Key Moments */}
              <div className="race-modal__moments">
                <h3 className="race-modal__section-title">KEY MOMENTS</h3>
                <div className="race-modal__moments-list">
                  {race.highlights.map((h, i) => (
                    <div key={i} className="race-modal__moment">
                      <span className="race-modal__moment-marker" />
                      <span className="race-modal__moment-text">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'replay' ? (
            <div className="race-modal__watch-section">
              <div className="race-modal__video-placeholder">
                <div className="race-modal__video-icon">▶</div>
                <h3>Full Race Replay</h3>
                <p>Watch the complete {race.name} — {race.laps} laps at {race.circuit}</p>
                <div className="race-modal__video-meta">
                  <span className="race-modal__video-badge">HD</span>
                  <span className="race-modal__video-badge">MULTI-CAM</span>
                  <span className="race-modal__video-badge">{race.laps} LAPS</span>
                </div>
                <button className="btn btn--primary race-modal__play-btn">
                  ▶ Watch Full Race
                </button>
              </div>
              <div className="race-modal__feed-selector">
                <h4>Available Feeds</h4>
                <div className="race-modal__feeds">
                  <div className="race-modal__feed race-modal__feed--active">🌍 World Feed</div>
                  <div className="race-modal__feed">📡 Pit Lane Channel</div>
                  <div className="race-modal__feed">🗺️ Tracker</div>
                  <div className="race-modal__feed">📻 Team Radio</div>
                </div>
              </div>
            </div>
          ) : activeTab === 'highlights' ? (
            <div className="race-modal__watch-section">
              <div className="race-modal__highlights-grid">
                {[
                  { title: 'Race Highlights', duration: '8:42', desc: `Best moments from the ${race.name}` },
                  { title: 'Top 10 Onboard Moments', duration: '5:15', desc: 'The most dramatic onboard camera moments' },
                  { title: 'Post-Race Interviews', duration: '12:30', desc: 'Winner and podium press conference' },
                  { title: 'Pit Stop Analysis', duration: '3:45', desc: 'Breakdown of the key pit stop strategies' },
                  { title: 'Overtake Compilation', duration: '6:20', desc: 'Every significant overtake from the race' },
                  { title: 'Radio Highlights', duration: '4:10', desc: 'The best team radio messages' },
                ].map((clip, i) => (
                  <div key={i} className="race-modal__highlight-card">
                    <div className="race-modal__highlight-thumb">
                      <span className="race-modal__highlight-play">▶</span>
                      <span className="race-modal__highlight-duration">{clip.duration}</span>
                    </div>
                    <div className="race-modal__highlight-info">
                      <span className="race-modal__highlight-title">{clip.title}</span>
                      <span className="race-modal__highlight-desc">{clip.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'onboard' ? (
            <div className="race-modal__watch-section">
              <h4 className="race-modal__onboard-title">Select Driver Onboard Camera</h4>
              <div className="race-modal__onboard-grid">
                {race.podium.concat(['NOR', 'HAM', 'ALO']).map(code => (
                  <div key={code} className="race-modal__onboard-card">
                    <div className="race-modal__onboard-avatar" style={{ borderColor: getDriverColor(code) }}>
                      <span className="race-modal__onboard-play">▶</span>
                    </div>
                    <span className="race-modal__onboard-name" style={{ color: getDriverColor(code) }}>
                      {code}
                    </span>
                    <span className="race-modal__onboard-fullname">{getDriverName(code)}</span>
                    <span className="race-modal__onboard-team">{getDriverTeam(code)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="race-modal__watch-section">
              <div className="race-modal__analysis-panels">
                <div className="race-modal__analysis-card">
                  <h4>📊 Lap-by-Lap Pace</h4>
                  <div className="race-modal__analysis-chart-placeholder">
                    <div className="race-modal__analysis-bars">
                      {Array.from({ length: 15 }, (_, i) => (
                        <div
                          key={i}
                          className="race-modal__analysis-bar"
                          style={{
                            height: `${30 + Math.random() * 60}%`,
                            backgroundColor: i < 5 ? '#1E41FF' : i < 10 ? '#E10600' : '#FF8700',
                            opacity: 0.4 + Math.random() * 0.6,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="race-modal__analysis-card">
                  <h4>🏁 Position Changes</h4>
                  <div className="race-modal__analysis-chart-placeholder">
                    <div className="race-modal__spaghetti">
                      {race.podium.map((code, i) => (
                        <div key={code} className="race-modal__spaghetti-line" style={{
                          background: `linear-gradient(90deg, ${getDriverColor(code)}80, ${getDriverColor(code)})`,
                          top: `${20 + i * 28}%`,
                          width: `${70 + Math.random() * 25}%`,
                        }}>
                          <span>{code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="race-modal__analysis-card race-modal__analysis-card--wide">
                  <h4>⏱️ Sector Comparison</h4>
                  <div className="race-modal__sector-table">
                    <div className="race-modal__sector-header">
                      <span>Driver</span><span>S1</span><span>S2</span><span>S3</span><span>Total</span>
                    </div>
                    {race.podium.map(code => (
                      <div key={code} className="race-modal__sector-row">
                        <span style={{ color: getDriverColor(code), fontWeight: 700 }}>{code}</span>
                        <span>{(28 + Math.random() * 2).toFixed(3)}</span>
                        <span>{(35 + Math.random() * 3).toFixed(3)}</span>
                        <span>{(26 + Math.random() * 2).toFixed(3)}</span>
                        <span style={{ color: '#00E5FF', fontWeight: 700 }}>{race.fastestLapTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Archive Page ───
export default function Archive() {
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRace, setSelectedRace] = useState<RaceResult | null>(null);

  const filtered = historicalResults.filter(r => {
    if (yearFilter !== 'all' && r.year !== yearFilter) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.circuit.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getDriverName = (code: string) => {
    const d = drivers.find(dr => dr.code === code);
    return d ? `${d.firstName} ${d.lastName}` : code;
  };

  const getDriverColor = (code: string) => {
    return drivers.find(d => d.code === code)?.teamColor || '#FFFFFF';
  };

  return (
    <div className="archive bg-grid" id="archive-page">
      <div className="archive__content">
        <div className="archive__header">
          <h1 className="archive__title">Parc Fermé</h1>
          <p className="archive__subtitle">Historical Race Archive · Click any race to explore replays, highlights & analysis</p>
        </div>

        <div className="archive__filters">
          <input
            type="text"
            placeholder="Search races, circuits..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="archive__search"
            id="archive-search"
          />
          <div className="archive__year-filters">
            <button
              className={`archive__year-btn ${yearFilter === 'all' ? 'archive__year-btn--active' : ''}`}
              onClick={() => setYearFilter('all')}
            >All Seasons</button>
            <button
              className={`archive__year-btn ${yearFilter === 2024 ? 'archive__year-btn--active' : ''}`}
              onClick={() => setYearFilter(2024)}
            >2024</button>
            <button
              className={`archive__year-btn ${yearFilter === 2023 ? 'archive__year-btn--active' : ''}`}
              onClick={() => setYearFilter(2023)}
            >2023</button>
          </div>
        </div>

        <div className="archive__grid">
          {filtered.map(race => (
            <div
              key={race.id}
              className="panel archive__card"
              id={`archive-card-${race.id}`}
              onClick={() => setSelectedRace(race)}
            >
              <div className="archive__card-header">
                <span className="archive__card-round">R{race.round}</span>
                <img src={getFlagUrl(race.country)} alt="Country Flag" className="archive__card-country-flag" />
                <span className="archive__card-year">{race.year}</span>
              </div>
              <h3 className="archive__card-name">{race.name}</h3>
              <p className="archive__card-circuit">{race.circuit} · {race.date}</p>

              <div className="archive__card-stats">
                <div className="archive__card-stat">
                  <span className="archive__card-stat-label">Winner</span>
                  <span className="archive__card-stat-value" style={{ color: getDriverColor(race.winner) }}>
                    {getDriverName(race.winner)}
                  </span>
                </div>
                <div className="archive__card-stat">
                  <span className="archive__card-stat-label">Pole</span>
                  <span className="archive__card-stat-value">{getDriverName(race.polePosition)}</span>
                </div>
                <div className="archive__card-stat">
                  <span className="archive__card-stat-label">Fastest Lap</span>
                  <span className="archive__card-stat-value">{getDriverName(race.fastestLap)}</span>
                </div>
              </div>

              <div className="archive__card-footer">
                <span>{race.laps} Laps · {race.distance}</span>
                <button className="archive__view-btn">
                  View Race →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Race Detail Modal */}
      {selectedRace && (
        <RaceDetailModal race={selectedRace} onClose={() => setSelectedRace(null)} />
      )}
    </div>
  );
}
