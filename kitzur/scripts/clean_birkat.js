const fs = require('fs');
const filePath = 'content/special/birkat_hamazon.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Clean all paragraphs
data.paragraphs = data.paragraphs.map(para => {
  const cleaned = { paragraph: para.paragraph };
  
  if (para.heading) {
    cleaned.heading = para.heading
      .replace(/\*\*/g, '')
      .replace(/_/g, '')
      .replace(/---/g, '')
      .trim();
  }
  
  if (para.text) {
    cleaned.text = para.text
      .replace(/\*\*/g, '')
      .replace(/_/g, '')
      .replace(/---/g, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  return cleaned;
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ ניקיתי את ברכת המזון!');
