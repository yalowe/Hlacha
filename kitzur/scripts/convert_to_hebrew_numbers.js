/**
 * Convert all chapter/section numbers in content files to Hebrew letters
 */

const fs = require('fs').promises;
const path = require('path');

const hebrewNumerals = {
  1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט',
  10: 'י', 20: 'כ', 30: 'ל', 40: 'מ', 50: 'נ', 60: 'ס', 70: 'ע', 80: 'פ', 90: 'צ',
  100: 'ק', 200: 'ר', 300: 'ש', 400: 'ת'
};

function toHebrewNumeral(num) {
  if (num < 1 || num > 999) return num.toString();
  
  // Special cases to avoid writing the name of God
  if (num === 15 || num === 16) {
    return num === 15 ? 'טו' : 'טז';
  }

  let result = '';
  let remaining = num;

  // Hundreds
  const hundreds = Math.floor(remaining / 100) * 100;
  if (hundreds > 0) {
    result += hebrewNumerals[hundreds];
    remaining -= hundreds;
  }

  // Tens
  const tens = Math.floor(remaining / 10) * 10;
  if (tens > 0) {
    result += hebrewNumerals[tens];
    remaining -= tens;
  }

  // Ones
  if (remaining > 0) {
    result += hebrewNumerals[remaining];
  }

  // Add geresh (׳) for single letter or gershayim (״) for multiple letters
  if (result.length === 1) {
    result += '׳';
  } else if (result.length > 1) {
    result = result.slice(0, -1) + '״' + result.slice(-1);
  }

  return result;
}

async function convertChapterFile(filepath, filename) {
  console.log(`Converting ${filename}...`);
  
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    const data = JSON.parse(content);
    
    let modified = false;
    
    // Convert chapterLabel if it contains "סימן" followed by a number
    if (data.chapterLabel) {
      const match = data.chapterLabel.match(/סימן (\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        const hebrewNum = toHebrewNumeral(num);
        const newLabel = data.chapterLabel.replace(/סימן \d+/, `סימן ${hebrewNum}`);
        if (newLabel !== data.chapterLabel) {
          data.chapterLabel = newLabel;
          modified = true;
        }
      }
    }
    
    if (modified) {
      await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`  ✓ Converted ${filename}`);
      return true;
    } else {
      console.log(`  ○ No conversion needed`);
      return false;
    }
  } catch (error) {
    console.error(`  ✗ Error converting ${filename}:`, error.message);
    return false;
  }
}

async function convertAllChapters() {
  console.log('Converting chapter numbers to Hebrew letters...\n');
  
  let totalConverted = 0;
  
  // Convert main chapter files
  const chaptersDir = path.join(__dirname, '../content/chapters');
  const chapterFiles = await fs.readdir(chaptersDir);
  const jsonFiles = chapterFiles.filter(f => f.endsWith('.json'));
  
  console.log(`Processing ${jsonFiles.length} chapter files...`);
  
  for (const file of jsonFiles.sort()) {
    const filepath = path.join(chaptersDir, file);
    const converted = await convertChapterFile(filepath, file);
    if (converted) totalConverted++;
  }
  
  // Convert Orach Chaim files
  const orachChaimDir = path.join(__dirname, '../content/orach_chaim');
  try {
    const ocFiles = await fs.readdir(orachChaimDir);
    const ocJsonFiles = ocFiles.filter(f => f.endsWith('.json'));
    
    console.log(`\nProcessing ${ocJsonFiles.length} Orach Chaim files...`);
    
    for (const file of ocJsonFiles.sort()) {
      const filepath = path.join(orachChaimDir, file);
      const converted = await convertChapterFile(filepath, file);
      if (converted) totalConverted++;
    }
  } catch (error) {
    console.log('\nNo orach_chaim directory found, skipping...');
  }
  
  console.log(`\n✓ Done! Converted ${totalConverted} files total.`);
}

convertAllChapters().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
