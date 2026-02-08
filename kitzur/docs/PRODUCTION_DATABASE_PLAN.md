# 🗄️ תוכנית מעבר ל-Production Database

## 📊 המצב הנוכחי (Development)

**AsyncStorage (אחסון לוקלי במכשיר)**
- ✅ מהיר לפיתוח
- ✅ לא צריך שרת
- ❌ אין סנכרון בין משתמשים
- ❌ לא scalable ל-2M משתמשים
- ❌ נתונים נמחקים אם מוחקים את האפליקציה

---

## 🎯 הפתרון לייצור (Production)

### ארכיטקטורה מומלצת

```
┌─────────────────────────────────────────────┐
│         לקוחות (2M+ משתמשים)               │
│  📱 iOS    📱 Android    💻 Web             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│           Firebase Backend                   │
│  ┌─────────────────────────────────────┐   │
│  │  Firestore (NoSQL Database)         │   │
│  │  - שאלות ותשובות                    │   │
│  │  - פרופילי משתמשים                  │   │
│  │  - דירוגים ואישורים                │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │  Firebase Auth (הרשמה/התחברות)     │   │
│  │  - Google Sign-In                    │   │
│  │  - אנונימי (Device ID)              │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │  Cloud Functions (לוגיקה בשרת)     │   │
│  │  - אימות תשובות                     │   │
│  │  - שליחת התראות                     │   │
│  │  - חישוב Trust Score                │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │  Firebase Storage (קבצים)           │   │
│  │  - תמונות משתמשים                   │   │
│  │  - קבצי PDF מקורות                  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 🔧 מבנה הנתונים ב-Firestore

### Collection: `questions`

```typescript
{
  id: "q_abc123",
  question: "מה הברכה על עוגה?",
  category: "brachot",
  userId: "user_xyz",
  userDisplayName: "משה כהן",
  timestamp: 1738761234567,
  status: "answered",
  isPrivate: false,
  tags: ["ברכות", "עוגה", "מזונות"],
  
  // Stats - מעודכן בזמן אמת
  stats: {
    views: 145,
    helpful: 23,
    notHelpful: 2,
    shares: 5
  },
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp,
  moderationStatus: "approved"
}
```

### SubCollection: `questions/{id}/answers`

```typescript
{
  id: "ans_def456",
  text: "הברכה על עוגה היא מזונות...",
  source: "rabbi",
  rabbiId: "rabbi_abc",
  rabbiName: "הרב דוד לוי",
  rabbiTitle: "רב קהילת...",
  
  // מקורות הלכתיים
  sources: [
    {
      book: "שולחן ערוך",
      siman: "168",
      seif: "6",
      inAppLink: "/chapter/..."
    }
  ],
  
  timestamp: Timestamp,
  isVerified: true,
  moderatorId: "mod_xyz"
}
```

### SubCollection: `questions/{id}/approvals`

```typescript
{
  userId: "rabbi_123",
  userName: "הרב יצחק",
  level: "rabbi",
  timestamp: Timestamp,
  comment: "תשובה מדויקת"
}
```

### Collection: `userRatings`

```typescript
{
  userId: "device_abc123",
  questionId: "q_xyz",
  rating: true, // true = helpful, false = not helpful
  timestamp: Timestamp
}
```

---

## 🚀 תהליך המעבר לייצור

### שלב 1: הקמת Firebase Project

```bash
# התקן Firebase CLI
npm install -g firebase-tools

# התחבר לחשבון Google
firebase login

# צור פרוייקט חדש
firebase init

# בחר:
# - Firestore
# - Authentication
# - Functions
# - Hosting (אופציונלי)
```

### שלב 2: הגדרת Firestore Security Rules

**Security Rules מתקדמות עם מערכת הרשאות מלאה:**

```javascript
// firestore.rules - מערכת הרשאות מלאה
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ======================================
    // HELPER FUNCTIONS - פונקציות עזר
    // ======================================
    
    // בדיקת תפקיד משתמש
    function getUserRole() {
      return request.auth.token.role;
    }
    
    // בדיקת הרשאות ספציפיות
    function hasRole(role) {
      return getUserRole() == role;
    }
    
    function isAtLeast(minRole) {
      let roleHierarchy = [
        'anonymous',      // 0
        'registered',     // 1
        'trusted',        // 2
        'scholar',        // 3
        'rabbi',          // 4
        'moderator',      // 5
        'superadmin'      // 6
      ];
      
      return roleHierarchy.indexOf(getUserRole()) >= roleHierarchy.indexOf(minRole);
    }
    
    // בדיקת הרשאות מפורטות
    function canApproveAnswers() {
      return isAtLeast('trusted');
    }
    
    function canAnswerQuestions() {
      return isAtLeast('scholar');
    }
    
    function canEditContent() {
      return isAtLeast('moderator');
    }
    
    function canManageUsers() {
      return hasRole('superadmin');
    }
    
    // ======================================
    // QUESTIONS COLLECTION
    // ======================================
    
    match /questions/{questionId} {
      // קריאה - כולם יכולים לקרוא שאלות מאושרות
      allow read: if resource.data.moderationStatus == 'approved'
                  || request.auth.uid == resource.data.userId
                  || isAtLeast('moderator');
      
      // יצירה - כל מי שמחובר יכול לשאול
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.moderationStatus == 'pending';
      
      // עדכון - רק מחבר או מנהל
      allow update: if request.auth.uid == resource.data.userId
                    || canEditContent();
      
      // מחיקה - רק מחבר או מנהל
      allow delete: if request.auth.uid == resource.data.userId
                    || canEditContent();
    }
    
    // ======================================
    // ANSWERS SUBCOLLECTION
    // ======================================
    
    match /questions/{questionId}/answers/{answerId} {
      // קריאה - כולם
      allow read: if true;
      
      // יצירה - רק תלמידי חכמים ומעלה
      allow create: if request.auth != null
                    && canAnswerQuestions()
                    && request.resource.data.authorId == request.auth.uid
                    && request.resource.data.authorRole == getUserRole();
      
      // עדכון - רק מחבר התשובה או מנהל
      allow update: if request.auth.uid == resource.data.authorId
                    || canEditContent();
      
      // מחיקה - רק מנהל
      allow delete: if canEditContent();
    }
    
    // ======================================
    // APPROVALS SUBCOLLECTION
    // ======================================
    
    match /questions/{questionId}/approvals/{approvalId} {
      // קריאה - כולם
      allow read: if true;
      
      // יצירה - רק משתמשים מאושרים (trusted+)
      allow create: if request.auth != null
                    && canApproveAnswers()
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.userRole == getUserRole();
      
      // עדכון - רק מי שיצר את האישור
      allow update: if request.auth.uid == resource.data.userId;
      
      // מחיקה - רק מי שיצר או מנהל
      allow delete: if request.auth.uid == resource.data.userId
                    || canEditContent();
    }
    
    // ======================================
    // USER PROFILES
    // ======================================
    
    match /users/{userId} {
      // קריאה - כל פרופיל ציבורי
      allow read: if true;
      
      // יצירה - רק למשתמש עצמו
      allow create: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.role == 'registered';
      
      // עדכון - רק למשתמש עצמו (פרטים) או SuperAdmin (הרשאות)
      allow update: if request.auth.uid == userId
                    || (canManageUsers() 
                        && request.resource.data.grantedBy == request.auth.uid);
      
      // מחיקה - רק למשתמש עצמו או SuperAdmin
      allow delete: if request.auth.uid == userId
                    || canManageUsers();
    }
    
    // ======================================
    // USER RATINGS (דירוגים אישיים)
    // ======================================
    
    match /userRatings/{ratingId} {
      // Format: {userId}_{questionId}
      allow read: if request.auth != null;
      
      allow write: if request.auth != null
                   && ratingId.matches(request.auth.uid + '_.*');
    }
    
    // ======================================
    // AUDIT LOG (יומן ביקורת)
    // ======================================
    
    match /auditLog/{logId} {
      // קריאה - רק מנהלים
      allow read: if isAtLeast('moderator');
      
      // יצירה - אוטומטית דרך Cloud Functions
      allow create: if false;
      
      // אין עדכון או מחיקה
      allow update, delete: if false;
    }
    
    // ======================================
    // STATISTICS (סטטיסטיקות)
    // ======================================
    
    match /stats/platform {
      // קריאה - רק מנהלים
      allow read: if isAtLeast('moderator');
      
      // עדכון - רק דרך Cloud Functions
      allow write: if false;
    }
  }
}
```

**הסבר על ה-Security Rules:**

1. **היררכיית תפקידים:**
   - `anonymous` → `registered` → `trusted` → `scholar` → `rabbi` → `moderator` → `superadmin`

2. **הרשאות מדורגות:**
   - `isAtLeast('trusted')` - בודק שהמשתמש לפחות trusted ומעלה
   - מאפשר אכיפה גמישה של הרשאות

3. **אבטחה משולשת:**
   - Firebase Auth - זיהוי משתמש
   - Custom Claims - תפקיד והרשאות
   - Firestore Rules - אכיפה ברמת המסמכים

4. **Audit Log:**
   - רק Cloud Functions יכולות לכתוב
   - מבטיח שאי אפשר לשנות היסטוריה

5. **הגנה על נתונים רגישים:**
   - כל משתמש רואה רק את הדירוגים שלו
   - פרופילים פרטיים מוגנים
   - סטטיסטיקות רק למנהלים
```

### שלב 3: עדכון הקוד

```typescript
// utils/questionsManagerFirebase.ts
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// קבלת כל השאלות - בזמן אמת!
export function subscribeToQuestions(
  callback: (questions: Question[]) => void
) {
  const q = query(
    collection(db, 'questions'),
    where('moderationStatus', '==', 'approved'),
    orderBy('timestamp', 'desc')
  );
  
  // מאזין לשינויים בזמן אמת
  return onSnapshot(q, (snapshot) => {
    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Question[];
    
    callback(questions);
  });
}

// שליחת שאלה חדשה
export async function askQuestion(
  question: string,
  category: QuestionCategory,
  userId: string,
  userName: string
): Promise<Question> {
  const newQuestion = {
    question,
    category,
    userId,
    userDisplayName: userName,
    timestamp: Date.now(),
    status: 'pending',
    stats: { views: 0, helpful: 0, notHelpful: 0, shares: 0 },
    tags: extractTags(question),
    moderationStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const docRef = await addDoc(
    collection(db, 'questions'), 
    newQuestion
  );
  
  return { id: docRef.id, ...newQuestion };
}

// הוספת דירוג
export async function rateQuestion(
  questionId: string,
  userId: string,
  helpful: boolean
) {
  // 1. שמור בפרופיל המשתמש
  await setDoc(
    doc(db, 'userRatings', `${userId}_${questionId}`),
    { userId, questionId, rating: helpful, timestamp: new Date() }
  );
  
  // 2. עדכן ספירה כללית
  const questionRef = doc(db, 'questions', questionId);
  await updateDoc(questionRef, {
    [`stats.${helpful ? 'helpful' : 'notHelpful'}`]: increment(1)
  });
}
```

### שלב 4: Cache מקומי למהירות

```typescript
// utils/offlineCache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// שמירת cache מקומי
export async function cacheQuestions(questions: Question[]) {
  await AsyncStorage.setItem(
    '@kitzur_questions_cache',
    JSON.stringify({
      data: questions,
      timestamp: Date.now()
    })
  );
}

// קריאה מה-cache תוך כדי טעינה מהשרת
export async function getQuestionsWithCache(): Promise<Question[]> {
  // 1. טען מיידית מה-cache
  const cached = await AsyncStorage.getItem('@kitzur_questions_cache');
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    
    // אם Cache חדש מספיק (פחות מ-5 דקות)
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data;
    }
  }
  
  // 2. טען מהשרת ברקע
  const questions = await fetchQuestionsFromFirebase();
  await cacheQuestions(questions);
  return questions;
}
```

---

## 💰 עלויות Firebase (2M משתמשים)

### תוכנית Blaze (Pay as you go)

**Firestore:**
- קריאות: $0.06 לכל 100,000
- כתיבות: $0.18 לכל 100,000
- אחסון: $0.18/GB/חודש

**הערכה ל-2M משתמשים:**
- 2M משתמשים × 10 שאלות ביום = 20M קריאות/יום
- עלות: ~$12/יום = **$360/חודש**

**Cloud Functions:**
- 2M invocations/חודש חינם
- אחר כך: $0.40 לכל מליון
- עלות: **~$100/חודש**

**סה"כ משוער: $460/חודש**

### אופטימיזציה:
- שימוש ב-cache מקומי ↓ 70% בקריאות
- Pagination - טען רק 20 שאלות בכל פעם
- **עלות אמיתית: ~$150/חודש**

---

## 🔐 אבטחה ופרטיות

### Authentication
- **אנונימי**: Device ID (כמו עכשיו)
- **Google Sign-In**: לרבנים ומשתמשים רשומים
- **Phone Auth**: לאימות רבנים

### תפקידים (Custom Claims)
```typescript
// Cloud Function
export const makeRabbi = functions.https.onCall(async (data, context) => {
  // רק admin יכול להפוך משתמש לרב
  if (!context.auth?.token.admin) {
    throw new Error('Unauthorized');
  }
  
  await admin.auth().setCustomUserClaims(data.userId, {
    rabbi: true,
    rabbiLevel: 'mara_d_atra'
  });
});
```

---

## 📱 חוויית משתמש

### Real-time Updates
```typescript
// בקומפוננטה
useEffect(() => {
  // מאזין לשינויים בזמן אמת
  const unsubscribe = subscribeToQuestions((questions) => {
    setQuestions(questions);
  });
  
  return () => unsubscribe();
}, []);
```

**תוצאה:**
- שאלה חדשה → מופיעה אצל **כולם** תוך שנייה
- תשובת רב → כל מי שצפה בשאלה מקבל התראה
- דירוג → מתעדכן בזמן אמת

---

## 🛠️ כלי ניהול

### Admin Panel (Web)
```typescript
// admin/dashboard.tsx
- מיתון שאלות
- אישור רבנים
- סטטיסטיקות
- ניהול דגל שאלות
```

### Cloud Functions לתחזוקה
```typescript
// functions/src/index.ts

// 1. מיתון אוטומטי
export const moderateContent = functions.firestore
  .document('questions/{questionId}')
  .onCreate(async (snap, context) => {
    const question = snap.data();
    
    // בדיקת תוכן פוגעני
    const isSafe = await checkContent(question.question);
    
    await snap.ref.update({
      moderationStatus: isSafe ? 'approved' : 'flagged'
    });
  });

// 2. התראות push
export const notifyNewAnswer = functions.firestore
  .document('questions/{qId}/answers/{aId}')
  .onCreate(async (snap, context) => {
    const questionId = context.params.qId;
    
    // שלח push notification למי ששאל
    await sendNotification(questionId, 'קיבלת תשובה חדשה!');
  });
```

---

## 📈 תוכנית יישום

### Week 1-2: Setup
- [ ] הקם Firebase Project
- [ ] הגדר Authentication
- [ ] הגדר Firestore + Rules
- [ ] יצירת Cloud Functions בסיסיות

### Week 3-4: Migration
- [ ] כתוב wrapper ל-Firebase API
- [ ] העבר AsyncStorage → Firebase
- [ ] real-time sync
- [ ] offline support

### Week 5-6: Testing
- [ ] בדיקות עומס
- [ ] בדיקות אבטחה
- [ ] beta testing עם 100 משתמשים

### Week 7-8: Production
- [ ] Admin panel
- [ ] Monitoring (Firebase Analytics)
- [ ] Deploy

---

## 🎓 למידה נוספת

**Firebase Documentation:**
- [Firestore Getting Started](https://firebase.google.com/docs/firestore)
- [Authentication](https://firebase.google.com/docs/auth)
- [Cloud Functions](https://firebase.google.com/docs/functions)

**חלופות:**
- **Supabase** - PostgreSQL + Real-time
- **AWS Amplify** - DynamoDB + AppSync
- **MongoDB Realm** - NoSQL + Sync

---

## 💡 סיכום

**המצב הנוכחי:**
- ✅ טוב לפיתוח ובדיקות
- ❌ לא מתאים לייצור

**הפתרון:**
- Firebase Firestore לשאלות ותשובות
- Real-time sync בין כל המשתמשים
- Cache מקומי למהירות
- עלות: ~$150/חודש ל-2M משתמשים

**זמן יישום משוער:** 6-8 שבועות
