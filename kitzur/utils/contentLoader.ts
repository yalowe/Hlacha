import { chapterIds } from '../content/chapter-ids-only';

export type Section = { id: string; section: number; text: string };
export type Chapter = {
  id: string;
  chapterLabel: string;
  title: string;
  sections: Section[];
  version: number;
};

// Use statically imported chapter IDs (lightweight - just the IDs, no content)
const CHAPTER_IDS = chapterIds;

// Lazy-load the chapter registry only when needed
let chapterRegistry: Record<string, any> | null = null;
async function getChapterRegistry() {
  if (!chapterRegistry) {
    // Dynamically import the registry only when first accessed
    // This prevents bundling all chapters upfront
    const module = await import('../content/chapters-index');
    chapterRegistry = module.default;
  }
  return chapterRegistry;
}

/**
 * Get the total count of chapters without loading all content
 * This is much faster than listChapters() for just getting the count
 */
export function getChapterCount(): number {
  return CHAPTER_IDS.length;
}

/**
 * Load all chapters from JSON files
 * WARNING: This loads ALL chapter data and can be slow on mobile
 * Use getChapterCount() if you only need the count
 */
export async function listChapters(): Promise<Chapter[]> {
  const registry = await getChapterRegistry();
  const chapters: Chapter[] = [];
  for (const id of CHAPTER_IDS) {
    const chapter = registry[id];
    if (chapter) {
      chapters.push(chapter as Chapter);
    }
  }
  return chapters;
}

/**
 * Load a specific chapter by ID
 */
export async function getChapter(chapterId: string): Promise<Chapter | null> {
  try {
    const registry = await getChapterRegistry();
    const chapter = registry[chapterId];
    return chapter ? (chapter as Chapter) : null;
  } catch (error) {
    console.error(`Failed to load chapter: ${chapterId}`, error);
    return null;
  }
}

/**
 * Find a section by its ID across all chapters
 */
export async function findSectionById(sectionId: string): Promise<{ chapter: Chapter; section: Section } | null> {
  for (const id of CHAPTER_IDS) {
    const ch = await getChapter(id);
    if (!ch) continue;
    const sec = ch.sections.find(s => s.id === sectionId);
    if (sec) return { chapter: ch, section: sec };
  }
  return null;
}

/**
 * Search for text across all chapters and sections
 */
export async function searchContent(query: string): Promise<Array<{
  chapter: Chapter;
  section: Section;
  matchScore: number;
}>> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const results: Array<{ chapter: Chapter; section: Section; matchScore: number }> = [];
  const chapters = await listChapters();

  for (const chapter of chapters) {
    for (const section of chapter.sections) {
      const text = section.text.toLowerCase();
      const chapterTitle = chapter.title.toLowerCase();
      const chapterLabel = chapter.chapterLabel.toLowerCase();

      // Calculate match score
      let score = 0;
      if (text.includes(normalizedQuery)) score += 10;
      if (chapterTitle.includes(normalizedQuery)) score += 5;
      if (chapterLabel.includes(normalizedQuery)) score += 3;

      if (score > 0) {
        results.push({ chapter, section, matchScore: score });
      }
    }
  }

  // Sort by match score descending
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Get all chapter IDs
 */
export function getChapterIds(): string[] {
  return [...CHAPTER_IDS];
}
