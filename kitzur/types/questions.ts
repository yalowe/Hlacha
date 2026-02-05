/**
 * Types for Questions & Answers System
 */

export type QuestionCategory = 
  | 'tefillah'      // תפילה
  | 'shabbat'       // שבת
  | 'kashrut'       // כשרות
  | 'brachot'       // ברכות
  | 'holidays'      // חגים ומועדים
  | 'taharat'       // טהרת המשפחה
  | 'tzedakah'      // צדקה ומעשרות
  | 'mourning'      // אבלות
  | 'study'         // לימוד תורה
  | 'interpersonal' // בין אדם לחברו
  | 'medical'       // רפואה ובריאות
  | 'travel'        // נסיעות
  | 'work'          // עבודה ועסקים
  | 'conversion'    // גיור
  | 'marriage'      // נישואין וחתונה
  | 'divorce'       // גירושין
  | 'inheritance'   // ירושה
  | 'vows'          // נדרים ושבועות
  | 'temple'        // בית המקדש וקרבנות
  | 'other';        // אחר

export type AnswerSource = 'ai' | 'rabbi' | 'community';

export type ApprovalLevel = 
  | 'user'          // משתמש רגיל
  | 'experienced'   // משתמש ותיק
  | 'scholar'       // תלמיד חכם
  | 'rabbi'         // רב מוסמך
  | 'chief_rabbi';  // רב מכריע

export interface HalachicSource {
  book: string;           // שם הספר
  siman: string;          // סימן
  seif?: string;          // סעיף
  page?: number;          // עמוד
  edition?: string;       // מהדורה
  quote?: string;         // ציטוט מדויק
  inAppLink?: string;     // לינק לתוך האפליקציה
}

export interface Approval {
  userId: string;
  userName: string;
  level: ApprovalLevel;
  timestamp: number;
  comment?: string;
}

export interface Answer {
  text: string;
  source: AnswerSource;
  rabbiName?: string;
  rabbiTitle?: string;
  answeredAt: number;
  sources: HalachicSource[];  // חובה!
  approvals: Approval[];
  isVerified: boolean;        // האם אושר על ידי רב
}

export interface QuestionStats {
  views: number;
  helpful: number;
  notHelpful: number;
  shares: number;
}

export interface Question {
  id: string;
  question: string;
  category: QuestionCategory;
  askedBy: string;            // userId או "anonymous"
  askedByName?: string;
  timestamp: number;
  answer?: Answer;
  status: 'pending' | 'ai_answered' | 'rabbi_answered' | 'verified';
  stats: QuestionStats;
  tags: string[];
  relatedQuestions: string[]; // IDs של שאלות קשורות
  isPrivate: boolean;         // האם פרטית או קהילתית
}

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  tefillah: 'תפילה',
  shabbat: 'שבת',
  kashrut: 'כשרות',
  brachot: 'ברכות',
  holidays: 'חגים ומועדים',
  taharat: 'טהרת המשפחה',
  tzedakah: 'צדקה ומעשרות',
  mourning: 'אבלות',
  study: 'לימוד תורה',
  interpersonal: 'בין אדם לחברו',
  medical: 'רפואה ובריאות',
  travel: 'נסיעות',
  work: 'עבודה ועסקים',
  conversion: 'גיור',
  marriage: 'נישואין',
  divorce: 'גירושין',
  inheritance: 'ירושה',
  vows: 'נדרים ושבועות',
  temple: 'בית המקדש',
  other: 'אחר'
};

export const APPROVAL_WEIGHTS: Record<ApprovalLevel, number> = {
  user: 1,
  experienced: 3,
  scholar: 10,
  rabbi: 50,
  chief_rabbi: 100
};

export const APPROVAL_LABELS: Record<ApprovalLevel, string> = {
  user: 'משתמש',
  experienced: 'משתמש מנוסה',
  scholar: 'תלמיד חכם',
  rabbi: 'רב מוסמך',
  chief_rabbi: 'רב מכריע'
};
