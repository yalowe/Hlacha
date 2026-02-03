/**
 * Fetch Shnayim Mikra v'Echad Targum content from Sefaria
 * Fetches Torah portions (Parshiot) with Targum Onkelos
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Weekly Torah portions in order
const PARSHIOT = [
  // Bereishit (Genesis)
  { name: 'Bereishit', book: 'Genesis', chapters: [1, 6, 4] },
  { name: 'Noach', book: 'Genesis', chapters: [6, 11, 14] },
  { name: 'Lech-Lecha', book: 'Genesis', chapters: [12, 17, 6] },
  { name: 'Vayera', book: 'Genesis', chapters: [18, 22, 5] },
  { name: 'Chayei Sara', book: 'Genesis', chapters: [23, 25, 19] },
  { name: 'Toldot', book: 'Genesis', chapters: [25, 28, 10] },
  { name: 'Vayetzei', book: 'Genesis', chapters: [28, 32, 3] },
  { name: 'Vayishlach', book: 'Genesis', chapters: [32, 36, 44] },
  { name: 'Vayeshev', book: 'Genesis', chapters: [37, 40, 24] },
  { name: 'Miketz', book: 'Genesis', chapters: [41, 44, 18] },
  { name: 'Vayigash', book: 'Genesis', chapters: [44, 47, 28] },
  { name: 'Vayechi', book: 'Genesis', chapters: [47, 50, 27] },
  
  // Shemot (Exodus)
  { name: 'Shemot', book: 'Exodus', chapters: [1, 6, 2] },
  { name: 'Vaera', book: 'Exodus', chapters: [6, 9, 36] },
  { name: 'Bo', book: 'Exodus', chapters: [10, 13, 17] },
  { name: 'Beshalach', book: 'Exodus', chapters: [13, 17, 17] },
  { name: 'Yitro', book: 'Exodus', chapters: [18, 20, 24] },
  { name: 'Mishpatim', book: 'Exodus', chapters: [21, 24, 19] },
  { name: 'Terumah', book: 'Exodus', chapters: [25, 27, 20] },
  { name: 'Tetzaveh', book: 'Exodus', chapters: [27, 30, 11] },
  { name: 'Ki Tisa', book: 'Exodus', chapters: [30, 34, 36] },
  { name: 'Vayakhel', book: 'Exodus', chapters: [35, 38, 21] },
  { name: 'Pekudei', book: 'Exodus', chapters: [38, 40, 39] },
  
  // Vayikra (Leviticus)
  { name: 'Vayikra', book: 'Leviticus', chapters: [1, 5, 25] },
  { name: 'Tzav', book: 'Leviticus', chapters: [6, 8, 37] },
  { name: 'Shmini', book: 'Leviticus', chapters: [9, 11, 48] },
  { name: 'Tazria', book: 'Leviticus', chapters: [12, 13, 60] },
  { name: 'Metzora', book: 'Leviticus', chapters: [14, 15, 34] },
  { name: 'Achrei Mot', book: 'Leviticus', chapters: [16, 18, 31] },
  { name: 'Kedoshim', book: 'Leviticus', chapters: [19, 20, 28] },
  { name: 'Emor', book: 'Leviticus', chapters: [21, 24, 24] },
  { name: 'Behar', book: 'Leviticus', chapters: [25, 26, 3] },
  { name: 'Bechukotai', book: 'Leviticus', chapters: [26, 27, 35] },
  
  // Bamidbar (Numbers)
  { name: 'Bamidbar', book: 'Numbers', chapters: [1, 4, 21] },
  { name: 'Nasso', book: 'Numbers', chapters: [4, 7, 90] },
  { name: 'Beha\'alotcha', book: 'Numbers', chapters: [8, 12, 17] },
  { name: 'Sh\'lach', book: 'Numbers', chapters: [13, 15, 42] },
  { name: 'Korach', book: 'Numbers', chapters: [16, 18, 33] },
  { name: 'Chukat', book: 'Numbers', chapters: [19, 22, 2] },
  { name: 'Balak', book: 'Numbers', chapters: [22, 25, 10] },
  { name: 'Pinchas', book: 'Numbers', chapters: [25, 30, 2] },
  { name: 'Matot', book: 'Numbers', chapters: [30, 32, 43] },
  { name: 'Masei', book: 'Numbers', chapters: [33, 36, 14] },
  
  // Devarim (Deuteronomy)
  { name: 'Devarim', book: 'Deuteronomy', chapters: [1, 3, 23] },
  { name: 'Vaetchanan', book: 'Deuteronomy', chapters: [3, 7, 12] },
  { name: 'Eikev', book: 'Deuteronomy', chapters: [7, 11, 26] },
  { name: 'Re\'eh', book: 'Deuteronomy', chapters: [11, 16, 18] },
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
    'Genesis': 'Onkelos Genesis',
    'Exodus': 'Onkelos Exodus',
    'Leviticus': 'Onkelos Leviticus',
    'Numbers': 'Onkelos Numbers',
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
    
    // Fetch Torah text
    const torahData = await fetchTorahChapter(parsha.book, chapter);
    await delay(500); // Rate limiting
    
    // Fetch Targum
    const targumData = await fetchTargumChapter(parsha.book, chapter);
    await delay(500); // Rate limiting
    
    if (!torahData || !targumData) {
      console.error(`  Failed to fetch chapter ${chapter}`);
      continue;
    }
    
    const chapterData = {
      chapter: chapter,
      verses: []
    };
    
    // Get the verses for this chapter
    const torahVerses = torahData.versions?.[0]?.text || [];
    const targumVerses = targumData.versions?.[0]?.text || [];
    
    // Determine how many verses to include
    let numVerses = torahVerses.length;
    if (chapter === endChapter) {
      numVerses = Math.min(endVerse, torahVerses.length);
    }
    
    for (let verse = 0; verse < numVerses; verse++) {
      chapterData.verses.push({
        verseNum: verse + 1,
        hebrew: torahVerses[verse] || '',
        targum: targumVerses[verse] || '',
        english: '' // Can add English translation later if needed
      });
    }
    
    parshaData.chapters.push(chapterData);
  }
  
  return parshaData;
}

async function main() {
  console.log('Starting to fetch Shnayim Mikra v\'Echad Targum content...\n');
  console.log(`Total parshiot to fetch: ${PARSHIOT.length}`);
  
  // Create output directory
  const outputDir = path.join(__dirname, '../content/parshiot');
  await fs.mkdir(outputDir, { recursive: true });
  
  const allParshaNames = [];
  
  for (const parsha of PARSHIOT) {
    try {
      const parshaData = await fetchParsha(parsha);
      
      // Save to file
      const filename = parsha.name.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_');
      const filepath = path.join(outputDir, `${filename}.json`);
      
      await fs.writeFile(filepath, JSON.stringify(parshaData, null, 2));
      console.log(`✓ Saved ${filename}.json`);
      
      allParshaNames.push(filename);
      
      // Longer delay between parshiot
      await delay(1000);
    } catch (error) {
      console.error(`Error processing ${parsha.name}:`, error.message);
    }
  }
  
  // Create manifest
  const manifest = {
    totalParshiot: allParshaNames.length,
    parshiot: allParshaNames
  };
  
  await fs.writeFile(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('\n✓ All parshiot fetched successfully!');
  console.log(`Total files created: ${allParshaNames.length}`);
}

main().catch(console.error);
