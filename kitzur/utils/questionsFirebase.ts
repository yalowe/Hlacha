/**
 * Firebase Questions Manager
 * Real-time cloud database for questions & answers
 */
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Question, Answer } from '@/types/questions';

const COLLECTIONS = {
  QUESTIONS: 'questions',
  ANSWERS: 'answers',
};

// Real-time listener for all questions
export function subscribeToQuestions(
  callback: (questions: Question[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, COLLECTIONS.QUESTIONS),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const questions: Question[] = [];
      snapshot.forEach((doc) => {
        questions.push({ id: doc.id, ...doc.data() } as Question);
      });
      callback(questions);
    },
    (error) => {
      console.error('Error subscribing to questions:', error);
      if (onError) onError(error);
    }
  );
}

// Ask a new question
export async function askQuestion(question: Omit<Question, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.QUESTIONS), {
      ...question,
      timestamp: serverTimestamp(),
    });
    console.log('✅ Question asked successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error asking question:', error);
    throw error;
  }
}

// Get all questions
export async function getAllQuestions(): Promise<Question[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.QUESTIONS),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    const questions: Question[] = [];
    snapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() } as Question);
    });
    return questions;
  } catch (error) {
    console.error('❌ Error getting questions:', error);
    return [];
  }
}

// Get question by ID
export async function getQuestion(questionId: string): Promise<Question | null> {
  try {
    const docRef = doc(db, COLLECTIONS.QUESTIONS, questionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Question;
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting question:', error);
    return null;
  }
}

// Answer a question
export async function answerQuestion(
  questionId: string,
  answer: Omit<Answer, 'isVerified' | 'totalApprovalWeight' | 'approvals'>
): Promise<void> {
  try {
    const questionRef = doc(db, COLLECTIONS.QUESTIONS, questionId);
    await updateDoc(questionRef, {
      answer: {
        ...answer,
        answeredAt: serverTimestamp(),
        approvals: [],
        isVerified: false,
        totalApprovalWeight: 0,
      },
      status: answer.source === 'rabbi' ? 'rabbi_answered' : 'ai_answered',
    });
    console.log('✅ Answer added successfully');
  } catch (error) {
    console.error('❌ Error answering question:', error);
    throw error;
  }
}

// Increment views
export async function incrementViews(questionId: string): Promise<void> {
  try {
    const questionRef = doc(db, COLLECTIONS.QUESTIONS, questionId);
    await updateDoc(questionRef, {
      'stats.views': increment(1),
    });
  } catch (error) {
    console.error('❌ Error incrementing views:', error);
  }
}

// Rate answer (helpful/not helpful)
export async function rateAnswer(
  questionId: string,
  isHelpful: boolean
): Promise<void> {
  try {
    const questionRef = doc(db, COLLECTIONS.QUESTIONS, questionId);
    const field = isHelpful ? 'stats.helpful' : 'stats.notHelpful';
    await updateDoc(questionRef, {
      [field]: increment(1),
    });
    console.log(`✅ Rated as ${isHelpful ? 'helpful' : 'not helpful'}`);
  } catch (error) {
    console.error('❌ Error rating answer:', error);
    throw error;
  }
}

// Get questions by category
export async function getQuestionsByCategory(category: string): Promise<Question[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.QUESTIONS),
      where('category', '==', category),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    const questions: Question[] = [];
    snapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() } as Question);
    });
    return questions;
  } catch (error) {
    console.error('❌ Error getting questions by category:', error);
    return [];
  }
}

// Search questions
export async function searchQuestions(searchTerm: string): Promise<Question[]> {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation - for production, consider Algolia or similar
    const allQuestions = await getAllQuestions();
    const lowerSearch = searchTerm.toLowerCase();
    
    return allQuestions.filter((q) =>
      q.question.toLowerCase().includes(lowerSearch) ||
      q.tags.some((tag) => tag.toLowerCase().includes(lowerSearch))
    );
  } catch (error) {
    console.error('❌ Error searching questions:', error);
    return [];
  }
}

// Migrate local questions to Firebase
export async function migrateLocalToFirebase(localQuestions: Question[]): Promise<void> {
  try {
    console.log(`🔄 Migrating ${localQuestions.length} questions to Firebase...`);
    
    for (const question of localQuestions) {
      const { id, ...questionData } = question;
      await addDoc(collection(db, COLLECTIONS.QUESTIONS), questionData);
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error migrating questions:', error);
    throw error;
  }
}
