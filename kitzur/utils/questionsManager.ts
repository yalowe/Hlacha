/**
 * Questions & Answers Manager
 * Manages the community Q&A system
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Question, QuestionCategory, Answer, Approval } from '@/types/questions';

const STORAGE_KEYS = {
  QUESTIONS: '@kitzur_questions',
  MY_QUESTIONS: '@kitzur_my_questions',
  QUESTION_DRAFTS: '@kitzur_question_drafts',
};

// Generate unique ID
function generateId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get all questions (community database)
export async function getAllQuestions(): Promise<Question[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get questions:', error);
    return [];
  }
}

// Get questions by category
export async function getQuestionsByCategory(category: QuestionCategory): Promise<Question[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions.filter(q => q.category === category);
}

// Get my questions
export async function getMyQuestions(userId: string): Promise<Question[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions.filter(q => q.askedBy === userId);
}

// Search questions
export async function searchQuestions(query: string): Promise<Question[]> {
  if (!query.trim()) return [];
  
  const allQuestions = await getAllQuestions();
  
  return allQuestions.filter(q => 
    q.question.includes(query) ||
    q.tags.some(tag => tag.includes(query)) ||
    q.answer?.text.includes(query)
  ).sort((a, b) => {
    // Sort by relevance (exact match first, then by views)
    const aExact = a.question.includes(query) ? 1 : 0;
    const bExact = b.question.includes(query) ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;
    return b.stats.views - a.stats.views;
  });
}

// Get question by ID
export async function getQuestionById(id: string): Promise<Question | null> {
  const allQuestions = await getAllQuestions();
  return allQuestions.find(q => q.id === id) || null;
}

// Ask new question
export async function askQuestion(
  question: string,
  category: QuestionCategory,
  userId: string,
  userName: string,
  isPrivate: boolean = false
): Promise<Question> {
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

  // Save to database
  const allQuestions = await getAllQuestions();
  allQuestions.unshift(newQuestion); // Add to beginning
  await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(allQuestions));

  return newQuestion;
}

// Extract tags from question (simple implementation)
function extractTags(question: string): string[] {
  const commonWords = ['האם', 'מה', 'איך', 'למה', 'מתי', 'איפה', 'כמה'];
  const words = question.split(/\s+/)
    .filter(w => w.length > 2 && !commonWords.includes(w))
    .slice(0, 5);
  return words;
}

// Update question views
export async function incrementQuestionViews(questionId: string): Promise<void> {
  const allQuestions = await getAllQuestions();
  const question = allQuestions.find(q => q.id === questionId);
  
  if (question) {
    question.stats.views++;
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(allQuestions));
  }
}

// Mark as helpful
export async function markAsHelpful(questionId: string, helpful: boolean): Promise<void> {
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

// Add answer to question
export async function addAnswer(
  questionId: string,
  answer: Answer
): Promise<void> {
  const allQuestions = await getAllQuestions();
  const question = allQuestions.find(q => q.id === questionId);
  
  if (question) {
    question.answer = answer;
    question.status = answer.source === 'rabbi' ? 'rabbi_answered' : 'ai_answered';
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(allQuestions));
  }
}

// Add approval
export async function addApproval(
  questionId: string,
  approval: Approval
): Promise<void> {
  const allQuestions = await getAllQuestions();
  const question = allQuestions.find(q => q.id === questionId);
  
  if (question && question.answer) {
    // Check if user already approved
    const existingApproval = question.answer.approvals.findIndex(
      a => a.userId === approval.userId
    );
    
    if (existingApproval >= 0) {
      question.answer.approvals[existingApproval] = approval;
    } else {
      question.answer.approvals.push(approval);
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(allQuestions));
  }
}

// Calculate trust score (0-100)
export function calculateTrustScore(question: Question): number {
  if (!question.answer) return 0;
  
  const { approvals, isVerified } = question.answer;
  
  // Base score
  let score = 0;
  
  // Verified by rabbi = automatic 90
  if (isVerified) {
    score = 90;
  }
  
  // Add approval weights
  const approvalScore = approvals.reduce((sum, approval) => {
    return sum + (APPROVAL_WEIGHTS[approval.level] || 0);
  }, 0);
  
  // Normalize to 0-100
  score += Math.min(approvalScore / 2, 10);
  
  // Community feedback
  const { helpful, notHelpful } = question.stats;
  const total = helpful + notHelpful;
  if (total > 0) {
    const positiveRatio = helpful / total;
    score = score * positiveRatio;
  }
  
  return Math.min(Math.round(score), 100);
}

// Get popular questions
export async function getPopularQuestions(limit: number = 10): Promise<Question[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions
    .filter(q => q.answer && !q.isPrivate)
    .sort((a, b) => b.stats.views - a.stats.views)
    .slice(0, limit);
}

// Get recent questions
export async function getRecentQuestions(limit: number = 10): Promise<Question[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions
    .filter(q => !q.isPrivate)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

// Get unanswered questions (for rabbi panel)
export async function getUnansweredQuestions(): Promise<Question[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions
    .filter(q => !q.answer && !q.isPrivate)
    .sort((a, b) => a.timestamp - b.timestamp);
}

import { APPROVAL_WEIGHTS } from '@/types/questions';
