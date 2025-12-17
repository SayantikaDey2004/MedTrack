import React, { useState } from 'react';
import { Home, Pill, User, Bell, AlertCircle, CheckCircle } from 'lucide-react';

export default function MedTrackHomepage() {
  const [activeTab, setActiveTab] = useState('home');

  const features = [
    {
      icon: Bell,
      title: 'Smart Reminders',
      desc: 'Never miss a dose with customizable notifications',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: AlertCircle,
      title: 'Low Stock Alerts',
      desc: 'Get notified before your medicine runs out',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 pt-8 pb-16 rounded-b-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
              {/* Your logo will go here */}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Never Miss<br />Your Medicine Again
          </h1>
          <p className="text-purple-100 text-base sm:text-lg mb-4 leading-relaxed">
            Your personal medication reminder and inventory tracker - helping you stay healthy and organized
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="px-4 -mt-10 relative z-20 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-5 shadow-2xl border-t-4 border-purple-500">
          <h2 className="text-xl font-bold text-gray-800 mb-3">📱 About This App</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            This is your personal medication management assistant that helps you remember to take your medicines on time and keeps track of your medicine inventory.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-3">
            <h3 className="font-bold text-gray-800 mb-2 text-sm">How It Works:</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold min-w-[20px]">1.</span>
                <span>Add your medicines with dosage, frequency, and current stock</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold min-w-[20px]">2.</span>
                <span>Receive timely notifications when it's time to take your dose</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold min-w-[20px]">3.</span>
                <span>Get low stock alerts before you run out</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Perfect for managing chronic conditions, post-surgery recovery, or simply keeping track of daily vitamins and supplements!
          </p>
        </div>
      </div>

      {/* Core Features */}
      <div className="px-4 mt-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Core Features</h2>
        <div className="space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-lg active:shadow-xl active:scale-[0.98] transition-all">
              <div className="flex items-start gap-4">
                <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1 text-base">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="px-4 mt-6 mb-4 max-w-md mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 shadow-xl text-white">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span>🏆</span>
            <span>Why Choose Us?</span>
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-white flex-1">Completely free</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-white flex-1">Your data stays private and secure on your device</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-white flex-1">Simple and easy to use for all ages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-area-inset-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto px-4 py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-4 transition-all min-w-[60px] ${
              activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-indigo-600' : ''}`} />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('medicine')}
            className={`flex flex-col items-center gap-1 py-2 px-4 transition-all min-w-[60px] ${
              activeTab === 'medicine' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Pill className={`w-6 h-6 ${activeTab === 'medicine' ? 'fill-indigo-600' : ''}`} />
            <span className="text-xs font-medium">Medicine</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-2 px-4 transition-all min-w-[60px] ${
              activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <User className={`w-6 h-6 ${activeTab === 'profile' ? 'fill-indigo-600' : ''}`} />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}