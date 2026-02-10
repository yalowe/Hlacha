import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { createHash } from 'crypto';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const firestoreModule = admin.firestore as typeof admin.firestore & { FieldValue?: typeof FieldValue };
firestoreModule.FieldValue = FieldValue;
const serverTimestamp = admin.firestore.FieldValue?.serverTimestamp ?? FieldValue.serverTimestamp;

function buildSlug(title: string, seed: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
  const hash = createHash('sha256').update(`${title}:${seed}`).digest('hex').slice(0, 8);
  return base ? `${base}-${hash}` : `q-${hash}`;
}

function buildContentHash(title: string, body: string, anonSessionId?: string) {
  return createHash('sha256')
    .update(`${title}:${body}:${anonSessionId || ''}`)
    .digest('hex');
}

async function rateLimit(key: string, limit = 60) {
  const bucket = Math.floor(Date.now() / 60000).toString();
  const docId = `${key}_${bucket}`;
  const ref = db.collection('rate_limits').doc(docId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists ? (snap.data()?.count || 0) : 0;
    if (current >= limit) {
      throw new functions.https.HttpsError('resource-exhausted', 'rate_limited');
    }
    tx.set(ref, { count: current + 1, updatedAt: serverTimestamp() }, { merge: true });
  });
}

export const onCreateQuestion = functions.firestore
  .document('questions/{questionId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const slug = data.slug || buildSlug(data.title || 'question', snap.id);
    const contentHash = data.contentHash || buildContentHash(data.title || '', data.body || '', data.anon_session_id);

    await snap.ref.set({
      slug,
      contentHash,
      createdAt: data.createdAt || serverTimestamp()
    }, { merge: true });

    await db.collection('audit_logs').add({
      action: 'question.create',
      entity_type: 'question',
      entity_id: snap.id,
      createdAt: serverTimestamp()
    });

    await db.collection('notifications').add({
      type: 'question.created',
      payload_json: { questionId: snap.id },
      createdAt: serverTimestamp()
    });
  });

export const approveAnswer = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'auth_required');
  }

  const role = (context.auth.token.role as string | undefined) || null;
  if (!role || !['Posek', 'SuperAdmin'].includes(role)) {
    throw new functions.https.HttpsError('permission-denied', 'forbidden');
  }

  await rateLimit(context.auth.uid, 30);

  const answerRef = db.doc(`questions/${data.questionId}/answers/${data.answerId}`);
  await answerRef.set({
    status: 'approved',
    approved_by_user_id: context.auth.uid,
    approvedAt: serverTimestamp()
  }, { merge: true });

  await db.collection('questions').doc(data.questionId).set({
    status: 'approved'
  }, { merge: true });

  await db.collection('revisions').add({
    entity_type: 'answer',
    entity_id: data.answerId,
    change_summary: 'Answer approved',
    changed_by: context.auth.uid,
    createdAt: serverTimestamp()
  });

  await db.collection('audit_logs').add({
    action: 'answer.approve',
    entity_type: 'answer',
    entity_id: data.answerId,
    actor_user_id: context.auth.uid,
    createdAt: serverTimestamp()
  });

  return { ok: true };
});

export const createFlag = functions.https.onCall(async (data, context) => {
  const key = context.auth?.uid || data.anon_session_id || 'anonymous';
  await rateLimit(key, 60);

  await db.collection('moderation_flags').add({
    entity_type: data.entity_type,
    entity_id: data.entity_id,
    reason: data.reason,
    status: 'pending',
    reporter_user_id: context.auth?.uid || null,
    anon_session_id: data.anon_session_id || null,
    createdAt: serverTimestamp()
  });

  return { ok: true };
});

export const resolveFlag = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'auth_required');
  }

  const role = (context.auth.token.role as string | undefined) || null;
  if (!role || !['Editor', 'SuperAdmin'].includes(role)) {
    throw new functions.https.HttpsError('permission-denied', 'forbidden');
  }

  await rateLimit(context.auth.uid, 30);

  await db.collection('moderation_flags').doc(data.flag_id).set({
    status: 'actioned',
    resolved_by: context.auth.uid,
    resolved_at: serverTimestamp(),
    resolution_note: data.resolution_note || null
  }, { merge: true });

  return { ok: true };
});
