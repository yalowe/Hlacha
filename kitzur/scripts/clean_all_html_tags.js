/**
 * Remove ALL HTML tags from parshiot and special content files
 */

const fs = require('fs').promises;
const path = require('path');

// Strip ALL HTML tags, entities, and special notations from text
function stripHtmlTags(text) {
  if (!text) return '';
  // Remove all HTML tags including spans with classes
  return text
    .replace(/<[^>]*>/g, '')
    // Remove HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&thinsp;/g, '')
    .replace(/&[a-z]+;/gi, '')
    // Remove parsha markers {פ} {ס}
    .replace(/\{[פס]\}/g, '')
    // Remove alternative readings in square brackets [...]
    .replace(/\[[^\]]*\]/g, '')
    // Remove Ketiv (written form) in parentheses like (תלונו)
    .replace(/\([^\)]*\)/g, '')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

async function cleanFile(filepath, filename) {
  console.log(`\nCleaning ${filename}...`);
  
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    const data = JSON.parse(content);
    
    let modified = false;
    let tagCount = 0;
    
    // Process all chapters
    if (data.chapters) {
      for (const chapter of data.chapters) {
        if (chapter.verses) {
          for (const verse of chapter.verses) {
            // Clean Hebrew field
            if (verse.hebrew) {
              const cleaned = stripHtmlTags(verse.hebrew);
              if (cleaned !== verse.hebrew) {
                verse.hebrew = cleaned;
                modified = true;
                tagCount++;
              }
            }
            
            // Clean Targum field
            if (verse.targum) {
              const cleaned = stripHtmlTags(verse.targum);
              if (cleaned !== verse.targum) {
                verse.targum = cleaned;
                modified = true;
                tagCount++;
              }
            }
            
            // Clean English field if exists
            if (verse.english) {
              const cleaned = stripHtmlTags(verse.english);
              if (cleaned !== verse.english) {
                verse.english = cleaned;
                modified = true;
                tagCount++;
              }
            }
          }
        }
      }
    }
    
    if (modified) {
      await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`  ✓ Cleaned ${tagCount} fields with HTML tags`);
      return true;
    } else {
      console.log(`  ○ No HTML tags found`);
      return false;
    }
  } catch (error) {
    console.error(`  ✗ Error cleaning ${filename}:`, error.message);
    return false;
  }
}

async function cleanAllFiles() {
  console.log('Removing HTML tags from all content files...\n');
  
  let totalCleaned = 0;
  
  // Clean parshiot files
  const parshiotDir = path.join(__dirname, '../content/parshiot');
  const parshiotFiles = await fs.readdir(parshiotDir);
  const jsonFiles = parshiotFiles.filter(f => f.endsWith('.json') && f !== 'manifest.json');
  
  console.log(`Processing ${jsonFiles.length} parsha files...`);
  
  for (const file of jsonFiles.sort()) {
    const filepath = path.join(parshiotDir, file);
    const cleaned = await cleanFile(filepath, file);
    if (cleaned) totalCleaned++;
  }
  
  // Clean special files
  const specialDir = path.join(__dirname, '../content/special');
  try {
    const specialFiles = await fs.readdir(specialDir);
    const specialJsonFiles = specialFiles.filter(f => f.endsWith('.json'));
    
    console.log(`\nProcessing ${specialJsonFiles.length} special files...`);
    
    for (const file of specialJsonFiles.sort()) {
      const filepath = path.join(specialDir, file);
      const cleaned = await cleanFile(filepath, file);
      if (cleaned) totalCleaned++;
    }
  } catch (error) {
    console.log('\nNo special directory found, skipping...');
  }
  
  console.log(`\n✓ Done! Cleaned ${totalCleaned} files total.`);
}

cleanAllFiles().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
