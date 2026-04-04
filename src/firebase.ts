import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7BLxCf7nJl1GCn4rMfPrHlX73n3rH4Qs",
  authDomain: "controlsai-aeba1.firebaseapp.com",
  projectId: "controlsai-aeba1",
  storageBucket: "controlsai-aeba1.firebasestorage.app",
  messagingSenderId: "346310331421",
  appId: "1:346310331421:web:937afe3cbc806c1e3a4af4",
  measurementId: "G-R97E8078WD"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const dbFirestore = getFirestore(app);
