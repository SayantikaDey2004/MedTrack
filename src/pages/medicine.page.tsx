import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, ChevronDown, ChevronUp } from 'lucide-react';

// Type Definitions
interface Medicine {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  stock: string;
  addedAt: string;
}

type SortField = 'name' | 'dosage' | 'frequency' | 'time' | 'stock' | 'addedAt';
type SortDirection = 'asc' | 'desc';

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
    frequency: 'Daily',
    time: '09:00',
    stock: ''
  });

  React.useEffect(() => {
    if (editingMedicine) {
      setFormData({
        name: editingMedicine.name,
        dosage: editingMedicine.dosage,
        frequency: editingMedicine.frequency,
        time: editingMedicine.time,
        stock: editingMedicine.stock
      });
    } else {
      setFormData({
        name: '',
        dosage: '',
        frequency: 'Daily',
        time: '09:00',
        stock: ''
      });
    }
  }, [editingMedicine, isOpen]);

  const handleSubmit = () => {
    if (formData.name && formData.dosage && formData.time && formData.stock) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingMedicine ? 'Edit Medicine' : 'Add Medicine'}
        </h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicine Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Aspirin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosage
            </label>
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 100mg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option>Daily</option>
              <option>Twice Daily</option>
              <option>Three Times Daily</option>
              <option>Weekly</option>
              <option>As Needed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock (pills)
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 25"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {editingMedicine ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const MedicineTracker: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: 1,
      name: 'Aspirin',
      dosage: '100mg',
      frequency: 'Daily',
      time: '09:00',
      stock: '25',
      addedAt: '2025-08-08 11:04:01'
    },
    {
      id: 2,
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Daily',
      time: '09:00',
      stock: '15',
      addedAt: '2025-08-08 10:30:15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);
  const [sortField, setSortField] = useState<SortField>('addedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedMedicines = [...medicines].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const filteredMedicines = sortedMedicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.dosage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.frequency.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      setMedicines(medicines.filter(med => med.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingMedicine(null);
    setIsModalOpen(true);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown size={16} className="text-gray-400" />;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search (name/Dosage/Frequency)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Floating Add Button */}
      <button
        onClick={openAddModal}
        className="fixed right-8 bottom-8 w-14 h-14 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg flex items-center justify-center z-40 hover:scale-110"
        title="Add Medicine"
      >
        <Plus size={24} />
      </button>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-gray-900">
                    MEDICINE NAME <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button onClick={() => handleSort('dosage')} className="flex items-center gap-1 hover:text-gray-900">
                    DOSAGE <SortIcon field="dosage" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button onClick={() => handleSort('frequency')} className="flex items-center gap-1 hover:text-gray-900">
                    FREQUENCY <SortIcon field="frequency" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button onClick={() => handleSort('time')} className="flex items-center gap-1 hover:text-gray-900">
                    TIME <SortIcon field="time" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button onClick={() => handleSort('stock')} className="flex items-center gap-1 hover:text-gray-900">
                    STOCK <SortIcon field="stock" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <button onClick={() => handleSort('addedAt')} className="flex items-center gap-1 hover:text-gray-900">
                    REGISTERED AT <SortIcon field="addedAt" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No medicines found
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((medicine) => (
                  <tr key={medicine.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{medicine.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{medicine.dosage}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{medicine.frequency}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{medicine.time}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`font-semibold ${parseInt(medicine.stock) <= 10 ? 'text-red-500' : 'text-green-600'}`}>
                        {medicine.stock} pills
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{medicine.addedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingMedicine(medicine)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(medicine)}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(medicine.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <MedicineModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMedicine(null);
        }}
        onSave={handleAddMedicine}
        editingMedicine={editingMedicine}
      />

      {/* View Modal */}
      {viewingMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Medicine Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Medicine Name</p>
                <p className="text-base font-semibold text-gray-900">{viewingMedicine.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dosage</p>
                <p className="text-base font-semibold text-gray-900">{viewingMedicine.dosage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Frequency</p>
                <p className="text-base font-semibold text-gray-900">{viewingMedicine.frequency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-base font-semibold text-gray-900">{viewingMedicine.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stock</p>
                <p className={`text-base font-bold ${parseInt(viewingMedicine.stock) <= 10 ? 'text-red-500' : 'text-green-600'}`}>
                  {viewingMedicine.stock} pills
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registered At</p>
                <p className="text-base font-semibold text-gray-900">{viewingMedicine.addedAt}</p>
              </div>
            </div>
            <button
              onClick={() => setViewingMedicine(null)}
              className="w-full mt-6 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineTracker;