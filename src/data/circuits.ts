export interface TrackCorner {
  x: number;
  y: number;
  label: string;
  name: string;
}

export interface CircuitData {
  id: string;
  name: string;
  country: string;
  city: string;
  laps: number;
  distance: string;
  lapRecord: string;
  lapRecordHolder: string;
  lapRecordYear: number;

  trackPath: string;
  drsZones: string[];
  corners: TrackCorner[];
  startFinish: { x1: number; y1: number; x2: number; y2: number };
  startFinishText: { x: number; y: number };
  sectors: {
    number: number;
    textX: number;
    textY: number;
    lineX1: number;
    lineY1: number;
    lineX2: number;
    lineY2: number;
  }[];
}

export const circuitsList: CircuitData[] = [
  {
    id: 'suzuka',
    name: 'Suzuka Circuit',
    country: 'Japan',
    city: 'Suzuka',
    laps: 53,
    distance: '5.807km',
    lapRecord: '1:30.983',
    lapRecordHolder: 'L. Hamilton',
    lapRecordYear: 2019,
    trackPath: "M 120,200 C 120,180 140,140 180,120 C 220,100 260,80 300,70 C 340,60 380,55 420,60 C 460,65 490,80 510,100 C 530,120 540,150 530,180 C 520,210 490,230 470,250 C 450,270 440,290 450,320 C 460,350 490,370 520,380 C 550,390 580,395 600,400 C 620,405 640,415 650,435 C 660,455 650,475 630,490 C 610,505 580,510 550,505 C 520,500 490,490 460,475 C 430,460 400,450 370,450 C 340,450 310,455 280,465 C 250,475 220,480 190,475 C 160,470 140,450 130,425 C 120,400 115,370 115,340 C 115,310 117,270 118,250 C 119,230 120,210 120,200 Z",
    drsZones: [
      "M 180,120 C 220,100 260,80 300,70 C 340,60 380,55 420,60",
      "M 190,475 C 160,470 140,450 130,425 C 120,400 115,370 115,340"
    ],
    corners: [
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
    ],
    startFinish: { x1: 113, y1: 260, x2: 127, y2: 260 },
    startFinishText: { x: 120, y: 252 },
    sectors: [
      { number: 1, textX: 230, textY: 88, lineX1: 230, lineY1: 92, lineX2: 290, lineY2: 92 },
      { number: 2, textX: 520, textY: 260, lineX1: 520, lineY1: 264, lineX2: 580, lineY2: 264 },
      { number: 3, textX: 550, textY: 480, lineX1: 550, lineY1: 484, lineX2: 610, lineY2: 484 }
    ]
  },
  {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    country: 'United Kingdom',
    city: 'Silverstone',
    laps: 52,
    distance: '5.891km',
    lapRecord: '1:27.097',
    lapRecordHolder: 'M. Verstappen',
    lapRecordYear: 2020,
    trackPath: "M 420,400 L 250,400 C 180,400 150,380 150,330 C 150,280 200,280 220,250 C 240,220 180,200 150,150 C 120,100 180,80 250,100 C 320,120 400,100 450,120 C 500,140 520,100 580,120 C 640,140 700,200 680,260 C 660,320 580,300 550,350 C 520,400 480,400 420,400 Z",
    drsZones: [
      "M 420,400 L 250,400",
      "M 580,120 C 640,140 700,200 680,260"
    ],
    corners: [
      { x: 180, y: 390, label: '1', name: 'Abbey' },
      { x: 140, y: 330, label: '3', name: 'Village' },
      { x: 190, y: 220, label: '4', name: 'The Loop' },
      { x: 130, y: 150, label: '6', name: 'Brooklands' },
      { x: 230, y: 90, label: '7', name: 'Luffield' },
      { x: 420, y: 110, label: '9', name: 'Copse' },
      { x: 500, y: 125, label: '10', name: 'Maggotts' },
      { x: 550, y: 115, label: '11', name: 'Becketts' },
      { x: 690, y: 230, label: '15', name: 'Stowe' },
      { x: 530, y: 350, label: '16', name: 'Vale' },
      { x: 450, y: 410, label: '18', name: 'Club' }
    ],
    startFinish: { x1: 420, y1: 393, x2: 420, y2: 407 },
    startFinishText: { x: 420, y: 385 },
    sectors: [
      { number: 1, textX: 180, textY: 260, lineX1: 180, lineY1: 264, lineX2: 220, lineY2: 264 },
      { number: 2, textX: 470, textY: 90, lineX1: 470, lineY1: 94, lineX2: 520, lineY2: 94 },
      { number: 3, textX: 620, textY: 350, lineX1: 620, lineY1: 354, lineX2: 670, lineY2: 354 }
    ]
  },
  {
    id: 'monaco',
    name: 'Circuit de Monaco',
    country: 'Monaco',
    city: 'Monte Carlo',
    laps: 78,
    distance: '3.337km',
    lapRecord: '1:12.909',
    lapRecordHolder: 'L. Hamilton',
    lapRecordYear: 2021,
    trackPath: "M 250,400 L 150,400 C 100,400 100,320 150,300 C 200,280 200,220 250,220 C 300,220 300,280 260,300 C 220,320 200,380 280,380 L 380,300 C 450,230 480,230 550,280 C 620,330 550,400 480,400 C 410,400 380,450 350,450 C 320,450 280,450 250,400 Z",
    drsZones: [
      "M 250,400 L 150,400"
    ],
    corners: [
      { x: 120, y: 395, label: '1', name: 'Sainte Devote' },
      { x: 160, y: 280, label: '3', name: 'Massenet' },
      { x: 230, y: 210, label: '4', name: 'Casino' },
      { x: 280, y: 270, label: '5', name: 'Mirabeau' },
      { x: 220, y: 350, label: '6', name: 'Grand Hotel Hairpin' },
      { x: 300, y: 370, label: '8', name: 'Portier' },
      { x: 530, y: 260, label: '9', name: 'Tunnel' },
      { x: 560, y: 380, label: '10', name: 'Nouvelle Chicane' },
      { x: 440, y: 400, label: '12', name: 'Tabac' },
      { x: 370, y: 450, label: '15', name: 'Swimming Pool' },
      { x: 270, y: 450, label: '18', name: 'Rascasse' }
    ],
    startFinish: { x1: 200, y1: 393, x2: 200, y2: 407 },
    startFinishText: { x: 200, y: 385 },
    sectors: [
      { number: 1, textX: 200, textY: 260, lineX1: 200, lineY1: 264, lineX2: 240, lineY2: 264 },
      { number: 2, textX: 430, textY: 250, lineX1: 430, lineY1: 254, lineX2: 480, lineY2: 254 },
      { number: 3, textX: 380, textY: 410, lineX1: 380, lineY1: 414, lineX2: 430, lineY2: 414 }
    ]
  }
];

export const getRandomCircuit = (): CircuitData => {
  const randomIndex = Math.floor(Math.random() * circuitsList.length);
  return circuitsList[randomIndex];
};

// Backwards compatibility for components that might still import these directly 
// until we refactor them.
export const suzukaTrackPath = circuitsList[0].trackPath;
export const suzukaLandmarks = circuitsList[0].corners;
