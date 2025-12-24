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
import NotificationBell from '@/components/notification-bell';

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
      <div className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-8 sm:pb-10 md:pb-12 rounded-b-2xl sm:rounded-b-3xl shadow-xl">
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
              Take Control of
              <br />
              Your Health
            </h1>
          </div>
          <NotificationBell />
        </div>
        <p className="text-purple-100 text-xs sm:text-sm mb-3 sm:mb-4">
          Smart medication tracking that works for you
        </p>

        <div className="flex gap-1.5 sm:gap-2 md:gap-3">
          {quickStats.map((stat, idx) => (
            <div key={idx} className="flex-1 bg-white/10 rounded-lg p-1.5 sm:p-2 md:p-3 text-center">
              <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mx-auto mb-0.5 sm:mb-1" />
              <p className="text-xs sm:text-sm md:text-base font-bold">{stat.value}</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-purple-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Overview */}
      <div className="px-3 sm:px-4 md:px-6 -mt-5 sm:-mt-6 mb-3 sm:mb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <Card className="border shadow-sm">
            <CardContent className="p-2 sm:p-2.5 md:p-3">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <div className="p-1 sm:p-1.5 bg-blue-100 rounded-md">
                  <Pill className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-blue-600" />
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Active Medicines</p>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{medicineStats.activeMedicines}</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-2 sm:p-2.5 md:p-3">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <div className="p-1 sm:p-1.5 bg-orange-100 rounded-md">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-orange-600" />
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Remaining Today</p>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600">{medicineStats.remainingDoses}</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-2 sm:p-2.5 md:p-3">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <div className="p-1 sm:p-1.5 bg-green-100 rounded-md">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-green-600" />
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Done</p>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{medicineStats.completedDoses}</p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-2 sm:p-2.5 md:p-3">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <div className="p-1 sm:p-1.5 bg-red-100 rounded-md">
                  <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-red-600" />
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Low Stocks</p>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">{medicineStats.lowStock}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="px-3 sm:px-4 md:px-6 mt-4 sm:mt-5 mb-3 sm:mb-4">
        <Card className="border-0 bg-linear-to-r from-emerald-500 to-teal-500 text-white">
          <CardContent className="p-3 sm:p-4 md:p-5 text-center">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mx-auto mb-1.5 sm:mb-2" />
            <h3 className="text-xs sm:text-sm md:text-base font-bold">Ready to Get Started?</h3>
            <Link to ="/addMedicine">
            <button className="w-full bg-white text-emerald-600 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold mt-2">
              Add Your First Medicine
            </button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/addMedicine')}
        className="fixed bottom-16 sm:bottom-20 right-3 sm:right-4 md:right-6 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-40 transition-all"
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
    </>
  );
}
