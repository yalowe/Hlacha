/**
 * Clean HTML tags and fetch proper Hebrew text with vowels and cantillation
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Strip HTML tags from text
function stripHtmlTags(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '');
}

async function fetchHebrewWithVowels(book, chapter) {
  const url = `https://www.sefaria.org/api/v3/texts/${book}.${chapter}`;
  try {
    const response = await axios.get(url, {
      params: {
        version: 'hebrew|Miqra according to the Masorah',
        with_commentary: 0
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching Hebrew with vowels ${book} ${chapter}:`, error.message);
    return null;
  }
}

async function cleanParshaFile(filename) {
  console.log(`\nCleaning ${filename}...`);
  const filepath = path.join(__dirname, '../content/parshiot', filename);
  
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    const parsha = JSON.parse(content);
    
    let modified = false;
    
    // For each chapter
    for (const chapter of parsha.chapters) {
      console.log(`  Processing chapter ${chapter.chapter}...`);
      
      // Fetch proper Hebrew text with vowels and cantillation
      const hebrewData = await fetchHebrewWithVowels(parsha.book, chapter.chapter);
      await delay(500);
      
      if (!hebrewData) {
        console.error(`  Failed to fetch Hebrew for chapter ${chapter.chapter}`);
        continue;
      }
      
      const hebrewVerses = hebrewData.versions?.[0]?.text || [];
      
      // Update each verse
      for (let i = 0; i < chapter.verses.length; i++) {
        const verse = chapter.verses[i];
        
        // Get new Hebrew with vowels and cantillation
        const newHebrew = hebrewVerses[i] || verse.hebrew;
        
        // Clean HTML tags from targum
        const cleanTargum = stripHtmlTags(verse.targum);
        
        // Clean HTML tags from english if present
        const cleanEnglish = stripHtmlTags(verse.english || '');
        
        // Check if we need to update
        if (verse.hebrew !== newHebrew || 
            verse.targum !== cleanTargum || 
            verse.english !== cleanEnglish) {
          modified = true;
        }
        
        chapter.verses[i] = {
          verseNum: verse.verseNum,
          hebrew: newHebrew,
          targum: cleanTargum,
          english: cleanEnglish
        };
      }
    }
    
    // Only save if modified
    if (modified) {
      await fs.writeFile(filepath, JSON.stringify(parsha, null, 2));
      console.log(`  ✓ Cleaned ${filename}`);
    } else {
      console.log(`  ○ No changes needed for ${filename}`);
    }
    
  } catch (error) {
    console.error(`Error cleaning ${filename}:`, error.message);
  }
}

async function main() {
  console.log('Cleaning parsha files (removing HTML tags and adding vowels)...\n');
  
  const parshiotDir = path.join(__dirname, '../content/parshiot');
  const files = await fs.readdir(parshiotDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'manifest.json');
  
  console.log(`Total files to clean: ${jsonFiles.length}`);
  
  for (const file of jsonFiles) {
    await cleanParshaFile(file);
    await delay(1000);  // Rate limiting
  }
  
  console.log('\n✓ All parshiot cleaned!');
}

main().catch(console.error);
