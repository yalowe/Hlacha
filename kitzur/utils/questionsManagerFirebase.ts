/**
 * Firebase Firestore Integration for Questions
 * Replaces AsyncStorage with cloud database
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Question, Answer, Approval, QuestionCategory } from '@/types/questions';

// TODO: After Firebase setup, uncomment:
// import { db } from '@/config/firebase';
// import { 
//   collection, 
//   doc, 
//   getDocs, 
//   getDoc,
//   addDoc, 
//   updateDoc, 
//   query, 
//   where, 
//   orderBy,
//   limit,
//   increment,
//   Timestamp 
// } from 'firebase/firestore';

const STORAGE_KEYS = {
  QUESTIONS: '@kitzur_questions',
  MY_QUESTIONS: '@kitzur_my_questions',
};

// Flag to switch between AsyncStorage and Firebase
const USE_FIREBASE = false; // Set to true after Firebase setup

// Helper to generate unique ID
function generateId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Extract tags from question text
function extractTags(text: string): string[] {
  const words = text.split(/\s+/);
  const tags = words
    .filter(word => word.length > 3)
    .slice(0, 5)
    .map(word => word.replace(/[^\u0590-\u05FF\w]/g, ''));
  return [...new Set(tags)];
}

// ============================================
// FIREBASE FUNCTIONS (Comment out for now)
// ============================================

/*
async function getAllQuestionsFromFirebase(): Promise<Question[]> {
  try {
    const questionsRef = collection(db, 'questions');
    const q = query(questionsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
  } catch (error) {
    console.error('Firebase error:', error);
    return [];
  }
}

async function askQuestionToFirebase(
  question: string,
  category: QuestionCategory,
  userId: string,
  userName: string,
  isPrivate: boolean
): Promise<Question> {
  const questionsRef = collection(db, 'questions');
  
  const newQuestion: Omit<Question, 'id'> = {
    question: question.trim(),
    category,
    askedBy: userId,
    askedByName: userName,
    timestamp: Date.now(),
    status: 'pending',
    stats: {
      views: 0,
      helpful: 0,
      notHelpful: 0,
      shares: 0
    },
    tags: extractTags(question),
    relatedQuestions: [],
    isPrivate
  };

  const docRef = await addDoc(questionsRef, newQuestion);
  
  return {
    id: docRef.id,
    ...newQuestion
  };
}

async function addAnswerToFirebase(questionId: string, answer: Answer): Promise<void> {
  const questionRef = doc(db, 'questions', questionId);
  
  await updateDoc(questionRef, {
    answer: answer,
    status: answer.source === 'rabbi' ? 'rabbi_answered' : 'ai_answered'
  });
}

async function addApprovalToFirebase(questionId: string, approval: Approval): Promise<void> {
  const questionRef = doc(db, 'questions', questionId);
  const questionDoc = await getDoc(questionRef);
  
  if (questionDoc.exists()) {
    const question = questionDoc.data() as Question;
    const currentApprovals = question.answer?.approvals || [];
    
    await updateDoc(questionRef, {
      'answer.approvals': [...currentApprovals, approval],
      'answer.isVerified': true
    });
  }
}

async function incrementViewsInFirebase(questionId: string): Promise<void> {
  const questionRef = doc(db, 'questions', questionId);
  await updateDoc(questionRef, {
    'stats.views': increment(1)
  });
}

async function markAsHelpfulInFirebase(questionId: string, helpful: boolean): Promise<void> {
  const questionRef = doc(db, 'questions', questionId);
  
  if (helpful) {
    await updateDoc(questionRef, {
      'stats.helpful': increment(1)
    });
  } else {
    await updateDoc(questionRef, {
      'stats.notHelpful': increment(1)
    });
  }
}
*/

// ============================================
// ASYNCSTORAGE FUNCTIONS (Current)
// ============================================

export async function getAllQuestions(): Promise<Question[]> {
  // if (USE_FIREBASE) {
  //   return await getAllQuestionsFromFirebase();
  // }
  
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get questions:', error);
    return [];
  }
}

export async function getQuestionsByCategory(category: QuestionCategory): Promise<Question[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions.filter(q => q.category === category);
}

export async function getMyQuestions(userId: string): Promise<Question[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions.filter(q => q.askedBy === userId);
}

export async function searchQuestions(query: string): Promise<Question[]> {
  if (!query.trim()) return [];
  
  const allQuestions = await getAllQuestions();
  
  return allQuestions.filter(q => 
    q.question.includes(query) ||
    q.tags.some(tag => tag.includes(query)) ||
    q.answer?.text.includes(query)
  ).sort((a, b) => {
    const aExact = a.question.includes(query) ? 1 : 0;
    const bExact = b.question.includes(query) ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;
    return b.stats.views - a.stats.views;
  });
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const allQuestions = await getAllQuestions();
  return allQuestions.find(q => q.id === id) || null;
}

export async function askQuestion(
  question: string,
  category: QuestionCategory,
  userId: string,
  userName: string,
  isPrivate: boolean = false
): Promise<Question> {
  // if (USE_FIREBASE) {
  //   return await askQuestionToFirebase(question, category, userId, userName, isPrivate);
  // }
  
  const newQuestion: Question = {
    id: generateId(),
    question: question.trim(),
    category,
    askedBy: userId,
    askedByName: userName,
    timestamp: Date.now(),
    status: 'pending',
    stats: {
      views: 0,
      helpful: 0,
      notHelpful: 0,
      shares: 0
    },
    tags: extractTags(question),
    relatedQuestions: [],
    isPrivate
  };

  const allQuestions = await getAllQuestions();
  allQuestions.unshift(newQuestion);
  await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(allQuestions));

  return newQuestion;
}

export async function incrementQuestionViews(questionId: string): Promise<void> {
  // if (USE_FIREBASE) {
  //   return await incrementViewsInFirebase(questionId);
  // }
  
  const allQuestions = await getAllQuestions();
  const question = allQuestions.find(q => q.id === questionId);
  
  if (question) {
    question.stats.views++;
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(allQuestions));
  }
}

export async function markAsHelpful(questionId: string, helpful: boolean): Promise<void> {
  // if (USE_FIREBASE) {
  //   return await markAsHelpfulInFirebase(questionId, helpful);
  // }
  
  const allQuestions = await getAllQuestions();
  const question = allQuestions.find(q => q.id === questionId);
  
  if (question) {
    if (helpful) {
      question.stats.helpful++;
    } else {
      question.stats.notHelpful++;
    }
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(allQuestions));
  }
}

export async function addAnswer(
  questionId: string,
  answer: Answer
): Promise<void> {
  // if (USE_FIREBASE) {
  //   return await addAnswerToFirebase(questionId, answer);
  // }
  
  const allQuestions = await getAllQuestions();
  const question = allQuestions.find(q => q.id === questionId);
  
  if (question) {
    question.answer = answer;
    question.status = answer.source === 'rabbi' ? 'rabbi_answered' : 'ai_answered';
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(allQuestions));
  }
}

export async function addApproval(
  questionId: string,
  approval: Approval
): Promise<void> {
  // if (USE_FIREBASE) {
  //   return await addApprovalToFirebase(questionId, approval);
  // }
  
  const allQuestions = await getAllQuestions();
  const question = allQuestions.find(q => q.id === questionId);
  
  if (question && question.answer) {
    question.answer.approvals.push(approval);
    question.answer.isVerified = true;
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(allQuestions));
  }
}

export async function getPopularQuestions(limitCount: number = 10): Promise<Question[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions
    .filter(q => q.answer)
    .sort((a, b) => b.stats.views - a.stats.views)
    .slice(0, limitCount);
}

export async function getRecentQuestions(limitCount: number = 10): Promise<Question[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limitCount);
}

export async function getUnansweredQuestions(): Promise<Question[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions.filter(q => !q.answer);
}

export function calculateTrustScore(question: Question): number {
  if (!question.answer) return 0;
  
  const { isVerified, approvals } = question.answer;
  const { helpful, notHelpful } = question.stats;
  
  let score = 0;
  
  if (isVerified) {
    score += 90;
  }
  
  const APPROVAL_WEIGHTS: Record<string, number> = {
    user: 1,
    experienced: 3,
    scholar: 10,
    rabbi: 50,
    chief_rabbi: 100
  };
  
  const approvalScore = approvals.reduce((sum, approval) => {
    return sum + (APPROVAL_WEIGHTS[approval.level] || 0);
  }, 0);
  
  score += Math.min(approvalScore / 2, 10);
  
  const totalFeedback = helpful + notHelpful;
  if (totalFeedback > 0) {
    const feedbackRatio = helpful / totalFeedback;
    score = Math.round(score * feedbackRatio);
  }
  
  return Math.min(Math.round(score), 100);
}

/**
 * MIGRATION FUNCTION
 * Call this once to migrate from AsyncStorage to Firebase
 */
export async function migrateToFirebase(): Promise<void> {
  console.log('🔄 Starting migration to Firebase...');
  
  try {
    const localQuestions = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!localQuestions) {
      console.log('✅ No local questions to migrate');
      return;
    }
    
    const questions: Question[] = JSON.parse(localQuestions);
    console.log(`📊 Found ${questions.length} questions to migrate`);
    
    // TODO: Uncomment after Firebase setup
    /*
    const batch = [];
    for (const question of questions) {
      const { id, ...questionData } = question;
      const questionRef = collection(db, 'questions');
      batch.push(addDoc(questionRef, questionData));
    }
    
    await Promise.all(batch);
    console.log('✅ Migration completed!');
    */
    
    console.log('⚠️ Firebase not configured yet. Please setup Firebase first.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}
