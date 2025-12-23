import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
  Bell,
  Pill,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getMedicineStats } from '@/api/medicine';
import useAuth from '@/context/auth.context';
import LoadingSpinner from '@/components/ui/loading';

/* =========================
   HomePage Component
========================= */
export default function HomePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medicineStats, setMedicineStats] = useState({
    total: 0,
    lowStock: 0,
  });

  // Fetch medicine stats from Firebase
  useEffect(() => {
    const fetchStats = async () => {
      if (user?.uid) {
        try {
          setLoading(true);
          const stats = await getMedicineStats(user.uid);
          setMedicineStats(stats);
        } catch (error) {
          console.error('Error fetching medicine stats:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.uid]);

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

  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Hero */}
      <div className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-3.5  pt-4 pb-10 rounded-b-3xl shadow-xl ">{" "}
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

      {/* Medicine Analytics */}
      <div className="px-3 -mt-5 mb-3">
        <h2 className="text-sm font-semibold mb-2 text-gray-700">Medicine Analytics</h2>
        <div className="grid grid-cols-2 gap-2">
          <Card className="border shadow-sm">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <Pill className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-[10px] text-muted-foreground">Total Medicines</p>
              </div>
              <p className="text-xl font-bold text-blue-600">{medicineStats.total}</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-orange-100 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <p className="text-[10px] text-muted-foreground">Low Stock</p>
              </div>
              <p className="text-xl font-bold text-orange-600">{medicineStats.lowStock}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Highlights */}
      <div className="px-3 space-y-2">
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

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/addMedicine')}
        className="fixed bottom-16 right-3 w-12 h-12 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>
    </>
  );
}
