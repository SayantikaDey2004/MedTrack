import { db } from "@/config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

// Types
export interface DailyConsumption {
  userId: string;
  date: string; // "2025-01-10"
  medicines: {
    [medicineId: string]: {
      medicineName: string;
      dosage: "once" | "twice" | "thrice" | "four";
      consumed: boolean[];
    };
  };
  updatedAt: Timestamp;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  isActive?: boolean;
}

// Get today's date in YYYY-MM-DD format
export const getTodayDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Get or create today's consumption document
export const getTodayConsumption = async (userId: string): Promise<DailyConsumption> => {
  try {
    const todayDate = getTodayDate();
    const docId = `${userId}_${todayDate}`;
    const docRef = doc(db, "dailyConsumption", docId);
    
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as DailyConsumption;
    } else {
      // Create new document with all active medicines
      const activeMedicines = await getActiveMedicines(userId);
      
      const medicines: DailyConsumption['medicines'] = {};
      activeMedicines.forEach(med => {
        const dosageCount = getDosageCount(med.dosage);
        medicines[med.id] = {
          medicineName: med.name,
          dosage: med.dosage as "once" | "twice" | "thrice" | "four",
          consumed: new Array(dosageCount).fill(false),
        };
      });
      
      const newDoc: DailyConsumption = {
        userId,
        date: todayDate,
        medicines,
        updatedAt: Timestamp.now(),
      };
      
      await setDoc(docRef, newDoc);
      return newDoc;
    }
  } catch (error) {
    console.error("Error getting today's consumption:", error);
    throw error;
  }
};

// Get active medicines for user
const getActiveMedicines = async (userId: string): Promise<Medicine[]> => {
  try {
    const medicinesRef = collection(db, "medicines");
    const q = query(
      medicinesRef,
      where("userId", "==", userId),
      where("isActive", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    const medicines: Medicine[] = [];
    
    querySnapshot.forEach((doc) => {
      medicines.push({
        id: doc.id,
        ...doc.data(),
      } as Medicine);
    });
    
    return medicines;
  } catch (error) {
    console.error("Error getting active medicines:", error);
    throw error;
  }
};

// Update consumption status
export const updateConsumption = async (
  userId: string,
  medicineId: string,
  doseIndex: number,
  consumed: boolean
): Promise<void> => {
  try {
    const todayDate = getTodayDate();
    const docId = `${userId}_${todayDate}`;
    const docRef = doc(db, "dailyConsumption", docId);
    
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Document not found");
    }
    
    const data = docSnap.data() as DailyConsumption;
    
    if (data.medicines[medicineId]) {
      data.medicines[medicineId].consumed[doseIndex] = consumed;
      
      await updateDoc(docRef, {
        [`medicines.${medicineId}.consumed`]: data.medicines[medicineId].consumed,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error updating consumption:", error);
    throw error;
  }
};

// Helper function to get dosage count
const getDosageCount = (dosage: string): number => {
  switch (dosage) {
    case "once":
      return 1;
    case "twice":
      return 2;
    case "thrice":
      return 3;
    case "four":
      return 4;
    default:
      return 1;
  }
};
