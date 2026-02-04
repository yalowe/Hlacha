# Shulchan Aruch Data Fetcher

This script fetches the complete text of **Shulchan Aruch (Maran)** from Sefaria's API and generates structured JSON files for use in the mobile app.

## 📚 About Shulchan Aruch

- **Author**: Rabbi Yosef Karo (1488-1575)
- **Published**: 1565
- **License**: Public Domain (author died >100 years ago, work predates 1931)
- **Source**: Sefaria.org API
- **Reference**: [Wikisource - Shulchan Aruch](https://en.wikisource.org/wiki/Translation:Shulchan_Aruch)

## 🎯 What It Does

The script fetches all 4 parts of Shulchan Aruch:

1. **Orach Chaim** (אורח חיים) - ~697 simanim - Daily life, prayer, Shabbat, holidays
2. **Yoreh De'ah** (יורה דעה) - ~403 simanim - Dietary laws, charity, mourning
3. **Even HaEzer** (אבן העזר) - ~178 simanim - Marriage, divorce, family law
4. **Choshen Mishpat** (חושן משפט) - ~427 simanim - Civil law, damages, courts

## 🚀 Usage

### Run the Script

```bash
cd /workspaces/kitzur-app/kitzur
node scripts/fetch_shulchan_aruch.js
```

### Expected Output

The script will:
1. Fetch all simanim from Sefaria API (takes ~30-60 minutes)
2. Clean and structure the text
3. Validate JSON integrity
4. Save 4 files to `data/shulchan_aruch/`:
   - `orach_chaim.json`
   - `yoreh_deah.json`
   - `even_haezer.json`
   - `choshen_mishpat.json`

### Progress Display

```
📖 Fetching Orach Chaim...
   Slug: Shulchan_Arukh,_Orach_Chayim
  Fetching Siman 1...
    ✓ Siman 1 (18 seifim)
  Fetching Siman 2...
    ✓ Siman 2 (13 seifim)
  ...
✓ Orach Chaim: Fetched 697 simanim
   💾 Saved: orach_chaim.json (5.23 MB)
```

## 📊 JSON Structure

Each file follows this structure:

```json
{
  "meta": {
    "work": "Shulchan Aruch (Maran)",
    "part": "Orach Chaim",
    "partKey": "orach_chaim",
    "source": "Sefaria API + Wikisource",
    "license": "Public Domain",
    "language": "he",
    "version": "1.0.0",
    "generated_at": "2026-02-03T12:00:00.000Z",
    "total_simanim": 697
  },
  "simanim": {
    "1": {
      "title": "סימן א",
      "hebrewTitle": "סימן א",
      "seifim": [
        {
          "n": 1,
          "text": "יתגבר כארי לעמוד בבוקר לעבודת בוראו..."
        },
        {
          "n": 2,
          "text": "אינו חייב לומר מודה אני..."
        }
      ]
    },
    "2": {
      "title": "סימן ב",
      "seifim": [...]
    }
  }
}
```

## ⚙️ Configuration

Edit `CONFIG` object in the script to adjust:

- `requestDelay`: Milliseconds between API requests (default: 500ms)
- `maxRetries`: Number of retry attempts (default: 3)
- `consecutiveFailuresBeforeStop`: Stop after N consecutive 404s (default: 5)
- `expectedSimanim`: Known maximum simanim per part

## 🔧 Features

### Automatic Features
- ✅ **Retry logic**: Auto-retries failed requests up to 3 times
- ✅ **Rate limiting**: 500ms delay between requests (respectful to Sefaria)
- ✅ **HTML cleaning**: Strips all HTML tags, normalizes whitespace
- ✅ **Smart stopping**: Stops after 5 consecutive 404s
- ✅ **Progress logging**: Real-time console updates
- ✅ **Validation**: Checks JSON structure integrity
- ✅ **Auto-directory creation**: Creates `data/shulchan_aruch/` if missing

### Error Handling
- Network errors → automatic retry
- 404 Not Found → skip and continue
- Timeout → retry with backoff
- Invalid JSON → validation warning

## 📝 Notes

### API Respectfulness
- User-Agent header identifies as educational/non-commercial
- 500ms delay between requests (2 requests/second max)
- Additional 2-second delay between fetching different parts

### Text Cleaning
- All HTML tags removed
- Hebrew text preserved exactly as from Sefaria
- Whitespace normalized (no double spaces)
- Empty paragraphs filtered out

### Public Domain Confirmation
Wikisource explicitly states: "Shulchan Aruch was written in 1565 and its author, Rabbi Yosef Karo, died in 1575, more than 100 years ago, placing this work firmly in the public domain."

## 🐛 Troubleshooting

### Script hangs or times out
- Check internet connection
- Sefaria.org may be temporarily down
- Increase `requestDelay` in CONFIG

### Missing simanim
- Some simanim may not exist in Sefaria's database
- Script automatically skips and continues

### File size too large
- This is expected - each file can be 2-8 MB
- Use compression or pagination in the mobile app

## 📦 Dependencies

- **axios**: HTTP client for API requests
- **sanitize-html**: Remove HTML tags from text
- **fs**: File system operations (built-in)
- **path**: Path manipulation (built-in)

## 🔄 Updating Data

To refresh the data:

```bash
# Delete old files
rm -rf data/shulchan_aruch

# Re-run script
node scripts/fetch_shulchan_aruch.js
```

## 📄 License

**Script**: MIT License (this repository)  
**Data**: Public Domain (Shulchan Aruch text)  
**Source**: Sefaria.org (William Davidson Edition)

---

**For support**: Open an issue on GitHub  
**Sefaria API docs**: https://github.com/Sefaria/Sefaria-Project/wiki/API-Documentation
