# 🚀 הוראות פרסום האפליקציה לבדיקה

## 📱 פרסום ב-Expo (מומלץ למבחנים)

### אופציה 1: פרסום development build מהירה

1. **התחברות ל-Expo**
   ```bash
   cd kitzur
   npx expo login
   ```
   
2. **פרסום האפליקציה**
   ```bash
   npx expo publish
   ```
   
3. **קבלת קישור לשיתוף**
   - אחרי הפרסום תקבלו QR code וקישור
   - שלחו את הקישור או ה-QR לבודקים
   - הבודקים צריכים להתקין Expo Go ולסרוק את הקוד

### אופציה 2: הרצה local עם tunnel (מהירה יותר)

1. **הפעלת dev server עם tunnel**
   ```bash
   cd kitzur
   npx expo start --tunnel
   ```

2. **קבלת קישור**
   - הפקודה תיצור QR code ולינק
   - הלינק יעבוד מכל מקום בעולם (דרך ngrok)
   - שתפו את הקישור או ה-QR

3. **שמירה על השרת פועל**
   - השאירו את הטרמינל פתוח
   - הבודקים יוכלו לגשת כל עוד השרת פועל

### אופציה 3: EAS Build (production-ready)

> ⚠️ דורש זמן build (~20-30 דקות), אבל נותן קובץ התקנה אמיתי

1. **התקנת EAS CLI**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **הגדרת פרויקט**
   ```bash
   cd kitzur
   eas build:configure
   ```

3. **בניית Build לבדיקה**
   ```bash
   # Android (APK):
   eas build --platform android --profile preview
   
   # iOS (TestFlight):
   eas build --platform ios --profile preview
   ```

4. **שיתוף**
   - תקבלו קישור להורדה של APK (Android)
   - או תוכלו להעלות ל-TestFlight (iOS)

---

## ⚙️ הכנה לפני פרסום

### 1. יצירת .env (חובה)

צרו קובץ `.env` בתיקייה `kitzur/`:

```bash
cd kitzur
cp .env.example .env
nano .env  # או vi .env
```

**אם אין Firebase - השאירו ערכים ריקים:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_ADMIN_SECRET_CODE=demo123
```

> 📝 **הערה**: האפליקציה תעבוד גם בלי Firebase - רק מערכת השאלות והתשובות לא תפעל.

### 2. וידוא package.json

ודאו ש-`kitzur/package.json` מכיל:

```json
{
  "name": "kitzur",
  "version": "1.1.0"
}
```

### 3. בדיקה לפני פרסום

```bash
cd kitzur

# בדיקת lint
npm run lint

# בדיקת TypeScript
npx tsc --noEmit

# הרצה local
npx expo start
```

---

## 📤 שליחת לינק לבודקים

### מה לשלוח:

1. **QR Code** (צלמו מסך או שמרו)
2. **קישור ישיר** מהפלט של expo publish/start
3. **קובץ [TESTING.md](TESTING.md)** - הוראות לבודקים
4. **הוראות התקנת Expo Go**:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iPhone: https://apps.apple.com/app/expo-go/id982107779

### תבנית הודעה לבודקים:

```
🙏 שלום,

אשמח לקבל עזרה בבדיקת אפליקציה חדשה ללימוד תורה!

📱 **הוראות התקנה:**
1. הורידו את Expo Go (חינם):
   • Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   • iPhone: https://apps.apple.com/app/expo-go/id982107779

2. פתחו את Expo Go וסרקו את ה-QR:
   [הדביקו כאן QR או קישור]

3. האפליקציה תיטען תוך דקה

📋 **הוראות בדיקה מפורטות:**
[לינק לקובץ TESTING.md ב-GitHub או העתיקו את התוכן]

⏱️ הבדיקה תיקח בערך 10 דקות

תודה רבה על העזרה! 🙏
```

---

## 🔧 טרובלשוטינג

### בעיה: "Unable to resolve"
```bash
cd kitzur
rm -rf node_modules
npm install
npx expo start --clear
```

### בעיה: "Tunnel connection failed"
```bash
# התחברו מחדש
npx expo start --tunnel
# או השתמשו ב-LAN
npx expo start --lan
```

### בעיה: "Firebase not configured"
- אם אין Firebase, זה בסדר!
- האפליקציה תעבוד, רק Q&A לא יפעל
- הבודקים יראו את כל התכנים

---

## 📊 מעקב אחר בדיקות

### יצירת Google Form לאיסוף משוב:

שאלות מומלצות:
1. איזה מכשיר השתמשת? (Android/iPhone)
2. האם האפליקציה נטענה בהצלחה?
3. האם התכנים מוצגים כראוי?
4. האם מצאת באגים? (תיאור חופשי)
5. מה אהבת? מה לא?
6. דירוג כללי (1-5)

---

## ✅ Checklist לפרסום

- [ ] קובץ `.env` נוצר
- [ ] `npm run lint` - 0 errors
- [ ] `npx expo start` - עובד locally
- [ ] יצרתם קישור/QR code
- [ ] שיתפתם את TESTING.md
- [ ] שלחתם הוראות לבודקים
- [ ] יצרתם דרך לאסוף משוב (Google Form / WhatsApp)

---

## 🎯 Next Steps

אחרי איסוף משוב:
1. `git checkout main`
2. `git merge fix/bugs`
3. `git push origin main`
4. תקנו באגים שנמצאו
5. בניית build ייצור ל-Play Store / App Store

---

**בהצלחה! 🚀**
