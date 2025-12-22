import { Outlet } from 'react-router';
import BottomNavbar from './bottom-navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 pb-16">
      <Outlet />
      <BottomNavbar />
    </div>
  );
}
