/**
 * Types for Questions & Answers System
 */

export type QuestionCategory = 'tefillah' | 'shabbat' | 'kashrut' | 'brachot' | 'holidays' | 'taharat' | 'tzedakah' | 'mourning' | 'study' | 'interpersonal' | 'medical' | 'travel' | 'work' | 'conversion' | 'marriage' | 'divorce' | 'inheritance' | 'vows' | 'temple' | 'other';

export type QuestionStatus = 'pending_review' | 'approved' | 'locked' | 'rejected';
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type AnswerStatus = 'draft' | 'approved' | 'locked';
export type Visibility = 'public' | 'private';

type AnswerSource = 'rabbi' | 'book' | 'community' | 'system';

type ApprovalLevel = 'user' | 'experienced' | 'scholar' | 'rabbi' | 'chief_rabbi';

type UserRole = 'anonymous' | 'registered' | 'trusted' | 'scholar' | 'rabbi' | 'moderator' | 'superadmin';

export interface HalachicSource {
  book: string;           // שם הספר
  siman: string;          // סימן
  seif?: string;          // סעיף
  page?: number;          // עמוד
  edition?: string;       // מהדורה
  quote?: string;         // ציטוט מדויק
  inAppLink?: string;     // לינק לתוך האפליקציה
}

interface Approval {
  userId: string;
  userName: string;
  level: ApprovalLevel;
  userRole: UserRole;         // תפקיד המאשר
  timestamp: number;
  comment?: string;
  weight: number;             // משקל האישור
}

export interface Answer {
  text: string;
  source: AnswerSource;
  status?: AnswerStatus;
  authorId?: string;          // מי כתב את התשובה
  authorName?: string;
  authorRole?: UserRole;      // תפקיד מחבר התשובה
  rabbiName?: string;
  rabbiTitle?: string;
  answeredAt: number;
  approvedAt?: number;
  sources?: HalachicSource[];
  approvals?: Approval[];
  isVerified: boolean;        // האם אושר על ידי רב
  totalApprovalWeight: number; // סכום משקלים של אישורים
  editHistory?: {
    editedBy: string;
    editedByRole: UserRole;
    editedAt: number;
    previousText: string;
    reason?: string;
  }[];                        // היסטוריית עריכות
}

interface QuestionStats {
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
  status: QuestionStatus;
  moderationStatus: ModerationStatus; // סטטוס אישור
  minimumApprovalsRequired: number;  // כמה אישורים נדרשים (ברירת מחדל: 5)
  stats: QuestionStats;
  tags: string[];
  relatedQuestions: string[]; // IDs של שאלות קשורות
  isPrivate: boolean;         // האם פרטית או קהילתית
  visibility?: Visibility;
  slug?: string;
}

export type QuestionCreateResult = {
  id: string;
  slug: string | null;
  status: QuestionStatus;
  moderationStatus: ModerationStatus;
  visibility: Visibility;
};

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

export const APPROVAL_LABELS: Record<ApprovalLevel, string> = {
  user: 'משתמש',
  experienced: 'משתמש מנוסה',
  scholar: 'תלמיד חכם',
  rabbi: 'רב מוסמך',
  chief_rabbi: 'רב מכריע'
};
