/**
 * Fetch only the missing parshiot
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const MISSING_PARSHIOT = [
  { name: 'Shoftim', book: 'Deuteronomy', chapters: [16, 21, 10] },
  { name: 'Ki Teitzei', book: 'Deuteronomy', chapters: [21, 25, 20] },
  { name: 'Ki Tavo', book: 'Deuteronomy', chapters: [26, 29, 8] },
  { name: 'Nitzavim', book: 'Deuteronomy', chapters: [29, 30, 21] },
  { name: 'Vayeilech', book: 'Deuteronomy', chapters: [31, 31, 31] },
  { name: 'Ha\'Azinu', book: 'Deuteronomy', chapters: [32, 32, 53] },
  { name: 'V\'Zot HaBerachah', book: 'Deuteronomy', chapters: [33, 34, 30] }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchTorahChapter(book, chapter) {
  const url = `https://www.sefaria.org/api/v3/texts/${book}.${chapter}`;
  try {
    const response = await axios.get(url, {
      params: {
        version: 'english|The Koren Jerusalem Bible',
        with_commentary: 0
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${book} ${chapter}:`, error.message);
    return null;
  }
}

async function fetchTargumChapter(book, chapter) {
  const targumBooks = {
    'Deuteronomy': 'Onkelos Deuteronomy'
  };
  
  const targumBook = targumBooks[book];
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

async function fetchParsha(parsha) {
  console.log(`\nFetching ${parsha.name}...`);
  const [startChapter, endChapter, endVerse] = parsha.chapters;
  
  const parshaData = {
    name: parsha.name,
    book: parsha.book,
    chapters: []
  };
  
  for (let chapter = startChapter; chapter <= endChapter; chapter++) {
    console.log(`  Fetching chapter ${chapter}...`);
    
    const torahData = await fetchTorahChapter(parsha.book, chapter);
    await delay(500);
    
    const targumData = await fetchTargumChapter(parsha.book, chapter);
    await delay(500);
    
    if (!torahData || !targumData) {
      console.error(`  Failed to fetch chapter ${chapter}`);
      continue;
    }
    
    const chapterData = {
      chapter: chapter,
      verses: []
    };
    
    const torahVerses = torahData.versions?.[0]?.text || [];
    const targumVerses = targumData.versions?.[0]?.text || [];
    
    let numVerses = torahVerses.length;
    if (chapter === endChapter) {
      numVerses = Math.min(endVerse, torahVerses.length);
    }
    
    for (let verse = 0; verse < numVerses; verse++) {
      chapterData.verses.push({
        verseNum: verse + 1,
        hebrew: torahVerses[verse] || '',
        targum: targumVerses[verse] || '',
        english: ''
      });
    }
    
    parshaData.chapters.push(chapterData);
  }
  
  return parshaData;
}

async function main() {
  console.log('Fetching missing parshiot...\n');
  console.log(`Total missing: ${MISSING_PARSHIOT.length}`);
  
  const outputDir = path.join(__dirname, '../content/parshiot');
  await fs.mkdir(outputDir, { recursive: true });
  
  for (const parsha of MISSING_PARSHIOT) {
    try {
      const parshaData = await fetchParsha(parsha);
      
      const filename = parsha.name.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_');
      const filepath = path.join(outputDir, `${filename}.json`);
      
      await fs.writeFile(filepath, JSON.stringify(parshaData, null, 2));
      console.log(`✓ Saved ${filename}.json`);
      
      await delay(1000);
    } catch (error) {
      console.error(`Error processing ${parsha.name}:`, error.message);
    }
  }
  
  console.log('\n✓ All missing parshiot fetched!');
}

main().catch(console.error);
