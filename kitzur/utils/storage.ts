import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "@/src/firebase";

export type Bookmark = {
  id: string;
  chapterId: string;
  sectionId: string;
  sectionNumber: number;
  chapterLabel: string;
  chapterTitle: string;
  timestamp: number;
};


const STORAGE_KEY_BOOKMARKS = "kitzur.bookmarks";
const STORAGE_KEY_THEME = "kitzur.theme";
const STORAGE_KEY_TEXT_SIZE = "kitzur.textSize";

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

export async function uploadStorageBlob(
  storagePath: string,
  data: Blob | Uint8Array | ArrayBuffer,
  contentType?: string
): Promise<string> {
  const storage = getStorage(app);
  const storageRef = ref(storage, storagePath);
  const metadata = contentType ? { contentType } : undefined;
  const task = uploadBytesResumable(storageRef, data, metadata);

  await new Promise<void>((resolve, reject) => {
    task.on('state_changed', undefined, reject, () => resolve());
  });

  return getDownloadURL(task.snapshot.ref);
}
