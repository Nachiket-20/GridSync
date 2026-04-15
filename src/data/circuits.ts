export interface Circuit {
  id: string;
  name: string;
  country: string;
  city: string;
  laps: number;
  distance: string;
  lapRecord: string;
  lapRecordHolder: string;
  lapRecordYear: number;
}

export const circuits: Record<string, Circuit> = {
  suzuka: {
    id: 'suzuka',
    name: 'Suzuka Circuit',
    country: 'Japan',
    city: 'Suzuka',
    laps: 53,
    distance: '5.807km',
    lapRecord: '1:30.983',
    lapRecordHolder: 'L. Hamilton',
    lapRecordYear: 2019,
  },
};

// Suzuka track SVG path — stylized to match reference images
export const suzukaTrackPath = `
  M 180 320
  C 180 320, 160 280, 170 240
  C 180 200, 220 170, 260 150
  C 300 130, 340 100, 370 80
  C 400 60, 440 50, 480 55
  C 520 60, 550 80, 560 110
  C 570 140, 550 170, 530 190
  C 510 210, 490 230, 500 260
  C 510 290, 540 310, 570 320
  C 600 330, 640 340, 670 350
  C 700 360, 720 380, 720 410
  C 720 440, 700 460, 670 470
  C 640 480, 600 480, 560 470
  C 520 460, 490 440, 460 430
  C 430 420, 400 420, 370 430
  C 340 440, 310 450, 280 450
  C 250 450, 220 440, 200 420
  C 180 400, 170 370, 180 340
  Z
`;

// Track corner/landmark positions for labels
export const suzukaLandmarks = [
  { id: 'sector1', label: 'Sector 1', x: 250, y: 130 },
  { id: 'sector2', label: 'Sector 2', x: 560, y: 170 },
  { id: 'sector3', label: 'Sector 3', x: 600, y: 450 },
  { id: '130r', label: '130R', x: 530, y: 310 },
  { id: 'degner', label: 'Degner', x: 560, y: 260 },
  { id: 'spoon', label: 'Spoon', x: 710, y: 420 },
  { id: 'hairpin', label: 'Hairpin', x: 680, y: 470 },
];

// Turn positions for the simulator view
export const suzukaTurns = [
  { id: 'T1', x: 220, y: 165, label: 'T1' },
  { id: 'T2', x: 260, y: 150, label: 'T2' },
  { id: 'T3', x: 310, y: 120, label: 'T3' },
  { id: 'T4', x: 350, y: 95, label: 'T4' },
  { id: 'T5', x: 390, y: 75, label: 'T5' },
  { id: 'T6', x: 430, y: 60, label: 'T6' },
  { id: 'T7', x: 480, y: 55, label: 'T7' },
  { id: 'T8', x: 530, y: 80, label: 'T8' },
  { id: 'T9', x: 555, y: 120, label: 'T9' },
  { id: 'T10', x: 540, y: 170, label: 'T10' },
  { id: 'T11', x: 510, y: 210, label: 'T11' },
  { id: 'T12', x: 500, y: 250, label: 'T12' },
  { id: 'T13', x: 530, y: 300, label: 'T13' },
  { id: 'T14', x: 580, y: 330, label: 'T14' },
  { id: 'T15', x: 650, y: 350, label: 'T15' },
  { id: 'T16', x: 720, y: 400, label: 'T16' },
  { id: 'T17', x: 700, y: 460, label: 'T17' },
  { id: 'T18', x: 620, y: 480, label: 'T18' },
  { id: 'T19', x: 250, y: 440, label: 'T19' },
];

// Simulated driver positions on track (percentage along track path 0-1)
export const getPointOnTrack = (progress: number): { x: number; y: number } => {
  // Simplified parametric track calculation
  const t = progress * Math.PI * 2;
  const cx = 440, cy = 280;
  const rx = 270, ry = 200;
  
  // Figure-8 shape for Suzuka
  const x = cx + rx * Math.sin(t) * Math.cos(t * 0.5);
  const y = cy + ry * Math.cos(t);
  
  return { x, y };
};
