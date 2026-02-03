/**
 * Fetch Iggeret HaRamban (The Ramban's Letter) from Sefaria
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Strip HTML tags from text
function stripHtmlTags(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&thinsp;/g, '')
    .replace(/&[a-z]+;/gi, '')
    .replace(/\{[פס]\}/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\([^\)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchIggeretHaRamban() {
  console.log('Fetching Iggeret HaRamban from Sefaria...\n');
  
  const url = 'https://www.sefaria.org/api/texts/Iggeret_HaRamban';
  
  try {
    const response = await axios.get(url, {
      params: {
        lang: 'he'
      }
    });
    
    // Get Hebrew text from the response
    const paragraphs = response.data.he || [];
    
    if (!paragraphs || paragraphs.length === 0) {
      console.error('No Hebrew text found');
      return null;
    }
    
    // Clean each paragraph and structure as array
    const cleanedParagraphs = paragraphs.map((p, index) => ({
      paragraph: index + 1,
      text: stripHtmlTags(p)
    }));
    
    // Create the data structure
    const data = {
      name: "אִגֶּרֶת הָרַמְבַּ״ן",
      hebrewName: "אִגֶּרֶת הָרַמְבַּ״ן",
      author: "רבי משה בן נחמן (רמב״ן)",
      description: "אִגֶּרֶת מוּסָר שֶׁשָּׁלַח הָרַמְבַּ״ן לִבְנוֹ - מִנְהָג לְקָרְאָהּ בְּכָל שַׁבָּת",
      paragraphs: cleanedParagraphs
    };
    
    // Save to file
    const outputDir = path.join(__dirname, '../content/special');
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, 'iggeret_haramban.json');
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    
    console.log('✓ Iggeret HaRamban saved successfully!');
    console.log(`   Location: ${outputPath}`);
    console.log(`   Total paragraphs: ${cleanedParagraphs.length}`);
    
    return data;
  } catch (error) {
    console.error('Error fetching Iggeret HaRamban:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

fetchIggeretHaRamban().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
