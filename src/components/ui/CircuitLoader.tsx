import { useState } from 'react';
import { getRandomCircuit } from '../../data/circuits';
import './CircuitLoader.css';

interface CircuitLoaderProps {
  size?: number;
  label?: string;
}

// A mini circuit SVG with a car dot that races around it — used as loading/buffering indicator
export default function CircuitLoader({ size = 120, label = 'Loading...' }: CircuitLoaderProps) {
  // Pick random circuit on initial load
  const [circuit] = useState(() => getRandomCircuit());

  return (
    <div className="circuit-loader" style={{ width: size, height: size }} id="circuit-loader">
      <svg viewBox="0 0 760 560" className="circuit-loader__svg">
        <defs>
          <filter id="loader-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
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
        <path d={circuit.trackPath} fill="none" stroke="url(#loader-track-grad)" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
        {/* Track line */}
        <path d={circuit.trackPath} fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#loader-glow)" />

        {/* Animated car dot */}
        <circle r="12" fill="#00E5FF" filter="url(#loader-glow)">
          <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
            <mpath href="#loader-motion-path" />
          </animateMotion>
        </circle>
        {/* Trail */}
        <circle r="8" fill="#E10600" opacity="0.6">
          <animateMotion dur="4s" repeatCount="indefinite" rotate="auto" begin="0.15s">
            <mpath href="#loader-motion-path" />
          </animateMotion>
        </circle>
        <circle r="5" fill="#FFD700" opacity="0.4">
          <animateMotion dur="4s" repeatCount="indefinite" rotate="auto" begin="0.3s">
            <mpath href="#loader-motion-path" />
          </animateMotion>
        </circle>

        {/* Hidden motion path */}
        <path id="loader-motion-path" d={circuit.trackPath} fill="none" stroke="none" />
      </svg>
      <span className="circuit-loader__label">{label}</span>
    </div>
  );
}

