# למען שמו באהבה - אפליקציית לימוד תורה שיתופית

אפליקציה לימודית מקיפה ללימוד תנ"ך, הלכות, פרשת השבוע וברכות, עם מערכת שאלות ותשובות קהילתית להלכה ולימוד התורה הקדושה.

**For God's Sake with Love** - A comprehensive collaborative Torah learning application featuring Bible study, Jewish law (Halacha), weekly Torah portions, blessings, and community Q&A for halachic questions and Torah study.

## Features

### 📚 תוכן לימודי / Learning Content
- **קיצור שולחן ערוך** - כל 221 הסימנים
- **שולחן ערוך המלא** - ארבעת החלקים (אורח חיים, יורה דעה, אבן העזר, חושן משפט)
- **פרשת השבוע** - שניים מקרא ואחד תרגום
- **ברכות** - ברכת המזון, בורא נפשות, מעין שלוש
- **חומר מיוחד** - פרשת המן, אגרת הרמב"ן
- **תנ"ך** - לימוד כתבי הקודש
- **שאלות ותשובות** - קהילה שיתופית ללימוד והבנת ההלכה והתורה

### ⚡ תכונות מיוחדות / Special Features
- **הלכה יומית** - סימן יומי מסונכרן עולמית (מחזור 221 יום)
- **פרשת השבוע** - עדכון אוטומטי לפרשת השבוע הנוכחית
- **מעקב התקדמות** - ספירת סימנים שהושלמו ורצף ימי לימוד
- **סימניות** - שמירת מקומות מועדפים ללימוד מהיר
- **חיפוש** - חיפוש מהיר בכל התוכן הלימודי
- **מצב כהה/בהיר** - החלפה אוטומטית או ידנית של ערכת נושא
- **שאלות ותשובות קהילתי** - שאלו ענו על שאלות הלכה ותורה עם מקורות
- **הוספת תוכן** - הוספת סימנים מהשולחן ערוך עם תמיכה בגימטריה
- **למידה שיתופית** - קהילה פעילה של לומדי תורה המשתפים ידע והבנה

### 🎨 User Interface
- Full Hebrew RTL support
- Intuitive navigation between simanim and seifim
- Unique menorah icon
- Clean and readable design

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (installed automatically)

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables (optional but recommended):**
   
   The app works without Firebase, but the Questions & Answers feature requires it:
   
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your Firebase configuration
   # See docs/ENVIRONMENT_SETUP.md for detailed setup instructions
   ```
   
   **Features that work without Firebase:**
   - ✅ All content (Kitzur, Shulchan Aruch, Parshiot, Blessings)
   - ✅ Daily Halacha
   - ✅ Bookmarks (AsyncStorage)
   - ✅ Progress tracking (AsyncStorage)
   - ✅ Search
   
   **Features that require Firebase:**
   - 🔥 Questions & Answers
   - 🔥 Community features
   
   📖 **Full setup guide:** [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md)

## Running

```bash
npx expo start
```

Options:
- **Expo Go** - Quick testing (iOS/Android)
- **iOS Simulator** - `npx expo start --ios`
- **Android Emulator** - `npx expo start --android`
- **Web** - `npx expo start --web`
- **Tunnel** - `npx expo start --tunnel` (for remote access)

## Project Structure

```
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Bottom navigation
│   ├── chapter/           # Chapter screen
│   ├── section/           # Section screen
│   ├── parsha/            # Parsha screen
│   ├── questions.tsx      # Community Q&A
│   ├── answer-question.tsx # Submit answers with sources
│   ├── pending-answers.tsx # Review pending answers
│   └── add-section.tsx    # Add custom Shulchan Aruch sections
├── components/            # Reusable components
├── content/               # Halacha content (JSON)
│   ├── chapters/         # All simanim
│   └── parshiot/         # Weekly portions
├── utils/                 # Utility functions
│   ├── contentLoader.ts  # Content loading
│   ├── progress.ts       # Progress tracking
│   ├── parshaLoader.ts   # Parsha calculation
│   ├── hebrewNumbers.ts  # Hebrew numeral conversion
│   └── questionsManager.ts # Q&A management
└── scripts/               # Development scripts
```

## Development

### Adding New Content
1. Add JSON file to `content/chapters/`
2. Update `content/chapters-index.ts`
3. Run `npm run generate-index` (if exists)

### Testing
```bash
npm test
```

### Build
```bash
npm run build
```

## Technologies

- **React Native** - Cross-platform framework
- **Expo** - Development and deployment tools
- **TypeScript** - Type safety
- **Expo Router** - File-based routing
- **AsyncStorage** - Local storage
- **Expo Haptics** - Tactile feedback

## Documentation

Complete documentation in `docs/` folder:
- **[docs/FINAL_SUMMARY.md](docs/FINAL_SUMMARY.md)** - Comprehensive project summary (start here!)
- **[docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick commands and tips
- **[docs/INSTALLATION.md](docs/INSTALLATION.md)** - Installation instructions
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guide
- **[docs/TEST_SUMMARY.md](docs/TEST_SUMMARY.md)** - Testing details

## License

פרויקט זה נוצר למטרות חינוכיות ללימוד הלכה.

## תמיכה

לשאלות ובעיות, פתח Issue ב-GitHub.
