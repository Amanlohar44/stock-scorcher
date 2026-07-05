import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5BRCY3NsUhTWQ2HjYEjZe_SVqz-jzS4w",
  authDomain: "stock-scorcher.firebaseapp.com",
  projectId: "stock-scorcher",
  storageBucket: "stock-scorcher.firebasestorage.app",
  messagingSenderId: "101495872017",
  appId: "1:101495872017:web:1cc15280d0aa17ef232fb0",
  measurementId: "G-P20ZBZ3H8Z",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);