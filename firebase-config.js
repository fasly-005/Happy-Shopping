import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

export const firebaseConfig = {
    apiKey: "AIzaSyBeCy9T9JvSwnBXxkyFiPyPCl8lwbkE4Qc",
    authDomain: "happy-shopping-c5048.firebaseapp.com",
    projectId: "happy-shopping-c5048",
    storageBucket: "happy-shopping-c5048.firebasestorage.app",
    messagingSenderId: "19232851765",
    appId: "1:19232851765:web:cd6c412fb712a5824dae7c",
    measurementId: "G-8V79FHV9CP"
};

export const adminEmail = "fmfasly@gmail.com";
export const isFirebaseConfigured = [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.projectId,
    firebaseConfig.storageBucket,
    firebaseConfig.messagingSenderId,
    firebaseConfig.appId
].every(Boolean);

export const app = isFirebaseConfigured
    ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
    : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
