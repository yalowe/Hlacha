# 🤝 תכונות שיתופיות - למען שמו באהבה

## 📱 פיצ'רים שיתופיים באפליקציה

### ✅ **תכונות שכבר עובדות (ללא Firebase)**

#### 1. 📤 שיתוף תוכן
- **מיקום:** מסך סעיף (section/[id])
- **כפתור:** 🔗 שיתוף
- **מה זה עושה:**
  - שיתוף טקסט של הסעיף דרך WhatsApp/Email/SMS
  - כולל כותרת + מספר סעיף + טקסט מלא
  - עובד ללא חיבור לאינטרנט

#### 2. 📋 העתקה ללוח
- **מיקום:** מסך סעיף
- **כפתור:** 📋 העתק
- **מה זה עושה:**
  - מעתיק את כל הטקסט ללוח
  - משוב ויזואלי (haptic feedback)
  - הודעה "הטקסט הועתק ללוח"

#### 3. ⭐ סימניות משותפות
- **מיקום:** כל מסך סעיף + מסך סימניות
- **כפתור:** ⭐ סימניה
- **מה זה עושה:**
  - שמירת סימנים אהובים
  - גישה מהירה מהתפריט
  - שמור במכשיר (AsyncStorage)

#### 4. 📊 מעקב התקדמות
- **מיקום:** מסך הבית + מסך סימנים
- **תכונות:**
  - ציון סימנים שהושלמו (✓)
  - מעקב אחר streak יומי
  - סטטיסטיקות התקדמות
  - שמור במכשיר

---

### ⏳ **תכונות שיתופיות שדורשות Firebase**

#### 5. ❓ שאלות ותשובות קהילתיות
- **מצב:** מוכן לעבודה, מחכה ל-Firebase
- **פיצ'רים:**
  - שאילת שאלות בהלכה
  - מענה על ידי רבנים ותלמידי חכמים
  - מערכת אישורים (3 רבנים)
  - הצבעות (helpful/not helpful)
  - סינון לפי קטגוריות
  - חיפוש עברי

**להפעלה:** עקוב אחרי [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md)

#### 6. 👥 מערכת הרשאות רב-שכבתית
- **מצב:** מוכן לעבודה, מחכה ל-Firebase
- **תפקידים:**
  - `superadmin` - הרשאות מלאות
  - `admin` - ניהול משתמשים
  - `posek` - אישור תשובות סופי
  - `rabbi` - מתן תשובות ואישור
  - `scholar` - מתן תשובות
  - `moderator` - ניהול תוכן
  - `user` - שימוש רגיל

**להפעלה:** ראה [docs/ADMIN_AUTH_GUIDE.md](docs/ADMIN_AUTH_GUIDE.md)

#### 7. 📈 סטטיסטיקות פלטפורמה
- **מצב:** מוכן, מחכה ל-Firebase
- **מה כלול:**
  - מספר משתמשים פעילים
  - שאלות פופולריות
  - סימנים נפוצים
  - אנליטיקות שימוש

---

## 🚀 **להפעלת פיצ'רים שיתופיים מלאים**

### שלב 1: הגדרת Firebase

```bash
cd kitzur
# ערוך את .env
nano .env
```

הוסף את הפרטים מ-Firebase Console:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### שלב 2: הגדרת Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // שאלות - כולם יכולים לקרוא, רק מאומתים יכולים לכתוב
    match /questions/{questionId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.askedBy || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin']);
    }
    
    // תשובות - רק רבנים ותלמידי חכמים
    match /answers/{answerId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['rabbi', 'scholar', 'posek', 'admin', 'superadmin'];
    }
    
    // משתמשים - כל אחד יכול לקרוא, רק מנהלים יכולים לערוך
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin']);
    }
  }
}
```

### שלב 3: הפעלה מחדש

```bash
npx expo start --clear
```

---

## 📊 **מטריקות להצלחה**

### KPIs לפיצ'רים שיתופיים:

1. **מעורבות:**
   - מספר שאלות ביום
   - מספר תשובות ביום
   - מספר שיתופים

2. **איכות:**
   - שאלות עם תשובות מאושרות
   - דירוג ממוצע של תשובות
   - זמן תגובה ממוצע

3. **קהילה:**
   - משתמשים פעילים יומיים
   - רבנים פעילים
   - אחוז שימוש חוזר

---

## 🎯 **תרחישי שימוש שיתופיים**

### תרחיש 1: שיתוף הלכה עם חבר
```
1. משתמש קורא סעיף על ברכות
2. לוחץ על כפתור "שיתוף" 🔗
3. בוחר WhatsApp
4. שולח לחבר
5. החבר מקבל את הטקסט המלא + מקור
```

### תרחיש 2: שאילת שאלה בהלכה
```
1. משתמש נתקל בספק הלכתי
2. לוחץ על "שאלות" בתפריט
3. "שאל שאלה" → כותב את השאלה
4. בוחר קטגוריה (שבת/כשרות/וכו')
5. השאלה נשלחת לבדיקה
6. רב עונה תוך 24 שעות
7. 2 רבנים נוספים מאשרים
8. המשתמש מקבל התראה
9. התשובה זמינה לכל הקהילה
```

### תרחיש 3: לימוד משותף
```
1. קבוצת לימוד משתמשת באפליקציה
2. כל אחד מסמן את הסימנים שלמד (⭐)
3. עוקבים אחר ההתקדמות המשותפת
4. משתפים סעיפים מעניינים בקבוצת WhatsApp
5. שואלים שאלות דרך האפליקציה
6. הרב של הקבוצה עונה ומאשר
```

---

## 🔐 **פרטיות ואבטחה**

### מה נשמר במכשיר בלבד:
- ✅ סימניות אישיות
- ✅ היסטוריית קריאה
- ✅ מעקב התקדמות
- ✅ העדפות אישיות

### מה נשמר בשרת (Firebase):
- 📡 שאלות ותשובות בלבד
- 📡 פרופיל משתמש בסיסי (אנונימי)
- 📡 סטטיסטיקות שימוש (אנונימי)

### מה **לא** נאסף:
- ❌ מידע אישי מזהה
- ❌ מיקום GPS
- ❌ אנשי קשר
- ❌ היסטוריית גלישה מחוץ לאפליקציה

---

## 📞 **תמיכה טכנית**

### בעיות נפוצות:

**שיתוף לא עובד:**
```
• ודא שיש לך אפליקציית שיתוף מותקנת (WhatsApp/Email)
• נסה שוב או השתמש ב"העתק" במקום
```

**שאלות לא נשלחות:**
```
• בדוק שיש חיבור לאינטרנט
• ודא ש-Firebase מוגדר נכון (.env)
• בדוק את Firestore Rules
```

**אין אישורים לשאלות:**
```
• צריך לפחות 3 רבנים פעילים
• הגדר רבנים דרך מסך Admin
• ראה: docs/PERMISSIONS_SUMMARY.md
```

---

## 🎉 **סיכום**

האפליקציה **כבר שיתופית** עם:
- ✅ שיתוף תכנים מובנה
- ✅ סימניות ומעקב התקדמות
- ✅ מוכנה למערכת Q&A מלאה
- ✅ מערכת הרשאות מתקדמת

**הכל מוכן!** רק צריך להוסיף Firebase כדי להפעיל את Q&A.

---

**רוצה עזרה בהגדרת Firebase?** קרא את [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md)

**מעוניין בפיצ'רים נוספים?** ראה [docs/IMPROVEMENT_RECOMMENDATIONS.md](docs/IMPROVEMENT_RECOMMENDATIONS.md)
