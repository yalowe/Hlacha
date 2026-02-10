/**
 * Script to create minimalistic Hebrew "ב" icons for the app
 * Run with: node create-icons.js
 */

const fs = require('fs');
const path = require('path');

// Create SVG icon content for different sizes
function createIconSVG(size, backgroundColor = '#4A90E2', textColor = '#FFFFFF') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle with app primary color -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" ry="${size * 0.2}" fill="${backgroundColor}"/>
  
  <!-- Hebrew letter ב -->
  <text x="${size / 2}" y="${size * 0.7}" 
        text-anchor="middle" 
        font-family="Arial, Hebrew, sans-serif" 
        font-size="${size * 0.6}" 
        font-weight="300" 
        fill="${textColor}">ב</text>
</svg>`;
}

// Create icons for different purposes
const icons = [
  { name: 'icon.svg', size: 1024, desc: 'Main app icon' },
  { name: 'favicon.svg', size: 32, desc: 'Web favicon' },
  { name: 'splash-icon.svg', size: 512, desc: 'Splash screen icon' },
  { name: 'android-icon-foreground.svg', size: 432, backgroundColor: 'transparent', desc: 'Android adaptive icon foreground' },
];

// Create output directory
const outputDir = path.join(process.cwd(), 'icons-output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Generate SVG icons
icons.forEach(icon => {
  const svgContent = createIconSVG(
    icon.size, 
    icon.backgroundColor || '#4A90E2',
    icon.textColor || '#FFFFFF'
  );
  
  const filePath = path.join(outputDir, icon.name);
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created ${icon.name} (${icon.size}x${icon.size}) - ${icon.desc}`);
});

// Create instructions file
const instructions = `# בראשית App Icons - Hebrew Letter "ב"

## Generated Icons:
${icons.map(icon => `- ${icon.name} (${icon.size}x${icon.size}) - ${icon.desc}`).join('\n')}

## How to use:

1. **Convert SVG to PNG** (if needed):
   - Use an online converter or tools like Inkscape/GIMP
   - For app stores, you typically need PNG format

2. **Replace existing icons**:
   - Replace assets/images/icon.png with icon.svg (converted to PNG)
   - Replace assets/images/favicon.png with favicon.svg (converted to PNG)
   - Replace assets/images/splash-icon.png with splash-icon.svg (converted to PNG)
   - For Android: replace android-icon-foreground.png with converted PNG

3. **Icon specifications**:
   - **iOS**: 1024x1024 PNG (no transparency, no alpha channel)
   - **Android**: 432x432 PNG foreground + background color
   - **Web**: 32x32 PNG favicon

## Design Features:
- ✅ Minimalistic Hebrew letter "ב" 
- ✅ Modern teal-blue background (#4A90E2)
- ✅ Clean white letter with optimal spacing
- ✅ Rounded corners for modern look
- ✅ Scalable vector format (SVG)

## Brand Identity:
The letter "ב" represents:
- **בראשית** (Bereishit) - "In the beginning"
- **ברכה** (Bracha) - "Blessing" 
- **בית** (Bayit) - "House" (of learning)
- **בחירה** (Bechira) - "Choice" (Sephardic tradition)

This creates a meaningful, clean, and professional app icon that reflects both the Hebrew heritage and the minimalistic design trend.
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), instructions);
console.log(`\n📝 Instructions written to README.md`);
console.log(`\n🎯 Icons created in: ${outputDir}`);
console.log(`\n🚀 Next steps: Convert SVGs to PNG and replace files in assets/images/`);