import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Bookmark = {
  id: string;
  chapterId: string;
  sectionId: string;
  sectionNumber: number;
  chapterLabel: string;
  chapterTitle: string;
  timestamp: number;
};

export type DailyLesson = {
  date: string; // YYYY-MM-DD
  chapterId: string;
  sectionId: string;
  completed: boolean;
};

const STORAGE_KEY_BOOKMARKS = "kitzur.bookmarks";
const STORAGE_KEY_THEME = "kitzur.theme";
const STORAGE_KEY_TEXT_SIZE = "kitzur.textSize";
const STORAGE_KEY_DAILY_LESSONS = "kitzur.dailyLessons";
const STORAGE_KEY_LAST_READ = "kitzur.lastRead";

// Storage abstraction layer
async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  } else {
    return await AsyncStorage.getItem(key);
  }
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
}

// Generic storage functions for testing and general use
export async function storeData(key: string, value: any): Promise<void> {
  try {
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
    await setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
  }
}

export async function getData(key: string): Promise<any> {
  try {
    const value = await getItem(key);
    if (value === null) return null;
    
    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
}

export async function removeData(key: string): Promise<void> {
  try {
    await removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
}

export async function getAllKeys(): Promise<string[]> {
  try {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return Object.keys(window.localStorage);
    } else {
      const keys = await AsyncStorage.getAllKeys();
      return [...keys];
    }
  } catch (error) {
    console.error('Error getting keys:', error);
    return [];
  }
}

export async function clearAll(): Promise<void> {
  try {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.clear();
    } else {
      await AsyncStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

// Bookmarks
export async function getBookmarks(): Promise<Bookmark[]> {
  try {
    const raw = await getItem(STORAGE_KEY_BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addBookmark(b: Bookmark): Promise<void> {
  const list = await getBookmarks();
  if (!list.find(x => x.id === b.id)) {
    list.push({ ...b, timestamp: Date.now() });
    await setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(list));
  }
}

export async function removeBookmark(id: string): Promise<void> {
  const list = await getBookmarks();
  const filtered = list.filter(x => x.id !== id);
  await setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(filtered));
}

export async function isBookmarked(id: string): Promise<boolean> {
  const list = await getBookmarks();
  return list.some(x => x.id === id);
}

// Theme
export type ThemeMode = "light" | "dark" | "system";
export async function getTheme(): Promise<ThemeMode> {
  const theme = await getItem(STORAGE_KEY_THEME);
  return (theme as ThemeMode) || "system";
}

export async function setTheme(mode: ThemeMode): Promise<void> {
  await setItem(STORAGE_KEY_THEME, mode);
}

// Text Size
export type TextSize = "small" | "medium" | "large" | "xlarge";
export async function getTextSize(): Promise<TextSize> {
  const size = await getItem(STORAGE_KEY_TEXT_SIZE);
  return (size as TextSize) || "medium";
}

export async function setTextSize(size: TextSize): Promise<void> {
  await setItem(STORAGE_KEY_TEXT_SIZE, size);
}

// Daily Lessons
export async function getDailyLessons(): Promise<DailyLesson[]> {
  try {
    const raw = await getItem(STORAGE_KEY_DAILY_LESSONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function markLessonCompleted(date: string, chapterId: string, sectionId: string): Promise<void> {
  const lessons = await getDailyLessons();
  const existing = lessons.find(l => l.date === date);
  if (existing) {
    existing.completed = true;
  } else {
    lessons.push({ date, chapterId, sectionId, completed: true });
  }
  await setItem(STORAGE_KEY_DAILY_LESSONS, JSON.stringify(lessons));
}

export async function getTodayLesson(): Promise<DailyLesson | null> {
  const today = new Date().toISOString().split('T')[0];
  const lessons = await getDailyLessons();
  return lessons.find(l => l.date === today) || null;
}

// Last Read Position
export type LastRead = {
  chapterId: string;
  sectionId: string;
  timestamp: number;
};

export async function setLastRead(chapterId: string, sectionId: string): Promise<void> {
  const data: LastRead = { chapterId, sectionId, timestamp: Date.now() };
  await setItem(STORAGE_KEY_LAST_READ, JSON.stringify(data));
}

export async function getLastRead(): Promise<LastRead | null> {
  try {
    const raw = await getItem(STORAGE_KEY_LAST_READ);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
