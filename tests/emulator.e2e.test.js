const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth, connectAuthEmulator, signInWithCustomToken } = require('firebase/auth');
const { getFunctions, connectFunctionsEmulator, httpsCallable } = require('firebase/functions');

const PROJECT_ID = 'demo-hlacha';

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

function initAdmin() {
  if (admin.apps.length) return admin.app();
  return admin.initializeApp({ projectId: PROJECT_ID });
}

test('e2e: question -> discussion -> approve answer', async () => {
  const adminApp = initAdmin();
  const db = adminApp.firestore();

  const questionRef = db.collection('questions').doc();
  await questionRef.set({
    question: 'שאלה ארוכה',
    category: 'other',
    askedBy: 'anon',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'pending_review',
    visibility: 'public',
    anon_session_id: 'anon-1'
  });

  const listSnap = await db.collection('questions').get();
  expect(listSnap.size).toBeGreaterThan(0);

  const discussionRef = questionRef.collection('discussions').doc();
  await discussionRef.set({
    thread_id: discussionRef.id,
    type: 'question',
    body: 'שאלה נוספת',
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    anon_session_id: 'anon-1'
  });

  const answerRef = questionRef.collection('answers').doc();
  await answerRef.set({
    text: 'תשובה רשמית',
    status: 'draft',
    sources: [],
    approvals: [],
    isVerified: false,
    totalApprovalWeight: 0,
    answeredAt: admin.firestore.FieldValue.serverTimestamp()
  });

  const customToken = await adminApp.auth().createCustomToken('posek-1', { role: 'Posek' });

  const clientApp = initializeApp({ projectId: PROJECT_ID, apiKey: 'fake', authDomain: 'localhost' });
  const auth = getAuth(clientApp);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  await signInWithCustomToken(auth, customToken);

  const functions = getFunctions(clientApp);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);

  const approve = httpsCallable(functions, 'approveAnswer');
  await approve({ questionId: questionRef.id, answerId: answerRef.id });

  const approvedSnap = await answerRef.get();
  expect(approvedSnap.data().status).toBe('approved');
});
