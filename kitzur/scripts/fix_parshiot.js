/**
 * Fix the swapped Hebrew/Targum fields in parsha files
 * The current files have English in "hebrew" and Aramaic in "targum"
 * We need Hebrew text in both hebrew fields (for reading twice) and Targum in targum field
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchHebrewText(book, chapter) {
  const url = `https://www.sefaria.org/api/v3/texts/${book}.${chapter}`;
  try {
    const response = await axios.get(url, {
      params: {
        version: 'hebrew|Tanach with Text Only',
        with_commentary: 0
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching Hebrew ${book} ${chapter}:`, error.message);
    return null;
  }
}

async function fixParshaFile(filename) {
  console.log(`\nFixing ${filename}...`);
  const filepath = path.join(__dirname, '../content/parshiot', filename);
  
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    const parsha = JSON.parse(content);
    
    // For each chapter, fetch the Hebrew text
    for (const chapter of parsha.chapters) {
      console.log(`  Processing chapter ${chapter.chapter}...`);
      
      const hebrewData = await fetchHebrewText(parsha.book, chapter.chapter);
      await delay(500);
      
      if (!hebrewData) {
        console.error(`  Failed to fetch Hebrew for chapter ${chapter.chapter}`);
        continue;
      }
      
      const hebrewVerses = hebrewData.versions?.[0]?.text || [];
      
      // Update each verse
      for (let i = 0; i < chapter.verses.length; i++) {
        const verse = chapter.verses[i];
        // The targum field currently has the Aramaic (which is correct)
        // The hebrew field currently has English (which needs to be replaced)
        const newHebrew = hebrewVerses[i] || verse.hebrew;
        
        chapter.verses[i] = {
          verseNum: verse.verseNum,
          hebrew: newHebrew,  // Now has Hebrew text
          targum: verse.targum,  // Keep the Targum (Aramaic)
          english: verse.hebrew  // Move the English here
        };
      }
    }
    
    // Save the fixed file
    await fs.writeFile(filepath, JSON.stringify(parsha, null, 2));
    console.log(`  ✓ Fixed ${filename}`);
    
  } catch (error) {
    console.error(`Error fixing ${filename}:`, error.message);
  }
}

async function main() {
  console.log('Fixing parsha files with correct Hebrew text...\n');
  
  const parshiotDir = path.join(__dirname, '../content/parshiot');
  const files = await fs.readdir(parshiotDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'manifest.json');
  
  console.log(`Total files to fix: ${jsonFiles.length}`);
  
  for (const file of jsonFiles) {
    await fixParshaFile(file);
    await delay(1000);  // Rate limiting
  }
  
  console.log('\n✓ All parshiot fixed!');
}

main().catch(console.error);
