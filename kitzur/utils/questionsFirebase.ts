/**
 * Firebase Questions Manager (v1)
 */
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Question, QuestionCategory, Answer, HalachicSource, QuestionCreateResult } from '@/types/questions';

const COLLECTIONS = {
  QUESTIONS: 'questions',
  ANSWER_SUBMISSIONS: 'answer_submissions'
};

function normalizeQuestion(data: any): Question {
  const timestamp = data.timestamp?.toMillis ? data.timestamp.toMillis() : data.timestamp;
  return {
    ...data,
    timestamp,
    stats: data.stats || {
      views: 0,
      helpful: 0,
      notHelpful: 0,
      shares: 0
    },
    tags: data.tags || [],
    status: data.status || 'pending_review',
    moderationStatus: data.moderationStatus || 'pending',
    minimumApprovalsRequired: data.minimumApprovalsRequired ?? 5,
    relatedQuestions: data.relatedQuestions || [],
    isPrivate: data.isPrivate ?? false,
    visibility: data.visibility || 'public'
  } as Question;
}

export function subscribeToQuestions(
  callback: (questions: Question[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, COLLECTIONS.QUESTIONS),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const questions: Question[] = [];
      snapshot.forEach((docSnap) => {
        questions.push(normalizeQuestion({ id: docSnap.id, ...docSnap.data() }));
      });
      callback(questions);
    },
    (error) => {
      console.error('Error subscribing to questions:', error);
      if (onError) onError(error);
    }
  );
}

export async function askQuestion(
  questionText: string,
  category: QuestionCategory,
  userId: string,
  userName: string,
  isPrivate: boolean,
  anonSessionId?: string
): Promise<QuestionCreateResult> {
  const docRef = await addDoc(collection(db, COLLECTIONS.QUESTIONS), {
    question: questionText,
    category,
    askedBy: userId,
    askedByName: userName,
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
    status: 'pending_review',
    moderationStatus: 'pending',
    minimumApprovalsRequired: 5,
    stats: {
      views: 0,
      helpful: 0,
      notHelpful: 0,
      shares: 0
    },
    tags: [],
    relatedQuestions: [],
    isPrivate,
    visibility: 'public',
    anon_session_id: anonSessionId || null
  });

  return {
    id: docRef.id,
    slug: null,
    status: 'pending_review',
    moderationStatus: 'pending',
    visibility: 'public'
  };
}

export async function getAllQuestions(): Promise<Question[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.QUESTIONS),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const questions: Question[] = [];
    snapshot.forEach((docSnap) => {
      questions.push(normalizeQuestion({ id: docSnap.id, ...docSnap.data() }));
    });
    return questions;
  } catch (error) {
    console.error('❌ Error getting questions:', error);
    return [];
  }
}


export async function submitAnswerProposal(
  questionId: string,
  answerText: string,
  sources: HalachicSource[],
  userId: string,
  userName: string,
  anonSessionId?: string
): Promise<void> {
  await addDoc(collection(db, COLLECTIONS.ANSWER_SUBMISSIONS), {
    questionId,
    text: answerText,
    sources,
    respondedBy: userId,
    respondedByName: userName,
    status: 'pending_review',
    createdAt: serverTimestamp(),
    anon_session_id: anonSessionId || null
  });
}

export async function getApprovedAnswer(questionId: string): Promise<Answer | null> {
  const answersRef = collection(db, COLLECTIONS.QUESTIONS, questionId, 'answers');
  const q = query(answersRef, where('status', '==', 'approved'), orderBy('approvedAt', 'desc'));
  const snapshot = await getDocs(q);
  const docSnap = snapshot.docs[0];
  if (!docSnap) return null;
  return docSnap.data() as Answer;
}

export async function incrementViews(questionId: string): Promise<void> {
  try {
    const questionRef = doc(db, COLLECTIONS.QUESTIONS, questionId);
    await updateDoc(questionRef, {
      'stats.views': increment(1)
    });
  } catch (error) {
    console.error('❌ Error incrementing views:', error);
  }
}
