import { useState, useRef, useEffect } from 'react';
import { useRace } from '../../context/RaceContext';
import './RaceEngineerFAB.css';

interface Message {
  id: string;
  role: 'user' | 'engineer';
  content: string;
  timestamp: string;
}

// AI System Prompt used when connecting to a live AI API
// const SYSTEM_PROMPT = `You are an F1 Race Engineer AI assistant for GridSync...`;

export default function RaceEngineerFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'engineer',
      content: "Race Engineer online. I'm monitoring all telemetry feeds. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state } = useRace();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate AI-like response based on race state
  const generateResponse = (userMsg: string): string => {
    const q = userMsg.toLowerCase();
    const leader = state.drivers[0];
    const gap12 = state.drivers[1]?.gap || 'N/A';

    if (q.includes('strategy') || q.includes('pit') || q.includes('tyre')) {
      return `📊 Strategy Update (Lap ${state.currentLap}/${state.totalLaps}):\n\n` +
        `${leader.driverCode} is on ${leader.tyreCompound} compound (${leader.tyreAge} laps old).\n` +
        `Optimal pit window: Lap ${state.currentLap + 8}-${state.currentLap + 12}.\n` +
        `Undercut threat from P2 (${state.drivers[1]?.driverCode}) is ${parseFloat(gap12) < 3 ? 'HIGH' : 'LOW'} — gap: ${gap12}.\n\n` +
        `Recommendation: ${leader.tyreAge > 12 ? 'Box this lap for Hard compound.' : 'Stay out, tyres still in the window.'}`;
    }

    if (q.includes('weather') || q.includes('rain')) {
      return `🌤️ Weather Report:\n\n` +
        `Air: ${state.weather.temp}°C | Track: ${state.weather.trackTemp}°C\n` +
        `Wind: ${state.weather.wind} | Humidity: ${state.weather.humidity}%\n` +
        `Condition: ${state.weather.condition}\n` +
        `Rain probability: ${state.weather.rainChance}%\n\n` +
        `${state.weather.rainChance > 50 ? '⚠️ Consider intermediate tyres on next stop.' : 'No rain expected in the pit window.'}`;
    }

    if (q.includes('gap') || q.includes('leader') || q.includes('position')) {
      return `🏁 Race Positions (Lap ${state.currentLap}):\n\n` +
        state.drivers.slice(0, 5).map(d =>
          `P${d.position} ${d.driverCode} — ${d.gap} (${d.tyreCompound}, ${d.tyreAge} laps)`
        ).join('\n') +
        `\n\nDRS: ${state.drivers.filter(d => d.drs).length} cars currently with DRS active.`;
    }

    if (q.includes('speed') || q.includes('telemetry') || q.includes('data')) {
      return `📡 Live Telemetry — ${leader.driverCode}:\n\n` +
        `Speed: ${leader.speed} km/h\n` +
        `RPM: ${leader.rpm}\n` +
        `Gear: ${leader.gear}\n` +
        `Throttle: ${leader.throttle}%\n` +
        `Brake: ${leader.brake}%\n` +
        `DRS: ${leader.drs ? 'OPEN' : 'CLOSED'}`;
    }

    if (q.includes('sector') || q.includes('time')) {
      return `⏱️ Sector Times:\n\n` +
        state.drivers.slice(0, 3).map(d =>
          `${d.driverCode}: S1 ${d.sectorTimes.s1} | S2 ${d.sectorTimes.s2} | S3 ${d.sectorTimes.s3}`
        ).join('\n') +
        `\n\nFastest overall: ${leader.driverCode} — ${leader.lastLap}`;
    }

    return `📋 Race Status (Lap ${state.currentLap}/${state.totalLaps}):\n\n` +
      `Leader: ${leader.driverCode} (${leader.lastLap})\n` +
      `P2: ${state.drivers[1]?.driverCode} (${gap12})\n` +
      `Track: ${state.circuit}\n` +
      `Conditions: ${state.weather.condition}, ${state.weather.temp}°C\n\n` +
      `Ask me about strategy, weather, gaps, telemetry, or sector times for detailed analysis.`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const response: Message = {
      id: (Date.now() + 1).toString(),
      role: 'engineer',
      content: generateResponse(input),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, response]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Race event alerts
  useEffect(() => {
    if (state.events.length > 0 && isOpen) {
      const latest = state.events[0];
      const alertExists = messages.some(m => m.content.includes(latest.message));
      if (!alertExists && messages.length > 1) {
        setMessages(prev => [
          ...prev,
          {
            id: `alert-${latest.id}`,
            role: 'engineer',
            content: `🚨 Alert: ${latest.message}`,
            timestamp: latest.timestamp,
          },
        ]);
      }
    }
  }, [state.events.length]);

  return (
    <>
      {/* FAB Button */}
      <button
        className={`fab ${isOpen ? 'fab--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        id="race-engineer-fab"
        title="Race Engineer AI"
      >
        {isOpen ? '✕' : '🏎️'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="engineer-panel" id="race-engineer-panel">
          <div className="engineer-panel__header">
            <div className="engineer-panel__title-row">
              <span className="engineer-panel__icon">🎧</span>
              <div>
                <h3 className="engineer-panel__title">Race Engineer</h3>
                <span className="engineer-panel__status">
                  <span className="engineer-panel__dot"></span>
                  Online — Monitoring all feeds
                </span>
              </div>
            </div>
          </div>

          <div className="engineer-panel__messages">
            {messages.map(msg => (
              <div key={msg.id} className={`engineer-msg engineer-msg--${msg.role}`}>
                <div className="engineer-msg__bubble">
                  <pre className="engineer-msg__text">{msg.content}</pre>
                  <span className="engineer-msg__time">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="engineer-msg engineer-msg--engineer">
                <div className="engineer-msg__bubble">
                  <div className="engineer-msg__typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="engineer-panel__input-row">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about strategy, weather, gaps..."
              className="engineer-panel__input"
              id="engineer-input"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="engineer-panel__send"
            >
              ➤
            </button>
          </div>

          <div className="engineer-panel__quick-actions">
            {['Strategy', 'Weather', 'Gaps', 'Telemetry'].map(q => (
              <button
                key={q}
                className="engineer-panel__quick-btn"
                onClick={() => { setInput(q); }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
