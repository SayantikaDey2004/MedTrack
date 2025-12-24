import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  DocumentSnapshot,
  Query,
  Timestamp,
} from "firebase/firestore";
import { removeMedicineFromDailyConsumption } from "./dailyConsumption";

// Types
export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  notes?: string;
  isActive?: boolean;
  addedAt: string;
  createdAt?: Timestamp;
  userId?: string;
}

export interface MedicineFilters {
  search?: string;
  stockFilter?: 'all' | 'low-stock' | 'adequate-stock';
  sortBy?: 'name' | 'stock' | 'date';
  sortOrder?: 'asc' | 'desc';
  pageSize?: number;
  lastDoc?: DocumentSnapshot;
}

export interface PaginatedResponse<T> {
  data: T[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
  total?: number;
}

// Add Medicine
const addMedicine = async (medicineData: Omit<Medicine, 'id'>, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, "medicines"), {
      ...medicineData,
      userId,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding medicine:", error);
    throw error;
  }
};

// Update Medicine
const updateMedicine = async (id: string, medicineData: Partial<Medicine>) => {
  try {
    const medicineRef = doc(db, "medicines", id);
    await updateDoc(medicineRef, medicineData);
    return true;
  } catch (error) {
    console.error("Error updating medicine:", error);
    throw error;
  }
};

// Delete Medicine
const deleteMedicine = async (id: string) => {
  try {
    // First, get the medicine to find the userId
    const medicineRef = doc(db, "medicines", id);
    const medicineDoc = await getDoc(medicineRef);
    
    if (!medicineDoc.exists()) {
      throw new Error("Medicine not found");
    }
    
    const medicineData = medicineDoc.data();
    const userId = medicineData.userId;
    
    // Delete from medicines collection
    await deleteDoc(medicineRef);
    
    // Remove from all dailyConsumption documents
    if (userId) {
      await removeMedicineFromDailyConsumption(userId, id);
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting medicine:", error);
    throw error;
  }
};

// Get Single Medicine
const getMedicine = async (id: string): Promise<Medicine | null> => {
  try {
    const medicineRef = doc(db, "medicines", id);
    const medicineDoc = await getDoc(medicineRef);
    
    if (medicineDoc.exists()) {
      return {
        id: medicineDoc.id,
        ...medicineDoc.data(),
      } as Medicine;
    }
    return null;
  } catch (error) {
    console.error("Error getting medicine:", error);
    throw error;
  }
};

// Get Medicines with Filters, Sorting, and Pagination
const getMedicines = async (
  userId: string,
  filters: MedicineFilters = {}
): Promise<PaginatedResponse<Medicine>> => {
  try {
    console.log('getMedicines called with userId:', userId, 'filters:', filters);
    
    const {
      search = '',
      stockFilter = 'all',
      sortBy = 'date',
      sortOrder = 'desc',
      pageSize = 10,
      lastDoc = null,
    } = filters;

    // Start building query
    let q: Query = collection(db, "medicines");

    // Filter by user
    q = query(q, where("userId", "==", userId));

    // Stock filter
    if (stockFilter === 'low-stock') {
      q = query(q, where("stock", "<=", 10));
    } else if (stockFilter === 'adequate-stock') {
      q = query(q, where("stock", ">", 10));
    }

    // Sorting
    let orderByField = 'createdAt';
    if (sortBy === 'name') {
      orderByField = 'name';
    } else if (sortBy === 'stock') {
      orderByField = 'stock';
    }

    q = query(q, orderBy(orderByField, sortOrder));

    // Pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    q = query(q, limit(pageSize + 1)); // Get one extra to check if there are more

    console.log('Executing query...');
    const querySnapshot = await getDocs(q);
    console.log('Query snapshot size:', querySnapshot.size);
    
    const medicines: Medicine[] = [];
    let lastDocument: DocumentSnapshot | null = null;
    let hasMore = false;

    querySnapshot.docs.forEach((doc, index) => {
      console.log('Document', index, ':', doc.id, doc.data());
      if (index < pageSize) {
        const data = doc.data();
        medicines.push({
          id: doc.id,
          name: data.name,
          dosage: data.dosage,
          stock: data.stock,
          notes: data.notes,
          addedAt: data.addedAt,
          createdAt: data.createdAt,
          userId: data.userId,
        });
        lastDocument = doc;
      } else {
        hasMore = true;
      }
    });

    console.log('Parsed medicines:', medicines.length);

    // Client-side search filter (since Firestore doesn't support contains)
    let filteredMedicines = medicines;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMedicines = medicines.filter(
        (med) =>
          med.name.toLowerCase().includes(searchLower) ||
          med.dosage.toLowerCase().includes(searchLower) ||
          (med.notes && med.notes.toLowerCase().includes(searchLower))
      );
    }

    console.log('Filtered medicines:', filteredMedicines.length);

    return {
      data: filteredMedicines,
      lastDoc: lastDocument,
      hasMore,
    };
  } catch (error) {
    console.error("Error getting medicines:", error);
    throw error;
  }
};

// Get all medicines count for analytics
const getMedicineStats = async (userId: string) => {
  try {
    const q = query(collection(db, "medicines"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const medicines = querySnapshot.docs.map(doc => ({
      stock: doc.data().stock,
    }));

    return {
      total: medicines.length,
      lowStock: medicines.filter(m => m.stock <= 10).length,
    };
  } catch (error) {
    console.error("Error getting medicine stats:", error);
    throw error;
  }
};

export {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicine,
  getMedicines,
  getMedicineStats,
};