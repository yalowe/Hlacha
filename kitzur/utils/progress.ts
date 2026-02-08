/**
 * Progress Tracking Utilities
 * Tracks user reading progress, streaks, and daily study
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  LAST_READ: '@kitzur_last_read',
  COMPLETED_SIMANIM: '@kitzur_completed',
  STREAK: '@kitzur_streak',
  LAST_STUDY_DATE: '@kitzur_last_study',
  DAILY_STUDY_PLAN: '@kitzur_daily_plan',
};

export interface LastRead {
  chapterId: string;
  sectionId: string;
  chapterLabel: string;
  chapterTitle: string;
  sectionNumber: number;
  timestamp: number;
}

export interface Streak {
  count: number;
  lastDate: string; // YYYY-MM-DD
}

// Get last read position
export async function getLastRead(): Promise<LastRead | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_READ);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// Save last read position
export async function saveLastRead(position: LastRead): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify(position));
  } catch (error) {
    console.error('Failed to save last read:', error);
  }
}

// Get completed simanim count
export async function getCompletedCount(): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_SIMANIM);
    const completed = data ? JSON.parse(data) : [];
    return completed.length;
  } catch {
    return 0;
  }
}

// Mark siman as completed
export async function markSimanCompleted(simanId: string): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_SIMANIM);
    const completed: string[] = data ? JSON.parse(data) : [];
    
    if (!completed.includes(simanId)) {
      completed.push(simanId);
      await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_SIMANIM, JSON.stringify(completed));
    }
  } catch (error) {
    console.error('Failed to mark completed:', error);
  }
}

// Check if a siman is completed
export async function isSimanCompleted(simanId: string): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_SIMANIM);
    const completed: string[] = data ? JSON.parse(data) : [];
    return completed.includes(simanId);
  } catch {
    return false;
  }
}

// Unmark siman as completed
export async function unmarkSimanCompleted(simanId: string): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_SIMANIM);
    const completed: string[] = data ? JSON.parse(data) : [];
    
    const filtered = completed.filter(id => id !== simanId);
    await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_SIMANIM, JSON.stringify(filtered));
    console.log('❌ Unmarked as completed:', simanId);
  } catch (error) {
    console.error('Failed to unmark completed:', error);
  }
}

// Reset all progress (clear all completed simanim)
export async function resetAllProgress(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.COMPLETED_SIMANIM,
      STORAGE_KEYS.LAST_READ,
      STORAGE_KEYS.STREAK,
    ]);
  } catch (error) {
    console.error('Failed to reset progress:', error);
  }
}

// Get current streak
export async function getStreak(): Promise<Streak> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
    if (!data) {
      return { count: 0, lastDate: '' };
    }
    
    const streak: Streak = JSON.parse(data);
    const today = getTodayDate();
    const yesterday = getYesterdayDate();
    
    // Reset streak if more than 1 day gap
    if (streak.lastDate !== today && streak.lastDate !== yesterday) {
      return { count: 0, lastDate: '' };
    }
    
    return streak;
  } catch {
    return { count: 0, lastDate: '' };
  }
}

// Update streak
export async function updateStreak(): Promise<Streak> {
  try {
    const currentStreak = await getStreak();
    const today = getTodayDate();
    
    if (currentStreak.lastDate === today) {
      // Already studied today
      return currentStreak;
    }
    
    const yesterday = getYesterdayDate();
    const newStreak: Streak = {
      count: currentStreak.lastDate === yesterday ? currentStreak.count + 1 : 1,
      lastDate: today,
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(newStreak));
    return newStreak;
  } catch {
    return { count: 0, lastDate: '' };
  }
}

// Get today's date string (YYYY-MM-DD)
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Get yesterday's date string
function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

// Get daily quote (random from a collection)
const DAILY_QUOTES = [
  {
    text: 'מי שלומד הלכות בכל יום מובטח לו שהוא בן עולם הבא',
    source: 'נידה עג:',
  },
  {
    text: 'עשה תורתך קבע',
    source: 'אבות א:טו',
  },
  {
    text: 'לעולם ישנה אדם לתלמידו דרך קצרה',
    source: 'פסחים ג:',
  },
  {
    text: 'הלכה למעשה - זו מטרת הלימוד',
    source: 'קיצור שולחן ערוך',
  },
  {
    text: 'המחזיק בדרכי ה\' זוכה לאושר אמיתי',
    source: 'משלי ג:יח',
  },
];

export function getDailyQuote(): { text: string; source: string } {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}

// Get daily halacha - returns ONE section per day (not entire chapter)
// NOTE: This is a custom learning cycle, not synchronized with any global program
export function getDailyHalachaId(): string {
  // Calculate days since Kitzur Shulchan Aruch publication (1864)
  const startDate = new Date('1864-01-01');
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Estimate ~10 sections per siman on average = ~2210 total sections
  // This gives a ~6 year cycle before repeating
  const totalEstimatedSections = 221 * 10;
  const cycleDay = diffDays % totalEstimatedSections;
  
  // Calculate which siman and section
  const simanNumber = Math.floor(cycleDay / 10) + 1;
  const sectionNumber = (cycleDay % 10) + 1;
  
  // Return section ID instead of chapter ID
  return `kitzur_orach_chaim-${String(simanNumber).padStart(3, '0')}-s${sectionNumber}`;
}

// Get random halacha (keeping for backward compatibility)
export function getRandomHalachaId(totalSimanim: number): string {
  const randomSiman = Math.floor(Math.random() * totalSimanim) + 1;
  return `siman-${String(randomSiman).padStart(3, '0')}`;
}
