import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtNON_J2ppBvl1_oDLdNgtMmnadDxnouI",
  authDomain: "campaignx-c6bef.firebaseapp.com",
  projectId: "campaignx-c6bef",
  storageBucket: "campaignx-c6bef.firebasestorage.app",
  messagingSenderId: "1004326519619",
  appId: "1:1004326519619:web:3d369e56608d2f2e07e5f6",
  measurementId: "G-NTGQF7KBMC",
};

// Prevent re-initialization during hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
