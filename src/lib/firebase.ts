import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const config = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyAvC0AtIDq2K7RXWGPMK8c3ngcLiASmx00",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "contratocar-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "contratocar-app",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:936684108269:web:dc6e9ecc217ebd3ba20fe4",
};

export function firebaseReady() {
  return Boolean(
    config.apiKey && config.authDomain && config.projectId && config.appId,
  );
}

export function getFirebaseAuth() {
  if (!firebaseReady()) return null;
  const app = getApps()[0] ?? initializeApp(config);
  return getAuth(app);
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
