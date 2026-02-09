# 🔧 הגדרת Environment Variables

מדריך מהיר להגדרת משתני סביבה עבור אפליקציית "למען שמו באהבה" - אפליקציה לימודית שיתופית ללימוד תנ"ך, הלכות ותורה.

## 🚀 התחלה מהירה

### שלב 1: צור קובץ .env

```bash
# העתק את קובץ הדוגמה
cp .env.example .env
```

### שלב 2: הגדר Firebase

1. **צור פרויקט ב-Firebase:**
   - גש ל-[Firebase Console](https://console.firebase.google.com)
   - לחץ על "Add project"
   - שם הפרויקט: "Torah Learning App" או "למען שמו באהבה" (לבחירתך)

2. **קבל את פרטי ההגדרה:**
   - בקונסול Firebase, לך ל-Project Settings
   - גלול ל-"Your apps"
   - לחץ על אייקון Web (</>)
   - רשום שם אפליקציה: "Kitzur Web"
   - העתק את ערכי ההגדרה

3. **הדבק את הערכים ב-.env:**
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### שלב 3: הגדר Firestore Database

1. **צור מסד נתונים:**
   - ב-Firebase Console, לך ל-"Firestore Database"
   - לחץ "Create database"
   - בחר "production mode"
   - מיקום: `europe-west` (קרוב לישראל)

2. **הגדר Security Rules:**
   - לך ל-Firestore > Rules
   - הדבק את הכללים הבאים:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // שאלות - כולם יכולים לקרוא, רק משתמשים מחוברים יכולים לכתוב
       match /questions/{questionId} {
         allow read: if true;
         allow create: if request.auth != null;
         allow update: if request.auth != null;
         allow delete: if request.auth.uid == resource.data.askedBy;
       }
       
       // תשובות - כולם יכולים לקרוא, רק משתמשים מחוברים יכולים לכתוב
       match /questions/{questionId}/answers/{answerId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

3. **הפעל Authentication:**
   - לך ל-Authentication > Get started
   - הפעל "Anonymous" provider (לצורך MVP)
   - בעתיד: הפעל Email/Google לחשבונות משתמשים

### שלב 4: הגדר Admin Code

הגדר קוד אדמין מאובטח (מינימום 12 תווים):

```env
EXPO_PUBLIC_ADMIN_SECRET_CODE=your-secure-random-code-123456
```

💡 **טיפ:** השתמש במחולל סיסמאות חזק ושמור את הקוד במקום בטוח.

### שלב 5: הפעל מחדש את השרת

```bash
# עצור את שרת הפיתוח (Ctrl+C) והפעל מחדש:
npm start
```

---

## ✅ בדיקה

### בדוק שFirebase מחובר:

1. הרץ את האפליקציה
2. בקונסול אמור להופיע:
   ```
   ✅ Firebase initialized successfully
   ```

3. אם Firebase לא מוגדר, תראה:
   ```
   ⚠️ Firebase not configured. Questions & Answers feature will not work.
   ```

### בדוק תכונות:

- ✅ שאלות ותשובות - אמור לעבוד עם Firebase
- ✅ הלכה יומית - עובד ללא Firebase (נתונים מקומיים)
- ✅ סימניות - עובד ללא Firebase (AsyncStorage)
- ✅ מעקב התקדמות - עובד ללא Firebase (AsyncStorage)

---

## 🔒 אבטחה

### ✅ מה בטוח:
- מפתחות Firebase API הם **ציבוריים** - בטוח לחשוף אותם באפליקציות client
- האבטחה האמיתית היא ב-**Firestore Security Rules**

### ⚠️ מה צריך להישמר סודי:
- **קוד האדמין** (`ADMIN_SECRET_CODE`) - שתף רק עם מנהלים
- **אל תעלה את `.env` ל-Git** (כבר ב-.gitignore)

### 🚀 Production Deployment:

כאשר אתה מפרסם לייצור, השתמש ב-**EAS Secrets**:

```bash
# הגדר secrets ב-EAS
eas secret:create --scope project --name FIREBASE_API_KEY --value your-key
eas secret:create --scope project --name ADMIN_SECRET_CODE --value your-code

# בנה עם EAS
eas build --platform all
```

---

## 🆘 פתרון בעיות

### Firebase לא עובד?

1. **בדוק שהמשתנים נטענו:**
   ```javascript
   console.log(process.env.EXPO_PUBLIC_FIREBASE_API_KEY);
   ```

2. **בדוק שהקובץ .env קיים:**
   ```bash
   ls -la .env
   ```

3. **הפעל מחדש את המטרו bundler:**
   ```bash
   npx expo start --clear
   ```

### Admin Code לא עובד?

1. בדוק שהקוד נמצא ב-.env
2. בדוק ש-`app.config.js` טוען את המשתנה
3. נסה לאפס את המערכת:
   ```javascript
   // ב-admin panel
   await resetAdminSystem();
   ```

---

## 📚 קריאה נוספת

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [EAS Secrets](https://docs.expo.dev/build-reference/variables/)

---

**זקוק לעזרה?** פתח issue או צור קשר עם צוות הפיתוח.
