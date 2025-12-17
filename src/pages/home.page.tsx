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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-16">
      {/* Hero Section - Mobile First */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 pt-6 pb-12 rounded-b-3xl shadow-xl relative overflow-hidden">
        {/* Decorative circles - smaller for mobile */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full -ml-14 -mb-14"></div>
        
        <div className="relative z-10">
          {/* Logo - Mobile optimized */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
              {/* Your logo will go here */}
            </div>
          </div>
          
          {/* Heading - Mobile first sizing */}
          <h1 className="text-2xl font-bold mb-2 leading-tight">
            Never Miss<br />Your Medicine Again
          </h1>
          
          {/* Subheading - Compact for mobile */}
          <p className="text-purple-100 text-sm mb-3 leading-relaxed">
            Your personal medication reminder and inventory tracker - helping you stay healthy and organized
          </p>
        </div>
      </div>

      {/* About Section - Mobile First */}
      <div className="px-4 -mt-8 relative z-20">
        <Card className="border-t-4 border-t-purple-500 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">📱</span>
              <span>About This App</span>
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed pt-1">
              This is your personal medication management assistant that helps you remember to take your medicines on time and keeps track of your medicine inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {/* How it works - Compact mobile layout */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
              <h3 className="font-bold text-gray-800 mb-2 text-xs">How It Works:</h3>
              <ol className="space-y-2 text-gray-600 text-xs">
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="w-5 h-5 rounded-full flex items-center justify-center p-0 bg-purple-600 text-white shrink-0 text-[10px]">
                    1
                  </Badge>
                  <span className="flex-1 leading-relaxed">Add your medicines with dosage, frequency, and current stock</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="w-5 h-5 rounded-full flex items-center justify-center p-0 bg-purple-600 text-white shrink-0 text-[10px]">
                    2
                  </Badge>
                  <span className="flex-1 leading-relaxed">Receive timely notifications when it's time to take your dose</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="w-5 h-5 rounded-full flex items-center justify-center p-0 bg-purple-600 text-white shrink-0 text-[10px]">
                    3
                  </Badge>
                  <span className="flex-1 leading-relaxed">Get low stock alerts before you run out</span>
                </li>
              </ol>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Perfect for managing chronic conditions, post-surgery recovery, or simply keeping track of daily vitamins and supplements!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Core Features - Mobile Optimized */}
      <div className="px-4 mt-5">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <span>Core Features</span>
        </h2>
        <div className="space-y-3">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-0 shadow-md active:shadow-lg active:scale-[0.98] transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon - Smaller for mobile */}
                  <div className={`bg-gradient-to-r ${feature.gradient} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1 text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Choose Us - Mobile Optimized */}
      <div className="px-4 mt-5 mb-3">
        <Card className="border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <span>Why Choose Us?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed flex-1">{benefit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation Bar - Mobile Optimized */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center px-2 py-1.5">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-all rounded-lg active:bg-gray-100 ${
              activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'fill-indigo-600' : ''}`} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('medicine')}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-all rounded-lg active:bg-gray-100 ${
              activeTab === 'medicine' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Pill className={`w-5 h-5 ${activeTab === 'medicine' ? 'fill-indigo-600' : ''}`} />
            <span className="text-[10px] font-medium">Medicine</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-all rounded-lg active:bg-gray-100 ${
              activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'fill-indigo-600' : ''}`} />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}