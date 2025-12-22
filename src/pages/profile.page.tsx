import  { useState } from 'react';
import { Bell, LogOut, ChevronRight, Mail } from 'lucide-react';

import useAuth from '@/context/auth.context';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';

export default function ProfilePage() {
  const {user} = useAuth();
  const {displayName, email} = user || {};
  const [notifications, setNotifications] = useState(true);

console.log(user)

 const getInititals = (name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
    return initials;
  }

const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Gradient */}
      <div className="bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 pt-12 pb-32 px-6">
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
      </div>

      {/* Profile Card - Overlapping Header */}
      <div className="px-6 -mt-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-linear-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInititals(displayName || "User Name")}
              </div>
              {/* <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border-2 border-purple-500">
                <Camera className="w-4 h-4 text-purple-600" />
              </button> */}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{displayName || "User Name"}</h2>
              <p className="text-gray-500 text-sm">{email}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 py-3 border-b border-gray-100">
              <Mail className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-gray-900">{email}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>                                           
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-gray-900 font-medium">Notifications</div>
                  <div className="text-sm text-gray-500">Enable push notifications</div>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-linear-to-r from-purple-600 to-pink-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>                                           
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="w-full bg-white rounded-2xl shadow-md p-6 mb-6 flex items-center justify-center gap-3 text-red-500 font-semibold hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}