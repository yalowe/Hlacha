import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

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
