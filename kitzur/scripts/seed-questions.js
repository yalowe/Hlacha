/**
 * Seed sample Q&A data for testing
 * Run this in browser console on localhost:8081
 */

const sampleQuestions = [
  {
    id: "q_demo_1",
    question: "האם מותר לברך ברכת המזון בעמידה או שחייבים לשבת?",
    category: "daily_life",
    askedBy: "user_demo_1",
    askedByName: "דוד כהן",
    timestamp: Date.now() - 86400000 * 2, // לפני יומיים
    status: "answered",
    moderationStatus: "approved",
    minimumApprovalsRequired: 3,
    stats: {
      views: 245,
      helpful: 18,
      notHelpful: 2,
      shares: 5
    },
    tags: ["ברכת המזון", "הלכות ברכות", "עמידה"],
    relatedQuestions: [],
    isPrivate: false,
    answer: {
      text: "לכתחילה יש לברך ברכת המזון בישיבה, שכן זו סעודה והדרך לברך על סעודה בישיבה. אולם בדיעבד אם בירך בעמידה - יצא ידי חובה ואין צריך לחזור ולברך.",
      sources: [
        {
          book: "קיצור שולחן ערוך",
          siman: "מד",
          seif: "א",
          quote: "מצווה לברך ברכת המזון במקום שאכל, וישב בעת הברכה כדרך שישב בעת האכילה"
        },
        {
          book: "משנה ברורה",
          siman: "קפג",
          seif: "טו",
          quote: "בעמידה - אף על פי שלכתחילה צריך לישב, אם בירך בעמידה יצא"
        }
      ],
      respondedBy: "rabbi_demo_1",
      respondedByName: "הרב משה לוי",
      timestamp: Date.now() - 86400000,
      approvals: [
        {
          rabbiId: "rabbi_demo_2",
          rabbiName: "הרב יעקב כהן",
          level: "rabbi",
          timestamp: Date.now() - 43200000,
          note: "תשובה מדויקת ומקיפה"
        },
        {
          rabbiId: "rabbi_demo_3",
          rabbiName: "הרב אברהם גולדשטיין",
          level: "posek",
          timestamp: Date.now() - 36000000,
          note: "מקורות נכונים"
        },
        {
          rabbiId: "rabbi_demo_4",
          rabbiName: "הרב שמואל ברגר",
          level: "scholar",
          timestamp: Date.now() - 28800000
        }
      ],
      isVerified: true
    }
  },
  {
    id: "q_demo_2",
    question: "עד מתי אפשר להתפלל שחרית? איחרתי לבית הכנסת.",
    category: "prayer",
    askedBy: "user_demo_2",
    askedByName: "יוסף לוי",
    timestamp: Date.now() - 86400000 * 3,
    status: "answered",
    moderationStatus: "approved",
    minimumApprovalsRequired: 3,
    stats: {
      views: 412,
      helpful: 34,
      notHelpful: 1,
      shares: 12
    },
    tags: ["תפילת שחרית", "זמן תפילה", "איחור"],
    relatedQuestions: ["q_demo_3"],
    isPrivate: false,
    answer: {
      text: "זמן תפילת שחרית הוא מנץ החמה עד סוף שליש היום (בערך שעה וחצי אחרי חצות). לכתחילה יש להתפלל בוותיקין - עם הנץ החמה, או לפחות תוך שלוש שעות זמניות מהנץ החמה. בדיעבד אם לא התפלל עד חצות - יכול להתפלל עד סוף 'ארבע שעות' (שליש היום). לאחר מכן לא יתפלל עוד שחרית, אלא יתפלל תפילת מנחה פעמיים - אחת כמנחה ואחת כתשלומין של שחרית.",
      sources: [
        {
          book: "קיצור שולחן ערוך",
          siman: "יב",
          seif: "א",
          quote: "זמן תפילת שחרית הוא מהנץ החמה. ומצווה מן המובחר להתפלל בותיקין, דהיינו שיתחיל התפילה עם הנץ החמה"
        },
        {
          book: "שולחן ערוך אורח חיים",
          siman: "פט",
          seif: "א",
          quote: "זמנה עד ארבע שעות ביום, וזה רביע היום"
        }
      ],
      respondedBy: "rabbi_demo_5",
      respondedByName: "הרב חיים פרידמן",
      timestamp: Date.now() - 86400000 * 2,
      approvals: [
        {
          rabbiId: "rabbi_demo_2",
          rabbiName: "הרב יעקב כהן",
          level: "rabbi",
          timestamp: Date.now() - 86400000,
          note: "תשובה ברורה ומפורטת"
        },
        {
          rabbiId: "rabbi_demo_6",
          rabbiName: "הרב דוד רוזנברג",
          level: "posek",
          timestamp: Date.now() - 72000000,
          note: "כל המקורות נכונים"
        },
        {
          rabbiId: "rabbi_demo_3",
          rabbiName: "הרב אברהם גולדשטיין",
          level: "posek",
          timestamp: Date.now() - 64800000
        }
      ],
      isVerified: true
    }
  },
  {
    id: "q_demo_3",
    question: "האם מותר לאכול לפני תפילת שחרית?",
    category: "prayer",
    askedBy: "user_demo_3",
    askedByName: "שרה כהן",
    timestamp: Date.now() - 86400000 * 4,
    status: "answered",
    moderationStatus: "approved",
    minimumApprovalsRequired: 3,
    stats: {
      views: 328,
      helpful: 27,
      notHelpful: 3,
      shares: 8
    },
    tags: ["תפילת שחרית", "אכילה", "הלכות תפילה"],
    relatedQuestions: ["q_demo_2"],
    isPrivate: false,
    answer: {
      text: "אסור לאכול סעודת קבע קודם תפילת שחרית. אבל מותר לשתות מים, תה או קפה, ואפילו לאכול פירות או מאפה קל עד כשיעור כביצה. מי שחלש ומרגיש שלא יוכל להתפלל בכוונה בלי לאכול - מותר לו לאכול אפילו יותר, אבל ילבש תפילין קודם. קשישים וחולים שצריכים לאכול בשעה קבועה - מותרים לאכול אפילו סעודה שלמה.",
      sources: [
        {
          book: "קיצור שולחן ערוך",
          siman: "יב",
          seif: "ח",
          quote: "אסור לאכול קודם התפילה, אבל מים מותר לשתות. וכן מותר לאכול פירות ולשתות קפה או תה"
        },
        {
          book: "משנה ברורה",
          siman: "פט",
          seif: "כב",
          quote: "חולה או זקן שצריך לאכול - מותר"
        }
      ],
      respondedBy: "rabbi_demo_1",
      respondedByName: "הרב משה לוי",
      timestamp: Date.now() - 86400000 * 3,
      approvals: [
        {
          rabbiId: "rabbi_demo_5",
          rabbiName: "הרב חיים פרידמן",
          level: "rabbi",
          timestamp: Date.now() - 86400000 * 2,
          note: "כולל את כל הפרטים הנחוצים"
        },
        {
          rabbiId: "rabbi_demo_3",
          rabbiName: "הרב אברהם גולדשטיין",
          level: "posek",
          timestamp: Date.now() - 86400000,
          note: "תשובה מקיפה"
        },
        {
          rabbiId: "rabbi_demo_7",
          rabbiName: "הרב יצחק שוורץ",
          level: "scholar",
          timestamp: Date.now() - 43200000
        }
      ],
      isVerified: true
    }
  },
  {
    id: "q_demo_4",
    question: "שכחתי לומר יעלה ויבוא בברכת המזון בראש חודש, מה עלי לעשות?",
    category: "holidays",
    askedBy: "user_demo_4",
    askedByName: "אליהו גרין",
    timestamp: Date.now() - 86400000 * 5,
    status: "answered",
    moderationStatus: "approved",
    minimumApprovalsRequired: 3,
    stats: {
      views: 189,
      helpful: 22,
      notHelpful: 1,
      shares: 6
    },
    tags: ["ברכת המזון", "ראש חודש", "יעלה ויבוא"],
    relatedQuestions: ["q_demo_1"],
    isPrivate: false,
    answer: {
      text: "אם שכחת 'יעלה ויבוא' בברכת המזון של ראש חודש - תלוי באיזה שלב זכרת: אם נזכרת לפני שהתחלת את 'ברכת הטוב והמטיב' (ברכה רביעית) - חוזר ל'רצה' ואומר 'יעלה ויבוא' ומשם ממשיך. אם כבר התחלת 'ברכת הטוב והמטיב' - אין חוזר כלל, שהרי ברכת המזון מן התורה (שלוש ברכות ראשונות) כבר נאמרה. ראש חודש אינו מחייב ברכה חדשה.",
      sources: [
        {
          book: "קיצור שולחן ערוך",
          siman: "מד",
          seif: "יז",
          quote: "אם שכח יעלה ויבוא בראש חודש, אם לא התחיל ברוך אתה ה' של הטוב והמטיב, חוזר לרצה. ואם התחיל ברכת הטוב והמטיב, אינו חוזר"
        },
        {
          book: "שולחן ערוך אורח חיים",
          siman: "קפח",
          seif: "ו",
          quote: "שכח יעלה ויבוא של ראש חודש - אינו חוזר"
        }
      ],
      respondedBy: "rabbi_demo_2",
      respondedByName: "הרב יעקב כהן",
      timestamp: Date.now() - 86400000 * 4,
      approvals: [
        {
          rabbiId: "rabbi_demo_1",
          rabbiName: "הרב משה לוי",
          level: "rabbi",
          timestamp: Date.now() - 86400000 * 3,
          note: "הסבר ברור ומדויק"
        },
        {
          rabbiId: "rabbi_demo_6",
          rabbiName: "הרב דוד רוזנברג",
          level: "posek",
          timestamp: Date.now() - 86400000 * 2,
          note: "כל הפרטים נכונים"
        },
        {
          rabbiId: "rabbi_demo_8",
          rabbiName: "הרב נחמן ויס",
          level: "scholar",
          timestamp: Date.now() - 86400000
        }
      ],
      isVerified: true
    }
  },
  {
    id: "q_demo_5",
    question: "האם מותר להדליק נר שבת בחשמל?",
    category: "shabbat",
    askedBy: "user_demo_5",
    askedByName: "רחל גולדברג",
    timestamp: Date.now() - 86400000 * 6,
    status: "answered",
    moderationStatus: "approved",
    minimumApprovalsRequired: 5,
    stats: {
      views: 567,
      helpful: 45,
      notHelpful: 8,
      shares: 15
    },
    tags: ["נרות שבת", "הדלקה", "חשמל"],
    relatedQuestions: [],
    isPrivate: false,
    answer: {
      text: "מצוות נר שבת היא להדליק 'נר' ממש - דהיינו אש גלויה. לכן נר חשמלי אינו יוצא ידי חובה המצווה, שאין בו אש ממש. יש להדליק נרות שעווה או שמן עם פתילה. אמנם אם מדליקים נרות חשמל בנוסף לנרות רגילים - ודאי מותר ומצווה, שהרי יש בכך הוספת אור ושמחת שבת. אבל אין לצאת בהם ידי חובת הדלקת נרות שבת.",
      sources: [
        {
          book: "קיצור שולחן ערוך",
          siman: "עה",
          seif: "א",
          quote: "מצווה להדליק נר לכבוד שבת, והיא מצווה על האשה"
        },
        {
          book: "תורת שבת",
          siman: "רסג",
          seif: "א",
          quote: "נר חשמל אינו בכלל נר שבת, שצריך אש"
        },
        {
          book: "שמירת שבת כהלכתה",
          siman: "מג",
          seif: "א",
          quote: "אין יוצאים ידי חובה בנר חשמלי, אלא צריך נר ממש"
        }
      ],
      respondedBy: "rabbi_demo_3",
      respondedByName: "הרב אברהם גולדשטיין",
      timestamp: Date.now() - 86400000 * 5,
      approvals: [
        {
          rabbiId: "rabbi_demo_1",
          rabbiName: "הרב משה לוי",
          level: "rabbi",
          timestamp: Date.now() - 86400000 * 4,
          note: "תשובה מבוססת היטב"
        },
        {
          rabbiId: "rabbi_demo_2",
          rabbiName: "הרב יעקב כהן",
          level: "rabbi",
          timestamp: Date.now() - 86400000 * 3,
          note: "מקורות מדויקים"
        },
        {
          rabbiId: "rabbi_demo_5",
          rabbiName: "הרב חיים פרידמן",
          level: "rabbi",
          timestamp: Date.now() - 86400000 * 2,
          note: "הסבר ברור"
        },
        {
          rabbiId: "rabbi_demo_6",
          rabbiName: "הרב דוד רוזנברג",
          level: "posek",
          timestamp: Date.now() - 86400000,
          note: "תשובה מקיפה וראויה"
        },
        {
          rabbiId: "rabbi_demo_9",
          rabbiName: "הרב בנימין שטיין",
          level: "posek",
          timestamp: Date.now() - 43200000
        }
      ],
      isVerified: true
    }
  },
  {
    id: "q_demo_6",
    question: "האם אפשר לקרוא תהילים בלילה?",
    category: "prayer",
    askedBy: "user_demo_6",
    askedByName: "מרים ברגר",
    timestamp: Date.now() - 86400000,
    status: "pending",
    moderationStatus: "pending",
    minimumApprovalsRequired: 3,
    stats: {
      views: 45,
      helpful: 0,
      notHelpful: 0,
      shares: 0
    },
    tags: ["תהילים", "לילה", "תפילה"],
    relatedQuestions: [],
    isPrivate: false
  },
  {
    id: "q_demo_7",
    question: "מה הדין של ברכת הגומל לאחר טיסה?",
    category: "blessings",
    askedBy: "user_demo_7",
    askedByName: "אריה שפירא",
    timestamp: Date.now() - 43200000,
    status: "pending",
    moderationStatus: "pending",
    minimumApprovalsRequired: 3,
    stats: {
      views: 23,
      helpful: 0,
      notHelpful: 0,
      shares: 0
    },
    tags: ["ברכת הגומל", "טיסה", "ברכות"],
    relatedQuestions: [],
    isPrivate: false
  }
];

// Function to seed the data
function seedQuestions() {
  try {
    // Store all questions
    localStorage.setItem('@kitzur_questions', JSON.stringify(sampleQuestions));
    
    console.log('✅ נוספו בהצלחה ' + sampleQuestions.length + ' שאלות לדוגמה!');
    console.log('📊 מתוכן:');
    console.log('   - ' + sampleQuestions.filter(q => q.status === 'answered').length + ' שאלות עם תשובות');
    console.log('   - ' + sampleQuestions.filter(q => q.status === 'pending').length + ' שאלות ממתינות');
    console.log('');
    console.log('🔄 מרענן את הדף...');
    
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    console.error('❌ שגיאה בשתילת השאלות:', error);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sampleQuestions, seedQuestions };
}

console.log(`
╔════════════════════════════════════════════════════════════╗
║  🌱 שתילת שאלות ותשובות לדוגמה                           ║
╚════════════════════════════════════════════════════════════╝

📖 שאלות מוכנות לשתילה: ${sampleQuestions.length}

💡 להרצה בקונסול של הדפדפן:

   seedQuestions();

או העתק והדבק:

${sampleQuestions.map((q, i) => `${i + 1}. ${q.question.substring(0, 60)}...`).join('\n')}

──────────────────────────────────────────────────────────────
`);
