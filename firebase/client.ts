// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLj-xrhcxVJShVtdVNhf4PT-7BBLaqIdE",
  authDomain: "prepwise-f3d1a.firebaseapp.com",
  projectId: "prepwise-f3d1a",
  storageBucket: "prepwise-f3d1a.firebasestorage.app",
  messagingSenderId: "761576513344",
  appId: "1:761576513344:web:24f7390833e2c8d03524a5",
  measurementId: "G-68M9YFEFF5"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);