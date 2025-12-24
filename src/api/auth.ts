import { db } from "@/config/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

async function signUpWithGoogle(payload){
    try{
        const docRef = await addDoc(collection(db, "users"), payload);
        // console.log("User signed up with Google, document ID:", docRef.id);
    } catch(error){
        console.error("Error during Google Sign-Up:", error);
        throw error;
    }
}
async function getUserByEmail(email: string) {
    try {
         const docRef = doc(db, "users", "email");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
}

async function manualSignUp(payload){
    try{
       
        const docRef = await addDoc(collection(db, "users"), payload);
        // console.log("User signed up manually, document ID:", docRef.id);
    } catch(error){
        console.error("Error during Manual Sign-Up:", error);
        throw error;
    }
}



export { signUpWithGoogle, getUserByEmail, manualSignUp };