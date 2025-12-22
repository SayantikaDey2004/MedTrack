import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Pill,
  User,
  Bell,
  Plus,
  Calendar,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/* =========================
   HomePage Component
========================= */
function HomePage() {
  const quickStats = [
    { icon: Calendar, value: '100%', label: 'On Time' },
    { icon: Shield, value: 'Secure', label: 'Privacy' },
    { icon: TrendingUp, value: '95%', label: 'Success' },
  ];

  const highlights = [
    {
      icon: Bell,
      title: 'Never Forget',
      desc: 'Get timely reminders exactly when you need them',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Stay Stocked',
      desc: 'Know before you run out with smart alerts',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <>
      {/* Hero */}
      <div className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-3.5  pt-4 pb-10 rounded-b-3xl shadow-xl ">
        <h1 className="text-xl font-bold mb-1">
          Take Control of
          <br />
          Your Health
        </h1>
        <p className="text-purple-100 text-[10px] mb-3">
          Smart medication tracking that works for you
        </p>

        <div className="flex gap-1.5">
          {quickStats.map((stat, idx) => (
            <div key={idx} className="flex-1 bg-white/10 rounded-lg p-1.5 text-center">
              <stat.icon className="w-3.5 h-3.5 mx-auto mb-0.5" />
              <p className="text-[10px] font-bold">{stat.value}</p>
              <p className="text-[8px] text-purple-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="px-3 -mt-5 space-y-2">
        {highlights.map((h, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-2.5 flex gap-2.5">
              <div className={`w-10 h-10 bg-linear-to-br ${h.color} rounded-lg flex items-center justify-center`}>
                <h.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold">{h.title}</h3>
                <p className="text-[10px] text-gray-600">{h.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="px-3 mt-4 mb-3">
        <Card className="border-0 bg-linear-to-r from-emerald-500 to-teal-500 text-white">
          <CardContent className="p-3 text-center">
            <Sparkles className="w-7 h-7 mx-auto mb-1.5" />
            <h3 className="text-xs font-bold">Ready to Get Started?</h3>
            <Link to ="/addMedicine">
            <button className="w-full bg-white text-emerald-600 py-1.5 rounded-lg text-[11px] font-semibold mt-2">
              Add Your First Medicine
            </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 pb-16">
      <HomePage />

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/addMedicine')}
        className="fixed bottom-16 right-3 w-12 h-12 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex justify-around py-1.5">
          
          <button className="flex flex-col items-center text-indigo-600">
            <Home className="w-5 h-5 fill-indigo-600" />
            <span className="text-[9px]">Home</span>
          </button>

          <button
            onClick={() => navigate('/medicineList')}
            className="flex flex-col items-center text-gray-400"
          >
            <Pill className="w-5 h-5" />
            <span className="text-[9px]">Medicine</span>
          </button>

          <button
            onClick={() => navigate('/profile-page')}
            className="flex flex-col items-center text-gray-400"
          >
            <User className="w-6 h-6" />
            <span className="text-[9px]">Profile</span>
          </button>

        </div>
      </div>
    </div>
  );
}
