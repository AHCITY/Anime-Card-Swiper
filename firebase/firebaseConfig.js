// ===== FIREBASE IMPORTS =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    increment,
    serverTimestamp,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
    apiKey: "AIzaSyAYVhlIZXLYx3Q9sOD4flNlcdLt3ahu0N0",
    authDomain: "card-swiper-d5c0a.firebaseapp.com",
    projectId: "card-swiper-d5c0a",
    storageBucket: "card-swiper-d5c0a.firebasestorage.app",
    messagingSenderId: "579825479564",
    appId: "1:579825479564:web:f9d27ff12c7f7a5c5830a9",
    measurementId: "G-06SRGQTE85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Expose everything on window so classic scripts behave exactly as before
Object.assign(window, {
    firebaseConfig,
    app,
    analytics,
    auth,
    db,
    storage,
    googleProvider,
    // auth functions
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    // firestore functions
    doc,
    setDoc,
    getDoc,
    updateDoc,
    increment,
    serverTimestamp,
    collection,
    getDocs,
    query,
    where,
    // storage functions
    ref,
    uploadBytes,
    getDownloadURL
});