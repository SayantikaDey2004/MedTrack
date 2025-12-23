import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Pill, Package, FileText, Power } from "lucide-react"
import { addMedicine } from "@/api/medicine"
import useAuth from "@/context/auth.context"
import { toast } from "sonner"

export default function AddMedicinePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    stock: "",
    notes: "",
    isActive: true
  })

  // const handleSubmit = () => {
  //   if (formData.name && formData.dosage && formData.stock) {
  //     setSuccess(true)
  //     setTimeout(() => {
  //       setSuccess(false)
  //       setFormData({ name: "", dosage: "", stock: "", notes: "" })
  //     }, 2000)
  //   }
  // }
  const handleSubmit=async ()=>{
    if(!formData.name || !formData.dosage || !formData.stock){
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!user?.uid) {
      console.error("User not authenticated");
      toast.error("User not authenticated");
      return;
    }

    try {
      // Format date
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const medicineData = {
        name: formData.name,
        dosage: formData.dosage,
        stock: Number(formData.stock),
        notes: formData.notes,
        isActive: formData.isActive,
        addedAt: formattedDate,
      };
      
      console.log(medicineData);
      await addMedicine(medicineData, user.uid);
      toast.success("Medicine added successfully!");
      setFormData({ name: "", dosage: "", stock: "", notes: "", isActive: true });
    } catch (error) {
      console.error("Error adding medicine:", error);
      toast.error("Failed to add medicine. Please try again.");
    }
  }

  const handleChange = (
  field: "name" | "dosage" | "stock" | "notes",
  value: string
) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}

 return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Decorative circles - hidden on mobile */}
      <div className="absolute top-10 left-10 h-48 w-48 md:h-64 md:w-64 rounded-full bg-purple-400/20 md:bg-purple-400/30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-56 w-56 md:h-80 md:w-80 rounded-full bg-pink-400/20 md:bg-pink-400/30 blur-3xl"></div>
      
      {/* Container */}
      <div className="relative min-h-screen p-4 md:p-6 lg:p-8 flex items-start md:items-center justify-center">
        <Card className="w-full max-w-2xl border-0 shadow-2xl my-4 md:my-0">
          {/* Header */}
          <CardHeader className="space-y-4 p-5 sm:p-6 md:p-8">
            <Button 
              variant="ghost"
              onClick={() => window.history.back()}//use reacat router
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-transparent transition-colors w-fit p-0 h-auto group -ml-1"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </Button>
            
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pb-1 leading-tight">
                Add Medicine
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600 mt-2">
                Enter your medication details
              </CardDescription>
            </div>
          </CardHeader>
        
          {/* Content */}
          <CardContent className="space-y-5 p-5 sm:p-6 md:p-8 pt-0">
            {/* Medicine Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Medicine Name
              </Label>
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Aspirin"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="pl-11 h-12 sm:h-14 text-base border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Dosage and Stock - Stack on mobile */}
            <div className="space-y-5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              {/* Dosage */}
              <div className="space-y-2">
                <Label htmlFor="dosage" className="text-sm font-semibold text-gray-700">
                  Dosage
                </Label>
                <Select value={formData.dosage} onValueChange={(value) => handleChange("dosage", value)}>
                  <SelectTrigger className="h-12 sm:h-14 text-base border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Select dosage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once daily</SelectItem>
                    <SelectItem value="twice">Twice daily</SelectItem>
                    <SelectItem value="thrice">Three times daily</SelectItem>
                    <SelectItem value="four">Four times daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Current Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-semibold text-gray-700">
                  Current Stock
                </Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    id="stock"
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    className="pl-11 h-12 sm:h-14 text-base border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Active Status Toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Status
              </Label>
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-300 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Power className={`h-5 w-5 ${
                    formData.isActive ? "text-green-600" : "text-gray-400"
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.isActive ? "Active" : "Inactive"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.isActive 
                        ? "Medicine is currently in use" 
                        : "Medicine is paused"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    formData.isActive ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                Notes <span className="text-gray-500 font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions..."
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="pl-11 pr-4 py-3 text-base border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 resize-none min-h-25"
                />
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSubmit}
              className="w-full h-12 sm:h-14 text-base sm:text-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
            >
              Save Medicine
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}