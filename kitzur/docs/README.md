# 📚 Content Data Scripts

This directory contains scripts for fetching and managing content for the Kitzur Learning app.

## Available Scripts

### 1. Fetch Shulchan Aruch (Full Text)

**Purpose**: Download the complete Shulchan Aruch (Maran) from Sefaria API

**Files**: 
- `fetch_shulchan_aruch.js` - Main fetcher script
- `test_sefaria_api.js` - API connectivity test
- `README_SHULCHAN_ARUCH.md` - Full documentation

**Quick Start**:
```bash
# Test API connectivity first
npm run test:sefaria

# Fetch all 4 parts (takes 30-60 minutes)
npm run fetch:shulchan-aruch
```

**Output**:
- `data/shulchan_aruch/orach_chaim.json` (~5 MB, 697 simanim)
- `data/shulchan_aruch/yoreh_deah.json` (~3 MB, 403 simanim)  
- `data/shulchan_aruch/even_haezer.json` (~1 MB, 178 simanim)
- `data/shulchan_aruch/choshen_mishpat.json` (~3 MB, 427 simanim)

**Features**:
- ✅ Automatic retry with exponential backoff
- ✅ Rate limiting (500ms between requests)
- ✅ HTML cleaning and text normalization
- ✅ JSON validation
- ✅ Progress logging
- ✅ Public Domain content (Sefaria API)

See [README_SHULCHAN_ARUCH.md](./README_SHULCHAN_ARUCH.md) for detailed documentation.

---

### 2. Other Scripts

#### `reset-project.js`
Reset the Expo project to a clean state.

```bash
npm run reset-project
```

---

## 📄 Data Format

All JSON files follow this structure:

```json
{
  "meta": {
    "work": "Work Name",
    "part": "Part Name",
    "source": "Source Attribution",
    "language": "he",
    "version": "1.0.0",
    "generated_at": "ISO 8601 timestamp",
    "total_simanim": 697
  },
  "simanim": {
    "1": {
      "title": "סימן א",
      "hebrewTitle": "Full Hebrew Title",
      "seifim": [
        { "n": 1, "text": "Hebrew text..." },
        { "n": 2, "text": "Hebrew text..." }
      ]
    }
  }
}
```

---

## 🔧 Development

### Installing Dependencies

```bash
npm install
```

Key dependencies for scripts:
- `axios` - HTTP requests
- `sanitize-html` - HTML cleaning

### Adding New Content Sources

1. Create a new script in this directory
2. Follow the structure of `fetch_shulchan_aruch.js`
3. Add npm script to `package.json`
4. Document in this README

---

## ⚖️ Licensing & Attribution

### Shulchan Aruch
- **Author**: Rabbi Yosef Karo (1488-1575)
- **Published**: 1565
- **Status**: Public Domain
- **Source**: Sefaria.org (William Davidson Edition)
- **Confirmation**: [Wikisource Public Domain Notice](https://en.wikisource.org/wiki/Translation:Shulchan_Aruch)

### Scripts
- **License**: MIT (this repository)
- **Author**: Kitzur Learning App contributors

---

## 📚 Resources

- [Sefaria API Documentation](https://github.com/Sefaria/Sefaria-Project/wiki/API-Documentation)
- [Shulchan Aruch on Sefaria](https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayim)
- [Wikisource - Shulchan Aruch](https://en.wikisource.org/wiki/Translation:Shulchan_Aruch)

---

## 🐛 Troubleshooting

### Script Fails with Network Error
- Check internet connection
- Verify Sefaria.org is accessible
- Try again later (API may be temporarily down)

### Out of Memory
- Scripts are memory-optimized for large datasets
- If issues persist, increase Node heap size:
  ```bash
  NODE_OPTIONS="--max-old-space-size=4096" npm run fetch:shulchan-aruch
  ```

### JSON Validation Fails
- Re-run the script
- Check individual siman files for corruption
- Report issues on GitHub

---

**Last Updated**: February 2026  
**Maintained By**: Kitzur Learning App Team
