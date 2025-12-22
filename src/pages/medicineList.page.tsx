import React, { useState, useEffect, useMemo } from 'react';
import { Edit2, Trash2, Search, Pill, Calendar, Package, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

// Type Definitions
interface Medicine {
  id: number;
  name: string;
  dosage: string;
  stock: number;
  notes?: string;
  addedAt: string;
}

type FilterType = 'all' | 'low-stock' | 'adequate-stock';

interface MedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicine: Omit<Medicine, 'id' | 'addedAt'>) => void;
  editingMedicine: Medicine | null;
}

// Add/Edit Medicine Modal Component
const MedicineModal: React.FC<MedicineModalProps> = ({ isOpen, onClose, onSave, editingMedicine }) => {
  const [formData, setFormData] = useState<Omit<Medicine, 'id' | 'addedAt'>>({
    name: '',
    dosage: '',
    stock: 0,
    notes: ''
  });

  React.useEffect(() => {
    if (editingMedicine) {
      setFormData({
        name: editingMedicine.name,
        dosage: editingMedicine.dosage,
        stock: editingMedicine.stock,
        notes: editingMedicine.notes || ''
      });
    } else {
      setFormData({
        name: '',
        dosage: '',
        stock: 0,
        notes: ''
      });
    }
  }, [editingMedicine, isOpen]);

  const handleSubmit = () => {
    if (formData.name && formData.dosage && formData.stock !== undefined && formData.stock >= 0) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Medicine Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Aspirin"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage" className="text-base">Dosage</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="e.g., 100mg"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock" className="text-base">Stock (pills)</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              placeholder="e.g., 25"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
              rows={3}
              className="text-base"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full h-12 text-base">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full h-12 text-base">
            {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// View Medicine Dialog
const ViewMedicineDialog: React.FC<{ medicine: Medicine | null; onClose: () => void }> = ({ medicine, onClose }) => {
  if (!medicine) return null;

  return (
    <Dialog open={!!medicine} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            {medicine.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Dosage</p>
              <p className="text-base sm:text-lg font-semibold">{medicine.dosage}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Stock</p>
              <Badge variant={medicine.stock <= 10 ? 'destructive' : 'default'} className="text-sm sm:text-base px-3 py-1">
                {medicine.stock} pills
              </Badge>
            </div>
          </div>
          {medicine.notes && (
            <div className="space-y-2 pt-3 border-t">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm sm:text-base">{medicine.notes}</p>
            </div>
          )}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-sm text-muted-foreground">Registered</p>
            <p className="text-sm sm:text-base font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {medicine.addedAt}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full h-12 text-base">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main App Component
const MedicineTracker: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: 1,
      name: 'Aspirin',
      dosage: '100mg',
      stock: 25,
      notes: 'Take with food',
      addedAt: '2025-08-08 11:04:01'
    },
    {
      id: 2,
      name: 'Vitamin D',
      dosage: '1000 IU',
      stock: 8,
      addedAt: '2025-08-08 10:30:15'
    },
    {
      id: 3,
      name: 'Metformin',
      dosage: '500mg',
      stock: 45,
      notes: 'For diabetes management',
      addedAt: '2025-08-07 14:20:30'
    },
    {
      id: 4,
      name: 'Lisinopril',
      dosage: '10mg',
      stock: 3,
      notes: 'Blood pressure medication - refill soon',
      addedAt: '2025-08-06 09:15:22'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredMedicines = useMemo(() => {
    let result = [...medicines];
    
    // Search filter
    const q = debouncedSearch.toLowerCase();
    if (q) {
      result = result.filter((med) =>
        med.name.toLowerCase().includes(q) ||
        med.dosage.toLowerCase().includes(q) ||
        (med.notes && med.notes.toLowerCase().includes(q))
      );
    }

    // Stock filter
    if (filterType === 'low-stock') {
      result = result.filter(med => med.stock <= 10);
    } else if (filterType === 'adequate-stock') {
      result = result.filter(med => med.stock > 10);
    }

    return result;
  }, [medicines, debouncedSearch, filterType]);

  const handleAddMedicine = (medicineData: Omit<Medicine, 'id' | 'addedAt'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    if (editingMedicine) {
      setMedicines(medicines.map(med => 
        med.id === editingMedicine.id ? { ...medicineData, id: med.id, addedAt: med.addedAt } : med
      ));
      setEditingMedicine(null);
    } else {
      setMedicines([...medicines, { ...medicineData, id: Date.now(), addedAt: formattedDate }]);
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines((prev) => prev.filter(med => med.id !== id));
    }
  };

  // Statistics
  const stats = {
    total: medicines.length,
    lowStock: medicines.filter(m => m.stock <= 10).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto">
        {/* Header - Mobile First */}
        <div className="sticky top-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-10 px-4 pt-3 pb-2 space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Medicine Tracker
            </h1>
            <p className="text-xs text-muted-foreground">Manage your medications and track inventory</p>
          </div>
          
          {/* Stats Cards - Mobile Optimized */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="border">
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Total Medicines</p>
                <p className="text-xl font-bold text-blue-600">{stats.total}</p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Low Stock</p>
                <p className="text-xl font-bold text-orange-600">{stats.lowStock}</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter - Mobile First */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search medicines..."
                className="pl-9 h-10 text-sm"
              />
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
              <SelectTrigger className="h-10 text-sm">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5" />
                  <SelectValue placeholder="Filter by stock" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Medicines</SelectItem>
                <SelectItem value="low-stock">Low Stock Only</SelectItem>
                <SelectItem value="adequate-stock">Adequate Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Medicine List - Mobile Optimized */}
        <div className="px-4 pb-20">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground">
              {filteredMedicines.length} {filteredMedicines.length === 1 ? 'Medicine' : 'Medicines'}
            </h2>
          </div>

          {filteredMedicines.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-50 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">No medicines found</p>
                <p className="text-xs text-muted-foreground">Try adjusting your search or filter</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {filteredMedicines.map((medicine) => (
                <Card 
                  key={medicine.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3">
                    {/* Medicine Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <Pill className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-0.5 break-words leading-tight">
                            {medicine.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-1.5">{medicine.dosage}</p>
                          <Badge 
                            variant={medicine.stock <= 10 ? 'destructive' : medicine.stock <= 20 ? 'secondary' : 'default'}
                            className="text-xs font-medium px-2 py-0.5"
                          >
                            {medicine.stock} pills
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => setViewingMedicine(medicine)} className="text-sm">
                            <Package className="w-3.5 h-3.5 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(medicine)} className="text-sm">
                            <Edit2 className="w-3.5 h-3.5 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(medicine.id)}
                            className="text-sm text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Notes */}
                    {medicine.notes && (
                      <div className="bg-muted/50 rounded-md p-2 mb-2">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {medicine.notes}
                        </p>
                      </div>
                    )}

                    {/* Footer with Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1.5 border-t">
                      <Calendar className="w-3 h-3" />
                      <span>{medicine.addedAt.split(' ')[0]}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <MedicineModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMedicine(null);
        }}
        onSave={handleAddMedicine}
        editingMedicine={editingMedicine}
      />

      <ViewMedicineDialog
        medicine={viewingMedicine}
        onClose={() => setViewingMedicine(null)}
      />
    </div>
  );
};

export default MedicineTracker;