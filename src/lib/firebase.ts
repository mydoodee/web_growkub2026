import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJBMxj8HPj2MI44SU3wWKd90Kr1JwWT7w",
  authDomain: "growkub-dev.firebaseapp.com",
  projectId: "growkub-dev",
  storageBucket: "growkub-dev.firebasestorage.app",
  messagingSenderId: "348522611922",
  appId: "1:348522611922:web:9e8c7e0f6ff5decd0bd90b",
  measurementId: "G-D1WSPHMVGN"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
