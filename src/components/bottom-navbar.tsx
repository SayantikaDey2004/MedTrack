import { useNavigate, useLocation } from 'react-router';
import { Home, Pill, User, CheckSquare } from 'lucide-react';

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="flex justify-around py-1.5">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center ${
            isActive('/') ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') ? 'fill-indigo-600' : ''}`} />
          <span className="text-[9px]">Home</span>
        </button>

        <button
          onClick={() => navigate('/today')}
          className={`flex flex-col items-center ${
            isActive('/today') ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          <CheckSquare className={`w-5 h-5 ${isActive('/today') ? 'fill-indigo-600' : ''}`} />
          <span className="text-[9px]">Today</span>
        </button>

        <button
          onClick={() => navigate('/medicine-list')}
          className={`flex flex-col items-center ${
            isActive('/medicine-list') ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          <Pill className={`w-5 h-5 ${isActive('/medicine-list') ? 'fill-indigo-600' : ''}`} />
          <span className="text-[9px]">Medicine</span>
        </button>

        <button
          onClick={() => navigate('/profile-page')}
          className={`flex flex-col items-center ${
            isActive('/profile-page') ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          <User className={`w-6 h-6 ${isActive('/profile-page') ? 'fill-indigo-600' : ''}`} />
          <span className="text-[9px]">Profile</span>
        </button>
      </div>
    </div>
  );
}
