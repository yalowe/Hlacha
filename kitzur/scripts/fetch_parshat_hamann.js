/**
 * Fetch Parshat HaMann (Exodus 16:4-36) with Targum
 * This special section is traditionally recited daily
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    console.error(`Error fetching Hebrew ${book} ${chapter}:`, error.message);
    return null;
  }
}

async function fetchTargum(book, chapter) {
  const targumBook = 'Onkelos Exodus';
  const url = `https://www.sefaria.org/api/v3/texts/${targumBook}.${chapter}`;
  
  try {
    const response = await axios.get(url, {
      params: {
        with_commentary: 0
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching Targum for ${book} ${chapter}:`, error.message);
    return null;
  }
}

function stripHtmlTags(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '');
}

async function fetchParshatHaMann() {
  console.log('Fetching Parshat HaMann (Exodus 16:4-36)...\n');
  
  const parshatHaMann = {
    name: 'Parshat HaMann',
    hebrewName: 'פרשת המן',
    book: 'Exodus',
    description: 'The portion about the manna - traditionally recited daily',
    chapters: []
  };
  
  // Fetch chapter 16
  console.log('Fetching Exodus chapter 16...');
  
  const hebrewData = await fetchHebrewWithVowels('Exodus', 16);
  await delay(500);
  
  const targumData = await fetchTargum('Exodus', 16);
  await delay(500);
  
  if (!hebrewData || !targumData) {
    console.error('Failed to fetch data');
    return null;
  }
  
  const hebrewVerses = hebrewData.versions?.[0]?.text || [];
  const targumVerses = targumData.versions?.[0]?.text || [];
  
  const chapterData = {
    chapter: 16,
    verses: []
  };
  
  // Verses 4-36 (array indices 3-35)
  for (let i = 3; i <= 35; i++) {
    chapterData.verses.push({
      verseNum: i + 1,
      hebrew: hebrewVerses[i] || '',
      targum: stripHtmlTags(targumVerses[i] || ''),
      english: ''
    });
  }
  
  parshatHaMann.chapters.push(chapterData);
  
  return parshatHaMann;
}

async function main() {
  console.log('Starting to fetch Parshat HaMann...\n');
  
  try {
    const parshatHaMann = await fetchParshatHaMann();
    
    if (!parshatHaMann) {
      console.error('Failed to fetch Parshat HaMann');
      return;
    }
    
    // Save to special folder
    const outputDir = path.join(__dirname, '../content/special');
    await fs.mkdir(outputDir, { recursive: true });
    
    const filepath = path.join(outputDir, 'parshat_hamann.json');
    await fs.writeFile(filepath, JSON.stringify(parshatHaMann, null, 2));
    
    console.log('\n✓ Parshat HaMann saved successfully!');
    console.log(`Total verses: ${parshatHaMann.chapters[0].verses.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main().catch(console.error);
