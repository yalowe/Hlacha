const fs = require('fs');

// פונקציה שמפרקת טקסט עם הערות אופציונליות בסוגריים
function parseTextWithOptionals(text) {
  const regex = /\(([^)]+?:)\s*([^)]+)\)/g;
  let lastIndex = 0;
  const parts = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // הטקסט לפני ההערה
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index).trim();
      if (beforeText) {
        parts.push({ text: beforeText });
      }
    }
    
    // ההערה האופציונלית
    parts.push({
      optional: true,
      condition: match[1].trim().replace(':', ''),
      text: match[2].trim()
    });
    
    lastIndex = regex.lastIndex;
  }
  
  // הטקסט אחרי ההערה האחרונה
  if (lastIndex < text.length) {
    const afterText = text.substring(lastIndex).trim();
    if (afterText) {
      parts.push({ text: afterText });
    }
  }
  
  return parts.length > 1 ? parts : null;
}

// עדכון מעין שלוש
console.log('📝 מעבד מעין שלוש...');
const meeinPath = 'content/special/meein_shalosh.json';
const meeinData = JSON.parse(fs.readFileSync(meeinPath, 'utf8'));

meeinData.paragraphs = meeinData.paragraphs.map(para => {
  if (para.text && (para.text.includes('(בשבת:') || para.text.includes('(בראש חודש:') || para.text.includes('(בחגים:'))) {
    const parsed = parseTextWithOptionals(para.text);
    if (parsed) {
      const newPara = { ...para, parts: parsed };
      delete newPara.text;
      return newPara;
    }
  }
  return para;
});

fs.writeFileSync(meeinPath, JSON.stringify(meeinData, null, 2), 'utf8');
console.log('✅ מעין שלוש עודכן!');

// עדכון ברכת המזון
console.log('📝 מעבד ברכת המזון...');
const birkatPath = 'content/special/birkat_hamazon.json';
const birkatData = JSON.parse(fs.readFileSync(birkatPath, 'utf8'));

birkatData.paragraphs = birkatData.paragraphs.map(para => {
  // אם כבר יש parts (כמו בזימון), נעבד את כל part
  if (para.parts) {
    para.parts = para.parts.map(part => {
      if (part.text && (part.text.includes('(בעשרה:') || part.text.includes('(אֱלֹהֵינוּ)'))) {
        const parsed = parseTextWithOptionals(part.text);
        if (parsed) {
          // אם יש instruction, נשמור אותו
          if (part.instruction) {
            return { instruction: part.instruction, parts: parsed };
          }
          return { parts: parsed };
        }
      }
      return part;
    });
  }
  // אם יש טקסט עם הערות אופציונליות
  else if (para.text && (para.text.includes('(בראש חודש:') || para.text.includes('(בחול המועד') || para.text.includes('(בלחש') || para.text.includes('(תָּמִיד)'))) {
    const parsed = parseTextWithOptionals(para.text);
    if (parsed) {
      const newPara = { 
        paragraph: para.paragraph,
        ...(para.heading && { heading: para.heading }),
        ...(para.instruction && { instruction: para.instruction }),
        parts: parsed
      };
      return newPara;
    }
  }
  return para;
});

fs.writeFileSync(birkatPath, JSON.stringify(birkatData, null, 2), 'utf8');
console.log('✅ ברכת המזון עודכנה!');

console.log('🎉 סיימתי לעבד את כל הקבצים!');
