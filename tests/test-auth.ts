import type { Auth } from 'firebase/auth';
import { signInWithCustomToken } from 'firebase/auth';
import { getApps as getAdminApps, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

const PROJECT_ID = 'demo-hlacha';

function getAdminApp() {
  if (getAdminApps().length) {
    return getAdminApps()[0];
  }

  return initializeAdminApp({ projectId: PROJECT_ID });
}

export async function signInAsPosek(auth: Auth) {
  const adminApp = getAdminApp();
  const token = await getAdminAuth(adminApp).createCustomToken('posek-1', {
    role: 'Posek'
  });

  await signInWithCustomToken(auth, token);
}
