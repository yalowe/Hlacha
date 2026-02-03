#!/usr/bin/env node
/**
 * Generate chapters-index.ts with all chapter imports
 */
const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '../content');
const OUTPUT_FILE = path.join(__dirname, '../content/chapters-index.ts');

// All directories to scan for chapters
const CHAPTER_DIRS = [
  'chapters',
  'orach_chaim',
  'yoreh_deah',
  'even_haezer',
  'choshen_mishpat'
];

// Get all chapter files from all directories
let allChapters = [];

for (const dir of CHAPTER_DIRS) {
  const dirPath = path.join(CONTENT_DIR, dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath)
      .filter(f => f.endsWith('.json'))
      .map(f => ({
        id: f.replace('.json', ''),
        path: `${dir}/${f.replace('.json', '')}`
      }));
    allChapters = allChapters.concat(files);
  }
}

// Sort by ID
allChapters.sort((a, b) => a.id.localeCompare(b.id));

// Generate the file content
const content = `/**
 * Auto-generated chapter index for Metro bundler
 * Generated: ${new Date().toISOString()}
 * Includes: Kitzur Shulchan Aruch + Full Shulchan Aruch
 */

const chapters: Record<string, any> = {
${allChapters.map(ch => `  '${ch.id}': require('./${ch.path}.json'),`).join('\n')}
};

export default chapters;

export const chapterIds = [
${allChapters.map(ch => `  '${ch.id}',`).join('\n')}
];
`;

fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
console.log(`✅ Generated chapters-index.ts with ${allChapters.length} chapters`);
console.log(`   Kitzur: ~303 | Orach Chaim: ~697 | Yoreh De'ah: ~402 | Even HaEzer: ~178 | Choshen Mishpat: ~427`);
