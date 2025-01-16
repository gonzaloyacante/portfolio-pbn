// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgaOuBQ6UPXPWLiNQ3jx7UVrBjLnan5KE",
  authDomain: "portfolio-pbn.firebaseapp.com",
  projectId: "portfolio-pbn",
  storageBucket: "portfolio-pbn.firebasestorage.app",
  messagingSenderId: "430047243611",
  appId: "1:430047243611:web:f893779222b2a884627e7e",
  measurementId: "G-ZTJ288DFP1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics if supported
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { db, auth };
