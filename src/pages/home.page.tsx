import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Shield,
  Sparkles,
  TrendingUp,
  Pill,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import useAuth from '@/context/auth.context';
import LoadingSpinner from '@/components/ui/loading';
import { getTodayConsumption} from '@/api/dailyConsumption';
import type { DailyConsumption } from '@/api/dailyConsumption';
import { getMedicineStats } from '@/api/medicine';



/* =========================
   HomePage Component
========================= */
export default function HomePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [, setTodayConsumption] =
  useState<DailyConsumption | null>(null);

  const [medicineStats, setMedicineStats] = useState({
    activeMedicines: 0,
    totalDoses: 0,
    completedDoses: 0,
    remainingDoses: 0,
    lowStock: 0,
  });

  // Fetch today's consumption data from Firebase
  useEffect(() => {
    const fetchConsumption = async () => {
      if (user?.uid) {
        try {
          setLoading(true);
          const [consumption, stats] = await Promise.all([
            getTodayConsumption(user.uid),
            getMedicineStats(user.uid)
          ]);
          setTodayConsumption(consumption);
          
          // Calculate stats
          const medicineIds = Object.keys(consumption.medicines);
          const activeMedicines = medicineIds.length;
          
          let totalDoses = 0;
          let completedDoses = 0;
          
          medicineIds.forEach((medicineId) => {
            const medicine = consumption.medicines[medicineId];
            totalDoses += medicine.consumed.length;
            completedDoses += medicine.consumed.filter(Boolean).length;
          });
          
          setMedicineStats({
            activeMedicines,
            totalDoses,
            completedDoses,
            remainingDoses: totalDoses - completedDoses,
            lowStock: stats.lowStock,
          });
        } catch (error) {
          console.error('Error fetching consumption data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchConsumption();
  }, [user?.uid]);

  const quickStats = [
    { icon: Calendar, value: '100%', label: 'On Time' },
    { icon: Shield, value: 'Secure', label: 'Privacy' },
    { icon: TrendingUp, value: '95%', label: 'Success' },
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

      {/* Today's Overview */}
      <div className="px-3 -mt-5 mb-3">
        <div className="grid grid-cols-2 gap-2">
          <Card className="border shadow-sm">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <Pill className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-[10px] text-muted-foreground">Active Medicines</p>
              </div>
              <p className="text-xl font-bold text-blue-600">{medicineStats.activeMedicines}</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-orange-100 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <p className="text-[10px] text-muted-foreground">Remaining Today</p>
              </div>
              <p className="text-xl font-bold text-orange-600">{medicineStats.remainingDoses}</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-green-100 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                </div>
                <p className="text-[10px] text-muted-foreground">Done</p>
              </div>
              <p className="text-xl font-bold text-green-600">{medicineStats.completedDoses}</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-red-100 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <p className="text-[10px] text-muted-foreground">Low Stocks</p>
              </div>
              <p className="text-xl font-bold text-red-600">{medicineStats.lowStock}</p>
            </CardContent>
          </Card>
        </div>
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
