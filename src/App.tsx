import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RaceProvider } from './context/RaceContext';
import MainLayout from './components/layout/MainLayout';
import Paddock from './pages/Paddock';
import RaceControl from './pages/RaceControl';
import Simulator from './pages/Simulator';
import Archive from './pages/Archive';
import Profile from './pages/Profile';

export default function App() {
  return (
    <RaceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Paddock />} />
            <Route path="/race-control" element={<RaceControl />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RaceProvider>
  );
}
