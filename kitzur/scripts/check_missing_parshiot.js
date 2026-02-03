const fs = require('fs').promises;
const path = require('path');

const ALL_PARSHIOT = [
  'bereishit', 'noach', 'lech-lecha', 'vayera', 'chayei_sara', 'toldot',
  'vayetzei', 'vayishlach', 'vayeshev', 'miketz', 'vayigash', 'vayechi',
  'shemot', 'vaera', 'bo', 'beshalach', 'yitro', 'mishpatim',
  'terumah', 'tetzaveh', 'ki_tisa', 'vayakhel', 'pekudei',
  'vayikra', 'tzav', 'shmini', 'tazria', 'metzora', 'achrei_mot',
  'kedoshim', 'emor', 'behar', 'bechukotai',
  'bamidbar', 'nasso', 'behaalotcha', 'shlach', 'korach', 'chukat',
  'balak', 'pinchas', 'matot', 'masei',
  'devarim', 'vaetchanan', 'eikev', 'reeh', 'shoftim', 'ki_teitzei',
  'ki_tavo', 'nitzavim', 'vayeilech', 'haazinu', 'vzot_haberachah'
];

async function checkMissing() {
  const parshiotDir = path.join(__dirname, '../content/parshiot');
  const existing = await fs.readdir(parshiotDir);
  const existingNames = existing
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
  
  const missing = ALL_PARSHIOT.filter(p => !existingNames.includes(p));
  
  console.log(`Total parshiot: ${ALL_PARSHIOT.length}`);
  console.log(`Existing: ${existingNames.length}`);
  console.log(`Missing: ${missing.length}`);
  console.log('\nMissing parshiot:');
  missing.forEach(p => console.log(`  - ${p}`));
}

checkMissing().catch(console.error);
