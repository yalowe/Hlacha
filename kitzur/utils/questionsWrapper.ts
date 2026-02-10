/**
 * Questions Manager Wrapper
 * Automatically uses Firebase if connected, falls back to local storage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/config/firebase';
import * as FirebaseQuestions from './questionsFirebase';
import * as LocalQuestions from './questionsManager';
import type { Question } from '@/types/questions';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return db !== null && db !== undefined;
};

// Get all questions (auto-switches between Firebase and local)
export async function getAllQuestions(): Promise<Question[]> {
  if (isFirebaseConfigured()) {
    try {
      return await FirebaseQuestions.getAllQuestions();
    } catch (error) {
      console.warn('Firebase failed, falling back to local storage:', error);
      return await LocalQuestions.getAllQuestions();
    }
  }
  return await LocalQuestions.getAllQuestions();
}

// Subscribe to questions in real-time (Firebase only)
export function subscribeToQuestions(
  callback: (questions: Question[]) => void
): () => void {
  if (isFirebaseConfigured()) {
    try {
      return FirebaseQuestions.subscribeToQuestions(callback);
    } catch (error) {
      console.warn('Firebase subscription failed:', error);
      // Fall back to polling local storage
      const interval = setInterval(async () => {
        const questions = await LocalQuestions.getAllQuestions();
        callback(questions);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }
  
  // Local storage polling fallback
  const interval = setInterval(async () => {
    const questions = await LocalQuestions.getAllQuestions();
    callback(questions);
  }, 3000);
  
  return () => clearInterval(interval);
}

// Ask a question
export async function askQuestion(question: Omit<Question, 'id'>): Promise<string> {
  if (isFirebaseConfigured()) {
    try {
      return await FirebaseQuestions.askQuestion(question);
    } catch (error) {
      console.warn('Firebase failed, saving locally:', error);
      // Fallback to local storage
      const questions = await LocalQuestions.getAllQuestions();
      const newId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newQuestion: Question = { ...question, id: newId };
      questions.push(newQuestion);
      await AsyncStorage.setItem('@kitzur_questions', JSON.stringify(questions));
      return newId;
    }
  }
  
  // Local storage
  const questions = await LocalQuestions.getAllQuestions();
  const newId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newQuestion: Question = { ...question, id: newId };
  questions.push(newQuestion);
  await AsyncStorage.setItem('@kitzur_questions', JSON.stringify(questions));
  return newId;
}

// Migrate local data to Firebase
export async function migrateToFirebase(): Promise<{success: boolean, message: string}> {
  if (!isFirebaseConfigured()) {
    return { success: false, message: 'Firebase לא מוגדר' };
  }
  
  try {
    const localQuestions = await LocalQuestions.getAllQuestions();
    
    if (localQuestions.length === 0) {
      return { success: true, message: 'אין שאלות מקומיות להעברה' };
    }
    
    await FirebaseQuestions.migrateLocalToFirebase(localQuestions);
    
    return {
      success: true,
      message: `${localQuestions.length} שאלות הועברו בהצלחה לענן! 🎉`
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'שגיאה לא ידועה'
    };
  }
}

// Check Firebase status
export function getFirebaseStatus(): {
  configured: boolean;
  message: string;
} {
  const configured = isFirebaseConfigured();
  return {
    configured,
    message: configured 
      ? '✅ Firebase מחובר - שאלות מסונכרנות בענן'
      : '⚠️ Firebase לא מוגדר - שאלות נשמרות מקומית בלבד'
  };
}

// Re-export other functions from questionsManager (these work the same way)
export {
  getUnansweredQuestions,
  getPopularQuestions,
  calculateTrustScore,
  incrementQuestionViews,
  markAsHelpful,
  removeRating,
  getUserRating
} from './questionsManager';

// Re-export answerQuestion from questionsFirebase if Firebase is configured
export { answerQuestion } from './questionsFirebase';
