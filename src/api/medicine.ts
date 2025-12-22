import { db } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";

const addMedicine = async (medicineData: any) => {
    try{
        const docRef = await addDoc(collection(db, "medicines"), medicineData);
        return docRef.id;
    }catch(error){
        console.error("Error adding medicine:", error);
        throw error;
    }
}

export { addMedicine };