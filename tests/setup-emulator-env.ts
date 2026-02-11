import { beforeAll } from 'vitest';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { signInAsPosek } from './test-auth';

const PROJECT_ID = 'demo-hlacha';

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
process.env.FUNCTIONS_EMULATOR_HOST = '127.0.0.1:5001';
process.env.GCLOUD_PROJECT = PROJECT_ID;

const app = getApps().length ? getApp() : initializeApp({ projectId: PROJECT_ID });
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

try {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
} catch {
  // Ignore duplicate emulator connection in repeated test runs.
}

try {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
} catch {
  // Ignore duplicate emulator connection in repeated test runs.
}

try {
  connectStorageEmulator(storage, '127.0.0.1', 9199);
} catch {
  // Ignore duplicate emulator connection in repeated test runs.
}

try {
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
} catch {
  // Ignore duplicate emulator connection in repeated test runs.
}

beforeAll(async () => {
  await signInAsPosek(auth);
});
