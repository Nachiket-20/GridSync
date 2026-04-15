import './CircuitLoader.css';

interface CircuitLoaderProps {
  size?: number;
  label?: string;
}

// A mini circuit SVG with a car dot that races around it — used as loading/buffering indicator
export default function CircuitLoader({ size = 120, label = 'Loading...' }: CircuitLoaderProps) {
  const trackPath = "M 30,50 C 30,30 50,15 70,12 C 90,9 110,15 120,25 C 130,35 132,50 125,62 C 118,74 105,78 95,85 C 85,92 82,100 88,108 C 94,116 108,118 118,115 C 128,112 135,105 138,95 C 141,85 140,72 135,62";
  const trackPath2 = "M 135,62 C 130,52 120,48 110,50 C 100,52 90,58 80,62 C 70,66 58,67 48,63 C 38,59 32,52 30,50";
  const fullPath = trackPath + " " + trackPath2.replace("M 135,62 C", "C");

  return (
    <div className="circuit-loader" style={{ width: size, height: size }} id="circuit-loader">
      <svg viewBox="0 0 160 130" className="circuit-loader__svg">
        <defs>
          <filter id="loader-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="loader-track-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E10600" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#E10600" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Track surface */}
        <path d={fullPath} fill="none" stroke="url(#loader-track-grad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        {/* Track line */}
        <path d={fullPath} fill="none" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#loader-glow)" />

        {/* Animated car dot */}
        <circle r="4" fill="#00E5FF" filter="url(#loader-glow)">
          <animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto">
            <mpath href="#loader-motion-path" />
          </animateMotion>
        </circle>
        {/* Trail */}
        <circle r="2.5" fill="#E10600" opacity="0.6">
          <animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto" begin="0.15s">
            <mpath href="#loader-motion-path" />
          </animateMotion>
        </circle>
        <circle r="1.5" fill="#FFD700" opacity="0.4">
          <animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto" begin="0.3s">
            <mpath href="#loader-motion-path" />
          </animateMotion>
        </circle>

        {/* Hidden motion path */}
        <path id="loader-motion-path" d={fullPath} fill="none" stroke="none" />
      </svg>
      <span className="circuit-loader__label">{label}</span>
    </div>
  );
}
