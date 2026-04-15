import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import type { RaceState } from '../data/simulation';
import { createInitialRaceState, tickRaceState } from '../data/simulation';

type RaceAction =
  | { type: 'TICK' }
  | { type: 'SET_STATE'; payload: RaceState }
  | { type: 'UPDATE_DRIVER'; payload: { code: string; data: Partial<RaceState['drivers'][0]> } };

function raceReducer(state: RaceState, action: RaceAction): RaceState {
  switch (action.type) {
    case 'TICK':
      return tickRaceState(state);
    case 'SET_STATE':
      return action.payload;
    case 'UPDATE_DRIVER': {
      const newDrivers = state.drivers.map(d =>
        d.driverCode === action.payload.code ? { ...d, ...action.payload.data } : d
      );
      return { ...state, drivers: newDrivers };
    }
    default:
      return state;
  }
}

interface RaceContextType {
  state: RaceState;
  dispatch: React.Dispatch<RaceAction>;
  isLive: boolean;
  setIsLive: (live: boolean) => void;
}

const RaceContext = createContext<RaceContextType | null>(null);

export function RaceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(raceReducer, createInitialRaceState());
  const [isLive, setIsLive] = React.useState(true);
  const tickRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (isLive) {
      tickRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 250); // 4Hz updates
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isLive]);

  const value = React.useMemo(() => ({
    state,
    dispatch,
    isLive,
    setIsLive,
  }), [state, isLive]);

  return (
    <RaceContext.Provider value={value}>
      {children}
    </RaceContext.Provider>
  );
}

export function useRace() {
  const context = useContext(RaceContext);
  if (!context) throw new Error('useRace must be used within RaceProvider');
  return context;
}

export function useDriver(code: string) {
  const { state } = useRace();
  return state.drivers.find(d => d.driverCode === code);
}

// OpenF1 API hook
export function useOpenF1() {
  const fetchCarData = useCallback(async () => {
    try {
      const response = await fetch('https://api.openf1.org/v1/car_data?session_key=latest');
      if (!response.ok) throw new Error('OpenF1 API error');
      return await response.json();
    } catch (error) {
      console.warn('OpenF1 API unavailable, using simulation:', error);
      return null;
    }
  }, []);

  const fetchDriverPositions = useCallback(async () => {
    try {
      const response = await fetch('https://api.openf1.org/v1/position?session_key=latest');
      if (!response.ok) throw new Error('OpenF1 API error');
      return await response.json();
    } catch (error) {
      console.warn('OpenF1 positions unavailable:', error);
      return null;
    }
  }, []);

  const fetchSessionInfo = useCallback(async () => {
    try {
      const response = await fetch('https://api.openf1.org/v1/sessions?session_key=latest');
      if (!response.ok) throw new Error('OpenF1 API error');
      return await response.json();
    } catch (error) {
      console.warn('OpenF1 session info unavailable:', error);
      return null;
    }
  }, []);

  return { fetchCarData, fetchDriverPositions, fetchSessionInfo };
}
