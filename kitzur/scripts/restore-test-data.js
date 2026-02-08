/**
 * Script to restore test data for development
 * Run in browser console on localhost:8081
 */

// Sample last read data
const lastReadData = {
  chapterId: "1_1",
  sectionId: "1_1_1",
  chapterLabel: "סימן א",
  chapterTitle: "סדר קימת השכם בבוקר",
  sectionNumber: 1,
  timestamp: Date.now()
};

// Sample completed simanim
const completedSimanim = ["1_1", "1_2"];

// Sample streak data
const streakData = {
  count: 3,
  lastDate: new Date().toISOString().split('T')[0]
};

// Instructions for browser console
console.log(`
📖 כדי לשחזר נתונים, הרץ בקונסול של הדפדפן:

// שחזור "המשך לימוד"
localStorage.setItem('@kitzur_last_read', '${JSON.stringify(lastReadData)}');

// שחזור התקדמות
localStorage.setItem('@kitzur_completed', '${JSON.stringify(completedSimanim)}');

// שחזור רצף ימים
localStorage.setItem('@kitzur_streak', '${JSON.stringify(streakData)}');

// רענן את הדף
location.reload();

✅ לאחר הרצת הפקודות, הכרטיס "המשך לימוד" יופיע!
`);
