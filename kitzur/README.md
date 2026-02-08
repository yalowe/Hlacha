# Kitzur Shulchan Aruch Learning App

A comprehensive Jewish law (Halacha) learning application featuring Kitzur Shulchan Aruch, full Shulchan Aruch, weekly Torah portions, blessings, and community Q&A.

## Features

### 📚 Content
- **Kitzur Shulchan Aruch** - All 221 sections complete
- **Full Shulchan Aruch** - All four parts (Orach Chaim, Yoreh De'ah, Even HaEzer, Choshen Mishpat)
- **Weekly Torah Portion** - Shnayim Mikra V'Echad Targum
- **Blessings** - Birkat Hamazon, Borei Nefashot, Meein Shalosh
- **Special Sections** - Parshat HaMann, Iggeret HaRamban

### ⚡ Special Features
- **Daily Halacha** - Globally synchronized daily section (221-day cycle)
- **Weekly Parsha** - Automatic updates to current Torah portion
- **Progress Tracking** - Completed sections counter and learning streak
- **Bookmarks** - Save favorite locations
- **Search** - Fast search across all content
- **Dark/Light Mode** - Automatic or manual theme switching
- **Community Q&A** - Ask and answer halachic questions with sourced references
- **Add Custom Content** - Submit sections from Shulchan Aruch with Hebrew numeral support

### 🎨 User Interface
- Full Hebrew RTL support
- Intuitive navigation between simanim and seifim
- Unique menorah icon
- Clean and readable design

## Installation

```bash
npm install
```

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
