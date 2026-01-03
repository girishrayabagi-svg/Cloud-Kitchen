// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- REPLACE THIS WITH YOUR REAL FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyABgkorxRm0qva1-OOZjETj3c5blnTPdTA",
  authDomain: "cloudkitchen-89fba.firebaseapp.com",
  projectId: "cloudkitchen-89fba",
  storageBucket: "cloudkitchen-89fba.firebasestorage.app",
  messagingSenderId: "499647840766",
  appId: "1:499647840766:web:2b0465cd1896d2bd2f40af"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
