// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config loaded strictly from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// ✅ Temporary development console checks
console.log("Firebase ENV Loaded:", {
  apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  appId: !!import.meta.env.VITE_FIREBASE_APP_ID
});

// ✅ Startup validation logs (development mode only)
if (import.meta.env.DEV) {
  console.log("🔍 [Firebase] Auditing Environment Variables...");
  const requiredKeys = [
    "apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"
  ];
  
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
  
  if (missingKeys.length > 0) {
    console.error("❌ [Firebase] CRITICAL ERROR: Missing required configuration variables:");
    missingKeys.forEach(key => {
      const envName = `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
      console.error(`   - ${envName} is undefined`);
    });
    console.error("Please ensure you have a .env file in your frontend root directory with these variables defined and restart Vite.");
  } else {
    console.log("✅ [Firebase] All required environment variables are loaded.");
    const maskedKey = firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 5)}...${firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 4)}` : 'MISSING';
    console.log(`[Firebase] API Key format check: ${maskedKey}`);
  }
}

// ✅ Defensive Initialization
let app = null;
let auth = null;
let googleProvider = null;
let githubProvider = null;
let storage = null;
let firestore = null;
let db = null;

try {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
  
  if (missingKeys.length > 0) {
    throw new Error(`Missing critical Firebase environment variables: ${missingKeys.join(', ')}. Please check your .env file.`);
  }
  
  // Prevent duplicate initialization on Hot Module Replacement (HMR)
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  githubProvider = new GithubAuthProvider();
  storage = getStorage(app);
  firestore = getFirestore(app);
} catch (error) {
  console.error("🔥 [Firebase] Initialization Failed Gracefully:");
  console.error(error.message || error);
}

// ✅ Optional: expose RecaptchaVerifier if needed
const generateRecaptcha = () => {
  if (!auth) {
    console.warn("[Firebase] Cannot generate recaptcha: Auth is not initialized.");
    return;
  }
  
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved
      },
      "expired-callback": () => {
        alert("Recaptcha expired. Please try again.");
      }
    });
  } catch (error) {
    console.error("[Firebase] Recaptcha Initialization Failed:", error);
  }
};

console.log("Firebase Ready:", !!auth);

export { app, auth, googleProvider, githubProvider, storage, firestore, db, generateRecaptcha };
