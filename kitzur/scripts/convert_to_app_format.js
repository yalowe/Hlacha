#!/usr/bin/env node

/**
 * Convert Shulchan Aruch JSON to App Format
 * 
 * Converts the downloaded Shulchan Aruch data into the same format
 * as the existing Kitzur content files for seamless integration.
 * 
 * Usage: node scripts/convert_to_app_format.js <part_name>
 * Example: node scripts/convert_to_app_format.js orach_chaim
 */

const fs = require('fs');
const path = require('path');

const PARTS = {
  orach_chaim: { 
    name: 'Orach Chaim',
    hebrewName: 'אורח חיים',
    outputDir: 'orach_chaim'
  },
  yoreh_deah: { 
    name: 'Yoreh De\'ah',
    hebrewName: 'יורה דעה',
    outputDir: 'yoreh_deah'
  },
  even_haezer: { 
    name: 'Even HaEzer',
    hebrewName: 'אבן העזר',
    outputDir: 'even_haezer'
  },
  choshen_mishpat: { 
    name: 'Choshen Mishpat',
    hebrewName: 'חושן משפט',
    outputDir: 'choshen_mishpat'
  }
};

function convertToAppFormat(inputFile, outputDir, partInfo) {
  console.log(`\n📄 Converting ${partInfo.name}...`);
  
  // Read source data
  const sourceData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  // Create output directory
  const fullOutputDir = path.join(__dirname, '../content', outputDir);
  if (!fs.existsSync(fullOutputDir)) {
    fs.mkdirSync(fullOutputDir, { recursive: true });
  }
  
  let convertedCount = 0;
  const simanNumbers = Object.keys(sourceData.simanim).sort((a, b) => parseInt(a) - parseInt(b));
  
  // Convert each siman to app format
  simanNumbers.forEach(simanNum => {
    const siman = sourceData.simanim[simanNum];
    
    // App format structure
    const appFormat = {
      id: `${partInfo.outputDir}-${simanNum.padStart(3, '0')}`,
      chapterLabel: `סימן ${simanNum}`,
      title: siman.hebrewTitle || siman.title,
      partName: partInfo.hebrewName,
      sections: siman.seifim.map(seif => ({
        id: `${partInfo.outputDir}-${simanNum.padStart(3, '0')}-${seif.n}`,
        section: seif.n,
        text: seif.text
      }))
    };
    
    // Save to file - filename must match the ID for uniqueness
    const filename = `${partInfo.outputDir}-${simanNum.padStart(3, '0')}.json`;
    const filePath = path.join(fullOutputDir, filename);
    
    fs.writeFileSync(
      filePath,
      JSON.stringify(appFormat, null, 2),
      'utf8'
    );
    
    convertedCount++;
  });
  
  console.log(`   ✓ Converted ${convertedCount} simanim to ${fullOutputDir}`);
  
  return convertedCount;
}

function main() {
  const partKey = process.argv[2];
  
  if (!partKey || !PARTS[partKey]) {
    console.log('Usage: node scripts/convert_to_app_format.js <part_name>');
    console.log('\nAvailable parts:');
    Object.keys(PARTS).forEach(key => {
      console.log(`   - ${key}`);
    });
    console.log('\nExample:');
    console.log('   node scripts/convert_to_app_format.js orach_chaim');
    process.exit(1);
  }
  
  const partInfo = PARTS[partKey];
  const inputFile = path.join(__dirname, '../data/shulchan_aruch', `${partKey}.json`);
  
  if (!fs.existsSync(inputFile)) {
    console.error(`\n❌ Error: ${inputFile} not found`);
    console.log('\nRun this first:');
    console.log('   npm run fetch:shulchan-aruch');
    process.exit(1);
  }
  
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Shulchan Aruch → App Format Converter                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const count = convertToAppFormat(inputFile, partInfo.outputDir, partInfo);
  
  console.log('\n✅ Conversion complete!');
  console.log(`\n   ${count} files created in content/${partInfo.outputDir}/`);
  console.log('\nNext steps:');
  console.log('   1. Update utils/contentLoader.ts to load these files');
  console.log('   2. Add navigation to browse Shulchan Aruch');
  console.log('   3. Test the app\n');
}

if (require.main === module) {
  main();
}
