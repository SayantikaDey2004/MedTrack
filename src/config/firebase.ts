// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiRPdlw7rxkF6RxrgKXVW9vnkyAi6T08o",
  authDomain: "medtrack-v1.firebaseapp.com",
  projectId: "medtrack-v1",
  storageBucket: "medtrack-v1.firebasestorage.app",
  messagingSenderId: "612758487816",
  appId: "1:612758487816:web:a6d7129bea286a1ecb62bd",
  measurementId: "G-NQCDPLZ7NS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);//normal auth
const googleAuthProvider = new GoogleAuthProvider();
const db = getFirestore(app);
export { app, analytics, auth, googleAuthProvider,db };
