import { initializeApp, getApps } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let authPromise;

export function getFirebaseAuth() {
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    throw new Error("Firebase web configuration is missing. Add the VITE_FIREBASE_* values to the frontend environment file.");
  }
  if (!authPromise) {
    const app = getApps()[0] || initializeApp(config);
    const auth = getAuth(app);
    authPromise = setPersistence(auth, browserLocalPersistence).then(() => auth);
  }
  return authPromise;
}

function waitForCurrentUser(auth) {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, (error) => {
      unsubscribe();
      reject(error);
    });
  });
}

export async function getFirebaseIdToken() {
  const auth = await getFirebaseAuth();
  const user = await waitForCurrentUser(auth);
  return user ? user.getIdToken() : null;
}

export async function registerFirebaseUser({ name, email, password }) {
  const auth = await getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (name?.trim()) await updateProfile(credential.user, { displayName: name.trim() });
  return credential.user;
}

export async function loginFirebaseUser({ email, password }) {
  const auth = await getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function logoutFirebaseUser() {
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) return;
  const auth = await getFirebaseAuth();
  if (auth.currentUser) await signOut(auth);
}
