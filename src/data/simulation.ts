import { drivers } from './drivers';

export interface TelemetryData {
  driverCode: string;
  position: number;
  lastLap: string;
  gap: string;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
  drs: boolean;
  tyreCompound: 'S' | 'M' | 'H' | 'I' | 'W';
  tyreAge: number;
  trackProgress: number; // 0-1 position on track
  sectorTimes: { s1: string; s2: string; s3: string };
  stints: Array<{ compound: 'S' | 'M' | 'H'; startLap: number; endLap: number | null }>;
}

export interface RaceState {
  sessionType: string;
  round: number;
  raceName: string;
  circuit: string;
  currentLap: number;
  totalLaps: number;
  sessionTime: string;
  weather: {
    temp: number;
    trackTemp: number;
    wind: string;
    humidity: number;
    condition: string;
    rainChance: number;
  };
  drivers: TelemetryData[];
  events: RaceEvent[];
}

export interface RaceEvent {
  id: string;
  type: 'flag' | 'pit' | 'overtake' | 'incident' | 'drs' | 'penalty';
  message: string;
  timestamp: string;
  driverCode?: string;
}

// Generate simulated gap values
const generateGap = (pos: number): string => {
  if (pos === 1) return '—';
  const base = pos * 1.8 + Math.random() * 2.5;
  return `+${base.toFixed(1)}s`;
};

// Generate a lap time string
const generateLapTime = (base: number): string => {
  const minutes = Math.floor(base / 60);
  const seconds = (base % 60).toFixed(3);
  return `${minutes}:${seconds.padStart(6, '0')}`;
};

// Strategy patterns per driver
const strategyPatterns: Record<string, Array<{ compound: 'S' | 'M' | 'H'; startLap: number; endLap: number | null }>> = {
  VER: [{ compound: 'S', startLap: 1, endLap: 14 }, { compound: 'M', startLap: 15, endLap: 34 }, { compound: 'H', startLap: 35, endLap: null }],
  PER: [{ compound: 'S', startLap: 1, endLap: 12 }, { compound: 'M', startLap: 13, endLap: 33 }, { compound: 'H', startLap: 34, endLap: null }],
  LEC: [{ compound: 'S', startLap: 1, endLap: 15 }, { compound: 'M', startLap: 16, endLap: 35 }, { compound: 'H', startLap: 36, endLap: null }],
  SAI: [{ compound: 'S', startLap: 1, endLap: 13 }, { compound: 'M', startLap: 14, endLap: 32 }, { compound: 'H', startLap: 33, endLap: null }],
  NOR: [{ compound: 'M', startLap: 1, endLap: 20 }, { compound: 'H', startLap: 21, endLap: 40 }, { compound: 'S', startLap: 41, endLap: null }],
  PIA: [{ compound: 'M', startLap: 1, endLap: 18 }, { compound: 'H', startLap: 19, endLap: 38 }, { compound: 'S', startLap: 39, endLap: null }],
  HAM: [{ compound: 'S', startLap: 1, endLap: 16 }, { compound: 'M', startLap: 17, endLap: 36 }, { compound: 'H', startLap: 37, endLap: null }],
  RUS: [{ compound: 'S', startLap: 1, endLap: 14 }, { compound: 'M', startLap: 15, endLap: 34 }, { compound: 'H', startLap: 35, endLap: null }],
  ALO: [{ compound: 'M', startLap: 1, endLap: 22 }, { compound: 'H', startLap: 23, endLap: 42 }, { compound: 'S', startLap: 43, endLap: null }],
  STR: [{ compound: 'M', startLap: 1, endLap: 20 }, { compound: 'H', startLap: 21, endLap: 40 }, { compound: 'S', startLap: 41, endLap: null }],
};

// Current tyre compound based on lap and strategy
const getCurrentCompound = (code: string, lap: number): 'S' | 'M' | 'H' => {
  const strats = strategyPatterns[code] || strategyPatterns['VER'];
  for (const stint of strats) {
    if (stint.endLap === null || lap <= stint.endLap) return stint.compound;
  }
  return 'H';
};

export const createInitialRaceState = (): RaceState => {
  const currentLap = 34;

  const driverTelemetry: TelemetryData[] = drivers.slice(0, 10).map((d, i) => ({
    driverCode: d.code,
    position: i + 1,
    lastLap: generateLapTime(88 + Math.random() * 3),
    gap: generateGap(i + 1),
    speed: 280 + Math.random() * 40,
    rpm: 10000 + Math.random() * 2000,
    gear: Math.ceil(Math.random() * 8),
    throttle: Math.random() * 100,
    brake: Math.random() * 30,
    drs: Math.random() > 0.7,
    tyreCompound: getCurrentCompound(d.code, currentLap),
    tyreAge: Math.floor(Math.random() * 15) + 1,
    trackProgress: (i * 0.08 + Math.random() * 0.05) % 1,
    sectorTimes: {
      s1: `0:${(29 + Math.random() * 2).toFixed(3)}`,
      s2: `0:${(35 + Math.random() * 3).toFixed(3)}`,
      s3: `0:${(24 + Math.random() * 2).toFixed(3)}`,
    },
    stints: strategyPatterns[d.code] || strategyPatterns['VER'],
  }));

  return {
    sessionType: 'RACE',
    round: 18,
    raceName: 'JAPANESE GP',
    circuit: 'Suzuka Circuit',
    currentLap,
    totalLaps: 53,
    sessionTime: '1:12:45',
    weather: {
      temp: 21,
      trackTemp: 34,
      wind: '18 km/h NW',
      humidity: 58,
      condition: 'Cloudy',
      rainChance: 30,
    },
    drivers: driverTelemetry,
    events: [
      { id: '1', type: 'drs', message: 'DRS Enabled — Zone 1', timestamp: '1:10:22', driverCode: 'VER' },
      { id: '2', type: 'pit', message: 'PIT — PER Box Box (Stint 3: Hard)', timestamp: '1:08:45', driverCode: 'PER' },
      { id: '3', type: 'overtake', message: 'LEC passes SAI — T1 (Lap 32)', timestamp: '1:06:10', driverCode: 'LEC' },
      { id: '4', type: 'flag', message: 'Yellow Flag — Sector 2 (debris)', timestamp: '1:03:33' },
    ],
  };
};

// Tick simulation — called every 250ms
export const tickRaceState = (prev: RaceState): RaceState => {
  const newDrivers = prev.drivers.map(d => {
    // Advance track position
    let newProgress = d.trackProgress + 0.002 + Math.random() * 0.001;
    if (newProgress >= 1) newProgress -= 1;

    // Update speed based on track position (simulate corners)
    const cornerFactor = Math.sin(newProgress * Math.PI * 12);
    const newSpeed = 180 + 140 * (0.5 + 0.5 * cornerFactor) + (Math.random() - 0.5) * 10;
    const newRpm = 8000 + (newSpeed / 320) * 5000 + (Math.random() - 0.5) * 500;
    const newThrottle = Math.max(0, Math.min(100, 50 + cornerFactor * 50 + (Math.random() - 0.5) * 10));
    const newBrake = cornerFactor < -0.3 ? Math.abs(cornerFactor) * 80 : 0;

    return {
      ...d,
      trackProgress: newProgress,
      speed: Math.round(newSpeed),
      rpm: Math.round(newRpm),
      throttle: Math.round(newThrottle),
      brake: Math.round(newBrake),
      gear: Math.max(1, Math.min(8, Math.ceil(newSpeed / 45))),
      drs: newSpeed > 280 && newBrake === 0,
    };
  });

  // Update session time
  const timeParts = prev.sessionTime.split(':').map(Number);
  let totalSecs = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
  totalSecs += 0.25;
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = Math.floor(totalSecs % 60);

  return {
    ...prev,
    sessionTime: `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    drivers: newDrivers,
  };
};
