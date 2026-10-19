/**
 * Conexión real con Firebase (Firestore + Auth) a partir de las variables de entorno:
 *   VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID
 * (Firebase console → Configuración del proyecto → Tus apps → app web → «Configuración del SDK»).
 * Estos valores no son secretos: identifican el proyecto; la seguridad la dan las reglas de Firestore.
 */
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const env = import.meta.env as Record<string, string | undefined>;

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

export const isFirebaseConfigured = (): boolean =>
  !!(config.apiKey && config.authDomain && config.projectId && config.appId);

let app: FirebaseApp | null = null;

const getApp = (): FirebaseApp => {
  if (!isFirebaseConfigured()) throw new Error('Firebase no está configurado');
  if (!app) app = getApps()[0] ?? initializeApp(config as Required<typeof config>);
  return app;
};

export const firestore = (): Firestore => getFirestore(getApp());
export const firebaseAuth = (): Auth => getAuth(getApp());
