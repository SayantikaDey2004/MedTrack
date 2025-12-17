import React, { useState } from 'react';
import { Home, Pill, User, Bell, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MedTrackHomepage() {
  const [activeTab, setActiveTab] = useState('home');

  const features = [
    {
      icon: Bell,
      title: 'Smart Reminders',
      desc: 'Never miss a dose with customizable notifications',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: AlertCircle,
      title: 'Low Stock Alerts',
      desc: 'Get notified before your medicine runs out',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const benefits = [
    'Completely free',
    'Your data stays private and secure on your device',
    'Simple and easy to use for all ages'
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
        <Card className="border-t-4 border-t-purple-500 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span>📱</span>
              <span>About This App</span>
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              This is your personal medication management assistant that helps you remember to take your medicines on time and keeps track of your medicine inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">How It Works:</h3>
              <ol className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 bg-purple-600 text-white shrink-0">
                    1
                  </Badge>
                  <span className="flex-1">Add your medicines with dosage, frequency, and current stock</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 bg-purple-600 text-white shrink-0">
                    2
                  </Badge>
                  <span className="flex-1">Receive timely notifications when it's time to take your dose</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 bg-purple-600 text-white shrink-0">
                    3
                  </Badge>
                  <span className="flex-1">Get low stock alerts before you run out</span>
                </li>
              </ol>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Perfect for managing chronic conditions, post-surgery recovery, or simply keeping track of daily vitamins and supplements!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Core Features */}
      <div className="px-4 mt-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>Core Features</span>
        </h2>
        <div className="space-y-3">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-0 shadow-lg active:shadow-xl active:scale-[0.98] transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-r ${feature.gradient} w-14 h-14 rounded-2xl flex items-center justify-center shrink-0`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1 text-base">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="px-4 mt-6 mb-4 max-w-md mx-auto">
        <Card className="border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span>🏆</span>
              <span>Why Choose Us?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed flex-1">{benefit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center max-w-md mx-auto px-4 py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-4 transition-all min-w-[60px] rounded-lg hover:bg-gray-50 ${
              activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-indigo-600' : ''}`} />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('medicine')}
            className={`flex flex-col items-center gap-1 py-2 px-4 transition-all min-w-[60px] rounded-lg hover:bg-gray-50 ${
              activeTab === 'medicine' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Pill className={`w-6 h-6 ${activeTab === 'medicine' ? 'fill-indigo-600' : ''}`} />
            <span className="text-xs font-medium">Medicine</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-2 px-4 transition-all min-w-[60px] rounded-lg hover:bg-gray-50 ${
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