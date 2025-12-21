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
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8 overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
      <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-purple-400/30 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-pink-400/30 blur-3xl"></div>
      
      <Card className="relative w-full max-w-2xl border-0 shadow-2xl">
        <CardHeader className="space-y-3 pb-6">
          <Button 
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors w-fit p-0 h-auto group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to home</span>
          </Button>
          
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pb-1 leading-tight">
              Add Medicine
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Enter your medication details below
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Medicine Name
              </Label>
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Aspirin"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage" className="text-sm font-medium text-gray-700">
                  Dosage
                </Label>
                <Select value={formData.dosage} onValueChange={(value) => handleChange("dosage", value)}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
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

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
                  Current Stock
                </Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="stock"
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes (Optional)
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions or notes..."
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="pl-10 pr-4 py-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 resize-none min-h-[80px]"
                />
              </div>
            </div>

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-sm text-green-800 font-medium ml-2">
                  Medicine added successfully!
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}