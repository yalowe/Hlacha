import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, signInAnonymously } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { connectFirestoreEmulator, getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyARBRNZ87W29maLQE-34NmjH_fcqIxee5s',
  authDomain: 'hlacha-app.firebaseapp.com',
  projectId: 'hlacha-app',
  storageBucket: 'hlacha-app.firebasestorage.app',
  messagingSenderId: '154296942110',
  appId: '1:154296942110:web:5a595463ed4a89c52e380f',
  measurementId: 'G-VN7RNGGZHN'
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

const emulatorHost = process.env.EXPO_PUBLIC_EMULATOR_HOST;

if (emulatorHost) {
  try {
    connectFirestoreEmulator(db, emulatorHost, 8080);
  } catch {
    console.warn('Firestore emulator connection failed.');
  }

  try {
    connectAuthEmulator(auth, `http://${emulatorHost}:9099`, { disableWarnings: true });
  } catch {
    console.warn('Auth emulator connection failed.');
  }

  try {
    connectStorageEmulator(storage, emulatorHost, 9199);
  } catch {
    console.warn('Storage emulator connection failed.');
  }

  try {
    connectFunctionsEmulator(functions, emulatorHost, 5001);
  } catch {
    console.warn('Functions emulator connection failed.');
  }
}

try {
  enableIndexedDbPersistence(db).catch(() => {
    console.warn('Firestore persistence not available.');
  });
} catch {
  console.warn('Firestore persistence setup failed.');
}

export async function ensureAnonymousAuth() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}
