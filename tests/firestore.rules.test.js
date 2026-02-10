const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const fs = require('fs');

const PROJECT_ID = 'demo-hlacha';

function readRules() {
  return fs.readFileSync('firestore.rules', 'utf8');
}

describe('firestore rules', () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: { rules: readRules() }
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  test('anonymous can create pending question', async () => {
    const anon = testEnv.unauthenticatedContext();
    const db = anon.firestore();
    const ref = db.collection('questions').doc('q1');

    await assertSucceeds(ref.set({
      title: 'שאלה',
      body: 'תוכן שאלה מפורט',
      status: 'pending_review',
      visibility: 'public',
      anon_session_id: 'anon-1'
    }));
  });

  test('anonymous cannot update question', async () => {
    const anon = testEnv.unauthenticatedContext();
    const db = anon.firestore();
    const ref = db.collection('questions').doc('q2');

    await assertFails(ref.update({ title: 'עדכון' }));
  });

  test('anonymous create without anon_session_id is rejected', async () => {
    const anon = testEnv.unauthenticatedContext();
    const db = anon.firestore();
    const ref = db.collection('questions').doc('q3');

    await assertFails(ref.set({
      title: 'שאלה',
      body: 'תוכן שאלה מפורט',
      status: 'pending_review',
      visibility: 'public'
    }));
  });

  test('discussion requires pending status and valid type', async () => {
    const anon = testEnv.unauthenticatedContext();
    const db = anon.firestore();
    const ref = db.collection('questions').doc('q4').collection('discussions').doc('d1');

    await assertFails(ref.set({
      type: 'psak',
      body: 'תוכן',
      status: 'approved',
      anon_session_id: 'anon-2'
    }));
  });
});
