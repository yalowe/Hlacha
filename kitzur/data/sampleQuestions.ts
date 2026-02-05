/**
 * Sample Questions Data
 * Pre-populated questions for testing the Q&A system
 */
import { 
  askQuestion, 
  addAnswer, 
  addApproval,
  incrementQuestionViews,
  markAsHelpful
} from '@/utils/questionsManager';
import type { HalachicSource, Answer, Approval } from '@/types/questions';

export async function initializeSampleData() {
  try {
    // Question 1: Shabbat candles
    const q1 = await askQuestion(
      'האם אפשר להדליק נרות שבת בזמן שיש עוד אור יום, או שצריך לחכות לשקיעה?',
      'shabbat',
      'system',
      'מנהל מערכת',
      false
    );
    
    const sources1: HalachicSource[] = [
      {
        book: 'שולחן ערוך אורח חיים',
        siman: 'רסג',
        seif: 'י',
        inAppLink: '/chapter/kitzur_orach_chaim-075'
      }
    ];
    
    const answer1: Answer = {
      text: 'מצוה להדליק נרות שבת לפני שקיעת החמה. הזמן המובחר הוא מכעשרים דקות לפני השקיעה. הטעם הוא שחלק מהפוסקים סוברים שצריך לקבל שבת מוקדם יותר, ומכל מקום אסור להדליק אחרי השקיעה מדרבנן. נשים נהגו להדליק בערך 18 דקות לפני השקיעה בירושלים, ו-40 דקות במקומות אחרים. אם שכחה להדליק לפני השקיעה - אסור להדליק אחרי הכניסה.',
      source: 'rabbi',
      rabbiName: 'הרב דוד לוי',
      answeredAt: Date.now(),
      sources: sources1,
      approvals: [],
      isVerified: true
    };
    
    await addAnswer(q1.id, answer1);
    
    const approval1a: Approval = {
      userId: 'rabbi1',
      userName: 'הרב דוד לוי',
      level: 'rabbi',
      timestamp: Date.now()
    };
    
    const approval1b: Approval = {
      userId: 'scholar1',
      userName: 'הרב משה כהן',
      level: 'scholar',
      timestamp: Date.now()
    };
    
    await addApproval(q1.id, approval1a);
    await addApproval(q1.id, approval1b);
    await incrementQuestionViews(q1.id);
    await incrementQuestionViews(q1.id);
    await incrementQuestionViews(q1.id);
    await markAsHelpful(q1.id, true);
    await markAsHelpful(q1.id, true);

    // Question 2: Bracha on cake
    const q2 = await askQuestion(
      'מה הברכה על עוגה - המוציא או מזונות? ומה אם אכלתי הרבה?',
      'brachot',
      'system',
      'מנהל מערכת',
      false
    );
    
    const sources2: HalachicSource[] = [
      {
        book: 'שולחן ערוך אורח חיים',
        siman: 'קסח',
        seif: 'ו',
      },
      {
        book: 'משנה ברורה',
        siman: 'קסח',
        seif: 'כד',
      }
    ];
    
    const answer2: Answer = {
      text: 'הברכה על עוגה היא "מזונות". אבל יש כמה פרטים חשובים:\n\n1. אם העוגה נעשתה לשם סעודה (פת הבאה בכיסנין) - מברכים "מזונות" ו"על המחיה".\n\n2. אם אכל כשיעור קביעות סעודה (168 גרם ולמעלה לדעת חלק מהפוסקים, או יותר לפי דעות אחרות) - צריך לברך "המוציא" לכתחילה ולאכול בסעודה עם לחם.\n\n3. אם אכל הרבה עוגה ושבע ממנה - יש מחלוקת אם צריך לברך ברכת המזון או על המחיה. לכתחילה טוב לאכול קצת לחם כדי לצאת ידי חובה לכל הדעות.\n\nהמלצה מעשית: אם רוצה לאכול הרבה עוגה - כדאי לאכול קודם כזית פת ולברך המוציא.',
      source: 'rabbi',
      rabbiName: 'הרב יצחק אברהם',
      answeredAt: Date.now(),
      sources: sources2,
      approvals: [],
      isVerified: true
    };
    
    await addAnswer(q2.id, answer2);
    
    await addApproval(q2.id, {
      userId: 'rabbi2',
      userName: 'הרב יצחק אברהם',
      level: 'rabbi',
      timestamp: Date.now()
    });
    await incrementQuestionViews(q2.id);
    await markAsHelpful(q2.id, true);

    // Question 3: Tefillah while traveling
    const q3 = await askQuestion(
      'אם אני בטיול ארוך ומגיע זמן תפילה, איך אני מתפלל במכונית או באוטובוס?',
      'tefillah',
      'system',
      'מנהל מערכת',
      false
    );
    
    const sources3: HalachicSource[] = [
      {
        book: 'שולחן ערוך אורח חיים',
        siman: 'צד',
        seif: 'ה',
      }
    ];
    
    const answer3: Answer = {
      text: 'כשמתפללים בזמן נסיעה יש כמה דינים:\n\n1. תפילת שמונה עשרה: אם אפשר לעצור ולהתפלל בעמידה - זה עדיף. אם אי אפשר - מותר להתפלל בישיבה במקומו.\n\n2. כיוון: צריך לכוון למזרח (לירושלים) בשעת התפילה. אם הרכב זז ומסתובב - כוונן בתחילת התפילה למזרח ואח"כ אפשר להמשיך גם אם הכיוון השתנה.\n\n3. עמידה: אם יכול לעמוד בבטחה - רצוי. אם לא - מותר לשבת.\n\n4. קדושה וקדיש: אם מתפלל עם מניין באוטובוס - עדיף לעמוד. אם לא יכול - יכול לענות בישיבה.\n\n5. קריאת שמע: קריאת שמע אפשר לומר בישיבה גם לכתחילה.',
      source: 'rabbi',
      rabbiName: 'הרב שמואל גולדשטיין',
      answeredAt: Date.now(),
      sources: sources3,
      approvals: [],
      isVerified: true
    };
    
    await addAnswer(q3.id, answer3);
    
    await addApproval(q3.id, {
      userId: 'rabbi3',
      userName: 'הרב שמואל גולדשטיין',
      level: 'rabbi',
      timestamp: Date.now()
    });
    await addApproval(q3.id, {
      userId: 'scholar2',
      userName: 'הרב אברהם שפירא',
      level: 'scholar',
      timestamp: Date.now()
    });
    await incrementQuestionViews(q3.id);
    await incrementQuestionViews(q3.id);

    // Question 4: Kashrut - waiting between meat and milk
    const q4 = await askQuestion(
      'כמה זמן צריך לחכות בין אכילת בשר לחלב? ומה אם רק טעמתי קצת בשר?',
      'kashrut',
      'system',
      'מנהל מערכת',
      false
    );
    
    const sources4: HalachicSource[] = [
      {
        book: 'שולחן ערוך יורה דעה',
        siman: 'פט',
        seif: 'א',
      }
    ];
    
    const answer4: Answer = {
      text: 'המנהג הרווח הוא לחכות 6 שעות בין בשר לחלב. יש כמה נקודות חשובות:\n\n1. זמן ההמתנה: \n   - מנהג הולנד וגרמניה: 3 שעות\n   - מנהג רוב האשכנזים: 6 שעות\n   - יש הממתינים 5 שעות\n\n2. מה נחשב "אכילת בשר":\n   - אפילו אכל רק מעט בשר - צריך להמתין\n   - אם רק טעם ופלט מיד - יש מחלוקת, אבל רוב הפוסקים מחמירים\n\n3. לאחר המתנה צריך:\n   - לנקות את הפה (להדיח או לאכול משהו פרווה)\n   - לבדוק שאין שאריות בשר בין השיניים\n\n4. מקרים מיוחדים:\n   - ילדים קטנים - יש להקל יותר לפי הצורך\n   - חולה או מצב דחק - יש להתייעץ עם רב\n\nאם יש ספק - כדאי לשאול רב מורה הוראה מוסמך.',
      source: 'rabbi',
      rabbiName: 'הרב ראשי יוסף דוד',
      answeredAt: Date.now(),
      sources: sources4,
      approvals: [],
      isVerified: true
    };
    
    await addAnswer(q4.id, answer4);
    
    await addApproval(q4.id, {
      userId: 'chief_rabbi1',
      userName: 'הרב ראשי יוסף דוד',
      level: 'chief_rabbi',
      timestamp: Date.now()
    });
    await addApproval(q4.id, {
      userId: 'rabbi4',
      userName: 'הרב חיים קלמן',
      level: 'rabbi',
      timestamp: Date.now()
    });
    await incrementQuestionViews(q4.id);
    await incrementQuestionViews(q4.id);
    await incrementQuestionViews(q4.id);
    await incrementQuestionViews(q4.id);
    await markAsHelpful(q4.id, true);
    await markAsHelpful(q4.id, true);
    await markAsHelpful(q4.id, true);

    // Question 5: Unanswered question
    const q5 = await askQuestion(
      'האם מותר להשתמש במכשיר חשמלי שיש בו שעון שבת בשבת, אם זה נדלק ונכבה מאליו?',
      'shabbat',
      'user123',
      'דוד כהן',
      false
    );
    await incrementQuestionViews(q5.id);

    // Question 6: Holidays - Chanukah candles
    const q6 = await askQuestion(
      'אם יצאתי מהבית מיד אחרי הדלקת נרות חנוכה, האם יצאתי ידי חובה?',
      'holidays',
      'system',
      'מנהל מערכת',
      false
    );
    
    const sources6: HalachicSource[] = [
      {
        book: 'שולחן ערוך אורח חיים',
        siman: 'תרעב',
        seif: 'ח',
      }
    ];
    
    const answer6: Answer = {
      text: 'לאחר הדלקת נרות חנוכה צריך להמתין לפחות חצי שעה ליד הנרות. הטעם הוא שמצות נר חנוכה היא "נר איש וביתו" - שיהיו הנרות דולקים בזמן שבני הבית נמצאים בבית.\n\nפרטי הדינים:\n\n1. זמן ההמתנה: חצי שעה מזמן ההדלקה (לא מזמן צאת הכוכבים). אם הדליק בזמן - די בחצי שעה. אם הדליק מאוחר - צריך להמתין עד שיעבור זמן שהיו יכולים לעבור שם אנשים (בערך חצי שעה).\n\n2. אם יצא מיד: בדיעבד אם הניח דולק כמות שמן או נר לחצי שעה - יצא ידי חובה, אבל לכתחילה צריך להישאר בבית.\n\n3. אם צריך לצאת: טוב שיהיה מישהו מבני הבית שנשאר בבית בזמן שהנרות דולקים.\n\n4. במקום פרסום ניסא: אם הדליק בחלון הפתוח לרשות הרבים - יש מקום להקל יותר.',
      source: 'rabbi',
      rabbiName: 'הרב משה הלוי',
      answeredAt: Date.now(),
      sources: sources6,
      approvals: [],
      isVerified: true
    };
    
    await addAnswer(q6.id, answer6);
    
    await addApproval(q6.id, {
      userId: 'rabbi5',
      userName: 'הרב משה הלוי',
      level: 'rabbi',
      timestamp: Date.now()
    });
    await incrementQuestionViews(q6.id);
    await markAsHelpful(q6.id, true);

    console.log('✅ Sample questions initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize sample data:', error);
    return false;
  }
}
