// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiOucO_nNlcFAR5Mz6mYI-4st4W21PopE",
  authDomain: "dream-journal-fb02c.firebaseapp.com",
  projectId: "dream-journal-fb02c",
  storageBucket: "dream-journal-fb02c.firebasestorage.app",
  messagingSenderId: "464792660093",
  appId: "1:464792660093:web:a15801f79539fb2b1c2914"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);