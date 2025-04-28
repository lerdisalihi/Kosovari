import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
} 