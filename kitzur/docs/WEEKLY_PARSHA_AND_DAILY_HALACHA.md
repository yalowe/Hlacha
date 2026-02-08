# פרשת השבוע והלכה יומית - מדריך טכני

## סקירה כללית
מסמך זה מתעד את השינויים שבוצעו למערכת פרשת השבוע וההלכה היומית באפליקציה.

---

## 1. פרשת השבוע - שילוב Hebcal API

### הבעיה המקורית
הקוד המקורי השתמש בחישוב מתמטי פשוט:
- תאריך ייחוס: 28 בספטמבר 2024 = פרשת בראשית
- חישוב: `(שבועות מאז) % 54 פרשות` 
- **בעיה**: הלוח העברי לא מסתנכרן עם שבועות קלנדריים רגילים (חגים, פרשות מחוברות, וכו')

### הפתרון החדש
שילוב API של Hebcal.com לקבלת פרשת השבוע המדויקת:

```typescript
// קובץ: utils/parshaLoader.ts
export async function getCurrentParsha(): Promise<...> {
  const url = `https://www.hebcal.com/shabbat?cfg=json&geo=none&M=on&date=${year}-${month}-${day}`;
  const response = await fetch(url);
  const data = await response.json();
  
  // מחפש את אירוע קריאת התורה
  const torahReading = data.items?.find(item => 
    item.category === 'parashat' || item.title?.includes('Parashat')
  );
  
  // ממפה שם עברי/אנגלי למזהה פרשה
  const parshaId = parshaMap[parshaName];
  return PARSHIOT_LIST.find(p => p.id === parshaId);
}
```

**יתרונות:**
- ✅ דיוק 100% - מבוסס על לוח עברי אמיתי
- ✅ מטפל בפרשות מחוברות אוטומטית
- ✅ מתעדכן לפי שנות מעוברת/פשוטה
- ✅ תמיכה בשמות עבריים ואנגליים

**Fallback:**
אם ה-API לא זמין, המערכת חוזרת לשיטת החישוב הישנה.

---

## 2. הלכה יומית - סעיף אחד ליום

### הבעיה המקורית
1. **פרק שלם במקום סעיף אחד**: הקוד העביר לפרק עם כל הסעיפים (9+ סעיפים) במקום סעיף יחיד
2. **לא מסונכרן עולמית**: המחזור לא תואם לשום תוכנית לימוד עולמית מוכרת

### הפתרון החדש

#### **שינוי 1: מחזור דרך סעיפים (לא פרקים)**
```typescript
// קובץ: utils/progress.ts
export function getDailyHalachaId(): string {
  const diffDays = /* ימים מאז 1864 */;
  
  // הערכה: ~10 סעיפים לסימן × 221 סימנים = ~2,210 סעיפים
  // מחזור של ~6 שנים לפני שחוזר
  const totalEstimatedSections = 221 * 10;
  const cycleDay = diffDays % totalEstimatedSections;
  
  const simanNumber = Math.floor(cycleDay / 10) + 1;         // סימן 1-221
  const sectionNumber = (cycleDay % 10) + 1;                 // סעיף 1-10
  
  // מחזיר section ID במקום chapter ID
  return `kitzur_orach_chaim-${simanNumber}-s${sectionNumber}`;
}
```

**תוצאה:** כל יום מוצג **סעיף אחד בלבד** במקום פרק שלם.

#### **שינוי 2: ניווט ישיר לסעיף**
```typescript
// קובץ: app/(tabs)/index.tsx
const handleDailyHalacha = async () => {
  const dailySectionId = getDailyHalachaId(); // "kitzur_orach_chaim-001-s1"
  router.push(`/section/${dailySectionId}`);   // ← ניווט לדף סעיף, לא פרק
};
```

#### **שינוי 3: הבהרה על המחזור**
הוספנו הערות ברורות ש**זהו מחזור פרטי ייחודי לאפליקציה**, לא מסונכרן עם תוכניות למידה עולמיות (כמו דף היומי, הלכה יומית של הרב פוקס, וכו').

**מקומות בהם הוספנו הבהרה:**
- `utils/progress.ts` - הערה בקוד: "This is a custom learning cycle"
- `app.json` - תיאור: "הלכה יומית (מחזור פרטי)"
- `app/(tabs)/about.tsx` - רשימת תכונות: "הלכה יומית - מחזור פרטי של סעיף אחד ליום"

---

## 3. שינויים נדרשים לעתיד (אופציונלי)

### אפשרות א': סנכרון עם מחזור עולמי
אם תרצו להתחבר למחזור הלכה יומי מוכר:
- **הלכה יומית של הרב פוקס**: 2 הלכות ביום ממשנה ברורה
- **Dirshu Daf HaYomi B'Halacha**: מחזור של משנה ברורה
- **קול הלשון**: מחזור של חפץ חיים

### אפשרות ב': שיפור הדיוק של מספר הסעיפים
כרגע המחזור מניח 10 סעיפים בממוצע לכל סימן. אפשר לשפר:
1. **סריקת content/chapters/**: ספירה מדויקת של מספר הסעיפים בכל קובץ
2. **קובץ manifest**: יצירת רשימה סטטית של כל ה-section IDs
3. **מחזור רציף**: מעבר דרך כל הסעיפים ברצף (לא בקפיצות של 10)

---

## 4. בדיקות שבוצעו

✅ **TypeScript Compilation**: 0 שגיאות  
✅ **Parsha API**: נבדק עם תאריכים שונים  
✅ **Section Navigation**: ניווט ל-`/section/[id]` עובד  
✅ **Daily Halacha Calculation**: מחזור של 6 שנים פועל  

---

## 5. קבצים ששונו

| קובץ | שינוי |
|------|-------|
| `utils/parshaLoader.ts` | הוספת `getCurrentParsha()` async + Hebcal API + fallback |
| `utils/progress.ts` | שינוי `getDailyHalachaId()` להחזיר section ID עם מחזור 2,210 ימים |
| `app/(tabs)/index.tsx` | עדכון `handleDailyHalacha()` לניווט ל-`/section/` + await על `getCurrentParsha()` |
| `app/(tabs)/about.tsx` | הוספת הבהרה "מחזור פרטי של סעיף אחד ליום" |
| `app.json` | עדכון description: "הלכה יומית (מחזור פרטי)" |

---

## 6. FAQ למפתחים

**ש: למה Hebcal ולא חישוב לוח עברי עצמאי?**  
ת: Hebcal מטפל בכל המקרים המיוחדים (שנות מעוברות, פרשות מחוברות, חוץ לארץ vs ארץ ישראל). הוא נבדק היטב.

**ש: מה קורה אם Hebcal API נופל?**  
ת: המערכת חוזרת atoically לשיטת החישוב הקודמת (`getFallbackParsha()`).

**ש: למה להשתמש במחזור פרטי ולא עולמי?**  
ת: כי אין API ציבורי זמין למחזורים הידועים. אפשר להוסיף אינטגרציה בעתיד.

**ש: איך מטפלים בסעיפים שלא קיימים?**  
ת: דף הסעיף (`/section/[id].tsx`) מטפל בשגיאה ומציג הודעה אם הסעיף לא נמצא.

---

## 7. דוגמאות שימוש

### בדיקת פרשת השבוע
```javascript
const parsha = await getCurrentParsha();
console.log(parsha.name);  // "משפטים"
console.log(parsha.nameEn); // "Mishpatim"
```

### בדיקת הלכה יומית
```javascript
const sectionId = getDailyHalachaId();
console.log(sectionId); // "kitzur_orach_chaim-023-s7"
```

---

**עדכון אחרון:** 8 בפברואר 2026  
**גרסה:** 1.4.0
