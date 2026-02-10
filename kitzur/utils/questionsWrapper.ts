/**
 * Questions Manager Wrapper (Firebase-only v1)
 */
import * as FirebaseQuestions from './questionsFirebase';
import type { Question, QuestionCategory, QuestionCreateResult } from '@/types/questions';

export async function getAllQuestions(): Promise<Question[]> {
  return FirebaseQuestions.getAllQuestions();
}

export function subscribeToQuestions(
  callback: (questions: Question[]) => void
): () => void {
  return FirebaseQuestions.subscribeToQuestions(callback);
}

export async function askQuestion(
  questionText: string,
  category: QuestionCategory,
  userId: string,
  userName: string,
  isPrivate: boolean,
  anonSessionId?: string
): Promise<QuestionCreateResult> {
  return FirebaseQuestions.askQuestion(
    questionText,
    category,
    userId,
    userName,
    isPrivate,
    anonSessionId
  );
}

export const getApprovedAnswer = FirebaseQuestions.getApprovedAnswer;
export const submitAnswerProposal = FirebaseQuestions.submitAnswerProposal;
export const incrementQuestionViews = FirebaseQuestions.incrementViews;

export function calculateTrustScore(_question?: Question) {
  return 0;
}

export async function markAsHelpful(
  _questionId: string,
  _isHelpful: boolean,
  _userId: string,
  _previousRating: boolean | null
) {
  return;
}

export async function removeRating(
  _questionId: string,
  _userId: string,
  _previousRating: boolean | null
) {
  return;
}

export async function getUserRating(
  _questionId: string,
  _userId: string
): Promise<boolean | null> {
  return null;
}

export async function getUnansweredQuestions(): Promise<Question[]> {
  const all = await getAllQuestions();
  return all.filter((q) => !q.answer);
}

export async function getPopularQuestions(limit = 5): Promise<Question[]> {
  const all = await getAllQuestions();
  return all
    .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
    .slice(0, limit);
}
