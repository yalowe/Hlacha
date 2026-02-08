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

// תפקידים במערכת - קובעים הרשאות
export type UserRole = 
  | 'anonymous'     // אנונימי - יכול לשאול שאלות בלבד
  | 'registered'    // רשום - יכול לדרג תשובות
  | 'trusted'       // אמין - יכול לאשר תשובות (5+ אישורים נדרשים)
  | 'scholar'       // תלמיד חכם - יכול לתת תשובות
  | 'rabbi'         // רב מוסמך - תשובותיו עם משקל גבוה
  | 'moderator'     // מנהל - יכול לערוך ולמחוק
  | 'superadmin';   // סופר אדמין - מלא הרשאות

// הרשאות ספציפיות
export interface UserPermissions {
  canAskQuestions: boolean;       // לשאול שאלות
  canAnswerQuestions: boolean;    // לתת תשובות
  canApproveAnswers: boolean;     // לאשר תשובות
  canEditAnswers: boolean;        // לערוך תשובות
  canDeleteContent: boolean;      // למחוק תוכן
  canManageUsers: boolean;        // לנהל משתמשים
  canGrantSuperAdmin: boolean;    // לתת הרשאות SuperAdmin
  canViewAnalytics: boolean;      // לצפות בסטטיסטיקות
  approvalWeight: number;         // משקל האישור
}

// הגדרת הרשאות לפי תפקיד
export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  anonymous: {
    canAskQuestions: true,
    canAnswerQuestions: false,
    canApproveAnswers: false,
    canEditAnswers: false,
    canDeleteContent: false,
    canManageUsers: false,
    canGrantSuperAdmin: false,
    canViewAnalytics: false,
    approvalWeight: 0
  },
  registered: {
    canAskQuestions: true,
    canAnswerQuestions: false,
    canApproveAnswers: false,
    canEditAnswers: false,
    canDeleteContent: false,
    canManageUsers: false,
    canGrantSuperAdmin: false,
    canViewAnalytics: false,
    approvalWeight: 1
  },
  trusted: {
    canAskQuestions: true,
    canAnswerQuestions: false,
    canApproveAnswers: true,
    canEditAnswers: false,
    canDeleteContent: false,
    canManageUsers: false,
    canGrantSuperAdmin: false,
    canViewAnalytics: false,
    approvalWeight: 5
  },
  scholar: {
    canAskQuestions: true,
    canAnswerQuestions: true,
    canApproveAnswers: true,
    canEditAnswers: false,
    canDeleteContent: false,
    canManageUsers: false,
    canGrantSuperAdmin: false,
    canViewAnalytics: false,
    approvalWeight: 10
  },
  rabbi: {
    canAskQuestions: true,
    canAnswerQuestions: true,
    canApproveAnswers: true,
    canEditAnswers: false,
    canDeleteContent: false,
    canManageUsers: false,
    canGrantSuperAdmin: false,
    canViewAnalytics: true,
    approvalWeight: 50
  },
  moderator: {
    canAskQuestions: true,
    canAnswerQuestions: true,
    canApproveAnswers: true,
    canEditAnswers: true,
    canDeleteContent: true,
    canManageUsers: true,
    canGrantSuperAdmin: false,
    canViewAnalytics: true,
    approvalWeight: 25
  },
  superadmin: {
    canAskQuestions: true,
    canAnswerQuestions: true,
    canApproveAnswers: true,
    canEditAnswers: true,
    canDeleteContent: true,
    canManageUsers: true,
    canGrantSuperAdmin: true,
    canViewAnalytics: true,
    approvalWeight: 100
  }
};

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
  userRole: UserRole;         // תפקיד המאשר
  timestamp: number;
  comment?: string;
  weight: number;             // משקל האישור
}

// רשומת שינוי (Audit Log)
export interface AuditLog {
  id: string;
  action: 'create' | 'edit' | 'delete' | 'approve' | 'reject' | 'role_change';
  performedBy: string;        // userId
  performedByName: string;
  performedByRole: UserRole;
  targetType: 'question' | 'answer' | 'user';
  targetId: string;
  timestamp: number;
  changes?: Record<string, any>;  // מה השתנה
  reason?: string;            // סיבת השינוי
}

export interface Answer {
  text: string;
  source: AnswerSource;
  authorId?: string;          // מי כתב את התשובה
  authorName?: string;
  authorRole?: UserRole;      // תפקיד מחבר התשובה
  rabbiName?: string;
  rabbiTitle?: string;
  answeredAt: number;
  sources: HalachicSource[];  // חובה!
  approvals: Approval[];
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
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged'; // סטטוס אישור
  minimumApprovalsRequired: number;  // כמה אישורים נדרשים (ברירת מחדל: 5)
  stats: QuestionStats;
  tags: string[];
  relatedQuestions: string[]; // IDs של שאלות קשורות
  isPrivate: boolean;         // האם פרטית או קהילתית
}

// פרופיל משתמש
export interface UserProfile {
  userId: string;
  displayName: string;
  email?: string;
  role: UserRole;
  approvalLevel: ApprovalLevel;
  biography?: string;         // תיאור (לרבנים)
  credentials?: string[];     // תעודות הסמכה
  createdAt: number;
  stats: {
    questionsAsked: number;
    answersGiven: number;
    approvalsGiven: number;
    helpfulVotes: number;
  };
  isVerified: boolean;        // אושר על ידי מנהל
  grantedBy?: string;         // מי נתן לו את התפקיד
  grantedAt?: number;
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
