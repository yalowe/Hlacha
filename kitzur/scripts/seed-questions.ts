/**
 * Seed Questions Database with Sample Data
 * Run this to populate the app with example questions for testing
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Question } from '@/types/questions';

const sampleQuestions: Question[] = [
  {
    id: 'q_sample_1',
    question: 'האם מותר להשתמש בטלפון בשבת לצורך רפואי?',
    category: 'shabbat',
    tags: ['טלפון', 'רפואה', 'פיקוח נפש'],
    askedBy: 'user_demo',
    timestamp: Date.now() - 86400000 * 2,
    status: 'verified',
    moderationStatus: 'approved',
    minimumApprovalsRequired: 5,
    isPrivate: false,
    relatedQuestions: [],
    stats: {
      views: 45,
      helpful: 12,
      notHelpful: 2,
      shares: 3,
    },
    answer: {
      text: 'בפיקוח נפש - מותר להשתמש בטלפון בשבת. כשיש ספק של חולה שיש בו סכנה, יש להתקשר מיד לרופא או למגן דוד אדום. שבת נדחית מפני פיקוח נפש.',
      source: 'rabbi',
      authorId: 'rabbi_demo',
      authorName: 'הרב דמו',
      authorRole: 'rabbi',
      answeredAt: Date.now() - 86400000,
      sources: [
        {
          book: 'שולחן ערוך - או"ח',
          siman: '328',
          seif: 'ב',
          quote: 'חולה שיש בו סכנה - דוחין עליו את השבת',
        },
      ],
      approvals: [],
      isVerified: true,
      totalApprovalWeight: 0,
    },
  },
  {
    id: 'q_sample_2',
    question: 'איזה ברכה מברכים על פיצה?',
    category: 'brachot',
    tags: ['ברכות', 'מזונות', 'פיצה'],
    askedBy: 'user_demo_2',
    timestamp: Date.now() - 86400000 * 3,
    status: 'verified',
    moderationStatus: 'approved',
    minimumApprovalsRequired: 5,
    isPrivate: false,
    relatedQuestions: [],
    stats: {
      views: 89,
      helpful: 25,
      notHelpful: 1,
      shares: 8,
    },
    answer: {
      text: 'על פיצה מברכים "מזונות" לפני האכילה ו"על המחיה" (מעין שלוש) לאחר האכילה. אם אכל כזית בתוך כדי אכילת פרס (4-9 דקות), צריך לברך.',
      source: 'rabbi',
      authorId: 'rabbi_demo',
      authorName: 'הרב דמו',
      authorRole: 'rabbi',
      answeredAt: Date.now() - 86400000 * 2,
      sources: [
        {
          book: 'שולחן ערוך - או"ח',
          siman: '168',
          seif: 'ו',
          quote: 'פת הבאה בכיסנין - ברכתה מזונות',
        },
      ],
      approvals: [],
      isVerified: true,
      totalApprovalWeight: 0,
    },
  },
  {
    id: 'q_sample_3',
    question: 'מה זמן הדלקת נרות שבת?',
    category: 'shabbat',
    tags: ['נרות שבת', 'זמנים', 'הדלקה'],
    askedBy: 'user_demo_3',
    timestamp: Date.now() - 86400000,
    status: 'rabbi_answered',
    moderationStatus: 'approved',
    minimumApprovalsRequired: 5,
    isPrivate: false,
    relatedQuestions: [],
    stats: {
      views: 67,
      helpful: 18,
      notHelpful: 0,
      shares: 5,
    },
    answer: {
      text: 'מדליקים נרות שבת 18 דקות לפני שקיעת החמה. בירושלים מדליקים 40 דקות לפני השקיעה. יש להקפיד להדליק לפני הזמן הזה ולא לאחר כניסת השבת.',
      source: 'rabbi',
      authorId: 'rabbi_demo_2',
      authorName: 'הרב דמו 2',
      authorRole: 'rabbi',
      answeredAt: Date.now() - 3600000 * 12,
      sources: [
        {
          book: 'שולחן ערוך - או"ח',
          siman: '263',
          seif: 'א',
          quote: 'מדליקין בין השמשות קודם שקיעת החמה',
        },
      ],
      approvals: [],
      isVerified: true,
      totalApprovalWeight: 0,
    },
  },
  {
    id: 'q_sample_4',
    question: 'האם צריך לעמוד בשמיעת קדיש?',
    category: 'tefillah',
    tags: ['קדיש', 'תפילה', 'מנהג'],
    askedBy: 'user_demo_4',
    timestamp: Date.now() - 3600000 * 18,
    status: 'verified',
    moderationStatus: 'approved',
    minimumApprovalsRequired: 5,
    isPrivate: false,
    relatedQuestions: [],
    stats: {
      views: 34,
      helpful: 9,
      notHelpful: 1,
      shares: 2,
    },
    answer: {
      text: 'כן, המנהג לעמוד בשמיעת קדיש. וכן יש לענות "אמן יהא שמיה רבא" בכוונה גדולה. זה מנהג קדום ומובא בפוסקים.',
      source: 'rabbi',
      authorId: 'rabbi_demo',
      authorName: 'הרב דמו',
      authorRole: 'rabbi',
      answeredAt: Date.now() - 3600000 * 12,
      sources: [
        {
          book: 'שולחן ערוך - או"ח',
          siman: '56',
          seif: 'א',
          quote: 'יעמוד בקדיש ויענה אמן יהא שמיה רבא',
        },
      ],
      approvals: [],
      isVerified: true,
      totalApprovalWeight: 0,
    },
  },
  {
    id: 'q_sample_5',
    question: 'האם אפשר לאכול בשרי בכלי חלבי אחרי הדחה?',
    category: 'kashrut',
    tags: ['בשר וחלב', 'כלים', 'הגעלה'],
    askedBy: 'user_demo_5',
    timestamp: Date.now() - 3600000 * 6,
    status: 'pending',
    moderationStatus: 'pending',
    minimumApprovalsRequired: 5,
    isPrivate: false,
    relatedQuestions: [],
    stats: {
      views: 23,
      helpful: 5,
      notHelpful: 2,
      shares: 0,
    },
  },
  {
    id: 'q_sample_6',
    question: 'כמה זמן צריך להמתין בין בשר לחלב?',
    category: 'kashrut',
    tags: ['בשר וחלב', 'המתנה', 'זמנים'],
    askedBy: 'user_demo_6',
    timestamp: Date.now() - 3600000 * 3,
    status: 'rabbi_answered',
    moderationStatus: 'pending',
    minimumApprovalsRequired: 5,
    isPrivate: false,
    relatedQuestions: [],
    stats: {
      views: 12,
      helpful: 3,
      notHelpful: 0,
      shares: 1,
    },
    answer: {
      text: 'המנהג לחכות 6 שעות בין בשר לחלב. יש מקומות שנוהגים 3 שעות או שעה אחת, לפי מנהג אבותיהם. בין חלב לבשר די להדיח הפה ולאכול משהו.',
      source: 'rabbi',
      authorId: 'rabbi_demo_3',
      authorName: 'הרב דמו 3',
      authorRole: 'rabbi',
      answeredAt: Date.now() - 3600000,
      sources: [
        {
          book: 'שולחן ערוך - יו"ד',
          siman: '89',
          seif: 'א',
          quote: 'אחר בשר צריך להמתין שש שעות',
        },
      ],
      approvals: [],
      isVerified: false,
      totalApprovalWeight: 0,
    },
  },
];

export async function seedQuestions() {
  try {
    console.log('🌱 Seeding questions database...');
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(
      '@kitzur_questions',
      JSON.stringify(sampleQuestions)
    );
    
    console.log(`✅ Successfully seeded ${sampleQuestions.length} questions!`);
    console.log('   - 4 answered questions');
    console.log('   - 1 pending answer');
    console.log('   - 1 with unapproved answer');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to seed questions:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  seedQuestions();
}
