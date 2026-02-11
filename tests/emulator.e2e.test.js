const { getApp } = require('firebase/app');
const { getFunctions, httpsCallable } = require('firebase/functions');
const { collection, doc, getDoc, getFirestore, setDoc } = require('firebase/firestore');

async function waitForApprovedAnswer(id, timeoutMs = 8000) {
  const start = Date.now();
  const db = getFirestore(getApp());
  const answerRef = typeof id === 'string'
    ? doc(db, 'answers', id)
    : doc(db, 'questions', id.questionId, 'answers', id.answerId);

  while (Date.now() - start < timeoutMs) {
    const snap = await getDoc(answerRef);
    if (snap.exists() && snap.data()?.status === 'approved') return;
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  throw new Error('Answer not approved in time');
}

test('e2e: question -> discussion -> approve answer', async () => {
  const app = getApp();
  const db = getFirestore(app);

  const questionRef = doc(collection(db, 'questions'));
  await setDoc(questionRef, {
    title: 'שאלה ארוכה',
    body: 'תוכן שאלה מפורט',
    status: 'pending_review',
    visibility: 'public',
    anon_session_id: 'anon-1'
  });

  const discussionRef = doc(collection(db, 'questions', questionRef.id, 'discussions'));
  await setDoc(discussionRef, {
    thread_id: discussionRef.id,
    type: 'question',
    body: 'שאלה נוספת',
    status: 'pending',
    anon_session_id: 'anon-1'
  });

  const answerRef = doc(collection(db, 'questions', questionRef.id, 'answers'));
  await setDoc(answerRef, {
    text: 'תשובה רשמית',
    status: 'draft',
    sources: [],
    approvals: [],
    isVerified: false,
    totalApprovalWeight: 0
  });

  const functions = getFunctions(app);
  const approve = httpsCallable(functions, 'approveAnswer');
  await approve({ questionId: questionRef.id, answerId: answerRef.id });

  await waitForApprovedAnswer({ questionId: questionRef.id, answerId: answerRef.id }, 8000);
});
