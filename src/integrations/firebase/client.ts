import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgUl-9OA18zrBLquVYmWdc0towhzQM7Fw",
  authDomain: "leemsdtt-app.firebaseapp.com",
  projectId: "leemsdtt-app",
  storageBucket: "leemsdtt-app.firebasestorage.app",
  messagingSenderId: "707564053535",
  appId: "1:707564053535:web:1f32ec6a3251df0da6e12a",
  measurementId: "G-640LB589P2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
