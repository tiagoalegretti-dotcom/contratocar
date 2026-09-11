import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const FIREBASE_WEB_API_KEY =
  process.env.FIREBASE_WEB_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyAvC0AtIDq2K7RXWGPMK8c3ngcLiASmx00";

const config = {
  apiKey: FIREBASE_WEB_API_KEY,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "contratocar-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "contratocar-app",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:936684108269:web:dc6e9ecc217ebd3ba20fe4",
};

function app(): FirebaseApp {
  return getApps()[0] ?? initializeApp(config);
}

export function firebaseReady() {
  return Boolean(
    config.apiKey && config.authDomain && config.projectId && config.appId,
  );
}

export function getFirebaseAuth() {
  if (!firebaseReady()) return null;
  return getAuth(app());
}

export function getDb() {
  if (!firebaseReady()) return null;
  return getFirestore(app());
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
