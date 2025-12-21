import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Pill, Package, FileText, CheckCircle2 } from "lucide-react"

export default function AddMedicinePage() {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    stock: "",
    notes: ""
  })
  const [success, setSuccess] = useState(false)

  const handleSubmit = () => {
    if (formData.name && formData.dosage && formData.stock) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setFormData({ name: "", dosage: "", stock: "", notes: "" })
      }, 2000)
    }
  }

  const handleChange = (
  field: "name" | "dosage" | "stock" | "notes",
  value: string
) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}

 return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 relative overflow-hidden">
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
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-transparent transition-colors w-fit p-0 h-auto group -ml-1"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </Button>
            
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pb-1 leading-tight">
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
                    <SelectItem value="weekly">Weekly</SelectItem>
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
                  className="pl-11 pr-4 py-3 text-base border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 resize-none min-h-[100px]"
                />
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <Alert className="bg-green-50 border-green-200 py-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <AlertDescription className="text-sm sm:text-base text-green-800 font-medium">
                    Medicine added successfully!
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSubmit}
              className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
            >
              Save Medicine
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}