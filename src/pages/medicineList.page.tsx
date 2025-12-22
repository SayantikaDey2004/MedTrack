import React, { useState, useEffect, useCallback } from 'react';
import { Search, Package, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MedicineCard } from '@/components/medicine-card';
import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from '@/api/medicine';
import type { Medicine, MedicineFilters } from '@/api/medicine';
import useAuth from '@/context/auth.context';
import { DocumentSnapshot } from 'firebase/firestore';
import { Pill, Calendar } from 'lucide-react';

// Type Definitions
type FilterType = 'all' | 'low-stock' | 'adequate-stock';
type SortType = 'name' | 'stock' | 'date';

interface MedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicine: Omit<Medicine, 'id'>) => Promise<void>;
  editingMedicine: Medicine | null;
}

// Add/Edit Medicine Modal Component
const MedicineModal: React.FC<MedicineModalProps> = ({ isOpen, onClose, onSave, editingMedicine }) => {
  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    name: '',
    dosage: '',
    stock: 0,
    notes: '',
    addedAt: '',
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (editingMedicine) {
      setFormData({
        name: editingMedicine.name,
        dosage: editingMedicine.dosage,
        stock: editingMedicine.stock,
        notes: editingMedicine.notes || '',
        addedAt: editingMedicine.addedAt,
      });
    } else {
      setFormData({
        name: '',
        dosage: '',
        stock: 0,
        notes: '',
        addedAt: '',
      });
    }
  }, [editingMedicine, isOpen]);

  const handleSubmit = async () => {
    if (formData.name && formData.dosage && formData.stock !== undefined && formData.stock >= 0) {
      setLoading(true);
      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        console.error('Error saving medicine:', error);
      } finally {
        setLoading(false);
      }
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
          <Button variant="outline" onClick={onClose} className="w-full h-12 text-base" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full h-12 text-base" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              editingMedicine ? 'Update Medicine' : 'Add Medicine'
            )}
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
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pageHistory, setPageHistory] = useState<(DocumentSnapshot | null)[]>([null]);

  const pageSize = 10;

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch medicines
  const fetchMedicines = useCallback(async (pageDoc: DocumentSnapshot | null = null, resetPage = false) => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const filters: MedicineFilters = {
        search: debouncedSearch,
        stockFilter: filterType,
        sortBy,
        sortOrder: 'desc',
        pageSize,
        lastDoc: pageDoc || undefined,
      };

      const result = await getMedicines(user.uid, filters);
      setMedicines(result.data);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);

      if (resetPage) {
        setPage(1);
        setPageHistory([null]);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, debouncedSearch, filterType, sortBy, pageSize]);

  // Load medicines on mount and when filters change
  useEffect(() => {
    fetchMedicines(null, true);
  }, [fetchMedicines]);

  const handleAddMedicine = async (medicineData: Omit<Medicine, 'id'>) => {
    if (!user?.uid) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    if (editingMedicine) {
      await updateMedicine(editingMedicine.id, medicineData);
      setEditingMedicine(null);
    } else {
      await addMedicine({ ...medicineData, addedAt: formattedDate }, user.uid);
    }
    
    await fetchMedicines(null, true);
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await deleteMedicine(id);
        await fetchMedicines(pageHistory[page - 1]);
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const handleNextPage = () => {
    if (hasMore && lastDoc) {
      setPageHistory([...pageHistory, lastDoc]);
      setPage(page + 1);
      fetchMedicines(lastDoc);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      const newPageHistory = pageHistory.slice(0, -1);
      setPageHistory(newPageHistory);
      setPage(newPage);
      fetchMedicines(newPageHistory[newPage - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto">
        {/* Header - Mobile First */}
        <div className="sticky top-0 bg-linear-to-br from-blue-50 via-white to-purple-50 z-10 px-4 pt-3 pb-2 space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Medicine Tracker
            </h1>
            <p className="text-xs text-muted-foreground">Manage your medications and track inventory</p>
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
            <div className="grid grid-cols-2 gap-2">
              <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                <SelectTrigger className="h-10 text-sm">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5" />
                    <SelectValue placeholder="Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Medicines</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="adequate-stock">Adequate Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortType)}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="stock">Stock Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Medicine List - Mobile Optimized */}
        <div className="px-4 pb-24">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground">
              {medicines.length} {medicines.length === 1 ? 'Medicine' : 'Medicines'}
              {page > 1 && ` (Page ${page})`}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : medicines.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-50 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">No medicines found</p>
                <p className="text-xs text-muted-foreground">Try adjusting your search or filter</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-2.5 mb-4">
                {medicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onView={setViewingMedicine}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {(page > 1 || hasMore) && (
                <div className="flex items-center justify-center gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={page === 1 || loading}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-3">
                    Page {page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!hasMore || loading}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
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