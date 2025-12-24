import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calendar, CheckCircle2, Pill } from "lucide-react";
import { getTodayConsumption, updateConsumption, getTodayDate } from "@/api/dailyConsumption";
import type { DailyConsumption } from "@/api/dailyConsumption";
import useAuth from "@/context/auth.context";
import { toast } from "sonner";
import { useNavigate,useLocation } from "react-router";
import LoadingSpinner from "@/components/ui/loading";

export default function TodayMedicinesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [consumption, setConsumption] = useState<DailyConsumption | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadTodayConsumption();
  }, [user,location.key]);

  const loadTodayConsumption = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const data = await getTodayConsumption(user.uid);
      console.log("Today's consumption data:", data);
      setConsumption(data);
    } catch (error) {
      console.error("Error loading consumption:", error);
      toast.error("Failed to load today's medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (medicineId: string, doseIndex: number, checked: boolean) => {
    if (!user?.uid || !consumption) return;

    try {
      setUpdating(true);
      await updateConsumption(user.uid, medicineId, doseIndex, checked);
      
      // Update local state
      setConsumption(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          medicines: {
            ...prev.medicines,
            [medicineId]: {
              ...prev.medicines[medicineId],
              consumed: prev.medicines[medicineId].consumed.map((val, idx) =>
                idx === doseIndex ? checked : val
              ),
            },
          },
        };
      });

      toast.success(checked ? "Dose marked as taken" : "Dose marked as not taken");
    } catch (error) {
      console.error("Error updating consumption:", error);
      toast.error("Failed to update consumption");
    } finally {
      setUpdating(false);
    }
  };

  const getDoseLabel = (dosage: string, index: number): string => {
    if (dosage === "once") return "Daily dose";
    const labels = ["Morning", "Afternoon", "Evening", "Night"];
    return labels[index] || `Dose ${index + 1}`;
  };

  const getTotalDoses = () => {
    if (!consumption) return { total: 0, taken: 0 };
    
    let total = 0;
    let taken = 0;
    
    Object.values(consumption.medicines).forEach(med => {
      total += med.consumed.length;
      taken += med.consumed.filter(c => c).length;
    });
    
    return { total, taken };
  };

  const { total, taken } = getTotalDoses();
  const progress = total > 0 ? Math.round((taken / total) * 100) : 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-500 to-pink-500 relative overflow-hidden pb-20">
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 h-48 w-48 md:h-64 md:w-64 rounded-full bg-purple-400/20 md:bg-purple-400/30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-56 w-56 md:h-80 md:w-80 rounded-full bg-pink-400/20 md:bg-pink-400/30 blur-3xl"></div>

      {/* Container */}
      <div className="relative min-h-screen p-4 md:p-6 lg:p-8">
        <Card className="w-full max-w-3xl mx-auto border-0 shadow-2xl">
          {/* Header */}
          <CardHeader className="space-y-4 p-5 sm:p-6 md:p-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-transparent transition-colors w-fit p-0 h-auto group -ml-1"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </Button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pb-1 leading-tight">
                  Today's Medicines
                </CardTitle>
              </div>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                {getTodayDate()} • Track your daily medication
              </CardDescription>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-purple-600">{taken}/{total} doses</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div
                  className="bg-linear-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{progress}% completed</p>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-4 p-5 sm:p-6 md:p-8 pt-0">
            {consumption && Object.keys(consumption.medicines).length > 0 ? (
              Object.entries(consumption.medicines).map(([medicineId, medicine]) => (
                <Card key={medicineId} className="border-2 hover:border-purple-300 transition-colors">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-purple-100 rounded-full p-2">
                        <Pill className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{medicine.medicineName}</h3>
                        <p className="text-sm text-gray-500 capitalize">{medicine.dosage} daily</p>
                      </div>
                      {medicine.consumed.every(c => c) && (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      )}
                    </div>

                    <div className="space-y-3">
                      {medicine.consumed.map((isConsumed, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                            isConsumed
                              ? "bg-green-50 border-green-300"
                              : "bg-gray-50 border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <Checkbox
                            id={`${medicineId}-${index}`}
                            checked={isConsumed}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(medicineId, index, checked as boolean)
                            }
                            disabled={updating}
                            className="h-5 w-5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                          <label
                            htmlFor={`${medicineId}-${index}`}
                            className={`flex-1 text-sm font-medium cursor-pointer ${
                              isConsumed ? "text-green-700 line-through" : "text-gray-700"
                            }`}
                          >
                            {getDoseLabel(medicine.dosage, index)}
                          </label>
                          {isConsumed && (
                            <span className="text-xs text-green-600 font-semibold">✓ Taken</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Pill className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No active medicines</h3>
                <p className="text-sm text-gray-500 mb-4">Add medicines to start tracking</p>
                <Button
                  onClick={() => navigate('/addMedicine')}
                  className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Add Medicine
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
