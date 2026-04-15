import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import RaceEngineerFAB from '../ai/RaceEngineerFAB';

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <RaceEngineerFAB />
    </div>
  );
}
