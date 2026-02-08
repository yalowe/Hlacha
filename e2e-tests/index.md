# Kitzur Shulchan Aruch - E2E Tests

🎯 **186 comprehensive tests** | 📝 **3,756 lines of code** | ⚡ **2-10 min runtime**

---

## 🚀 Get Started in 5 Minutes

```bash
# 1. Install dependencies
cd e2e-tests
pip install -r requirements.txt
playwright install chromium

# 2. Start app (in another terminal)
cd ../kitzur && npm start

# 3. Run smoke tests
./run_tests.sh smoke
```

📖 **New here?** Read [QUICKSTART.md](QUICKSTART.md)

---

## 📚 Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[QUICKSTART.md](QUICKSTART.md)** | 5-minute getting started | First time setup |
| **[README.md](README.md)** | Full documentation | Detailed reference |
| **[TEST_SUMMARY.md](TEST_SUMMARY.md)** | Complete test overview | Understanding coverage |

---

## 🧪 Test Files (8 categories)

| File | Tests | What it covers |
|------|-------|----------------|
| [`test_navigation.py`](tests/test_navigation.py) | 30 | Navigation flows, routing, deep links |
| [`test_daily_halacha.py`](tests/test_daily_halacha.py) | 20 | Daily halacha calculation, badges, modulo |
| [`test_parsha.py`](tests/test_parsha.py) | 20 | Hebcal API, gradient design, parshiot |
| [`test_questions_qa.py`](tests/test_questions_qa.py) | 26 | Q&A system, search, categories, approval |
| [`test_search.py`](tests/test_search.py) | 20 | Hebrew search, normalization, fuzzy match |
| [`test_bookmarks.py`](tests/test_bookmarks.py) | 20 | Saved bookmarks, persistence, navigation |
| [`test_hebrew_content.py`](tests/test_hebrew_content.py) | 30 | Hebrew text, RTL, nikud, fonts |
| [`test_content_loading.py`](tests/test_content_loading.py) | 20 | Chapters, sections, caching, errors |

**Total: 186 tests** covering all major features

---

## ⚡ Quick Commands

```bash
# Critical paths (FASTEST - 2 min)
./run_tests.sh smoke

# By feature
./run_tests.sh daily       # Daily halacha
./run_tests.sh parsha      # Parsha
./run_tests.sh questions   # Q&A
./run_tests.sh search      # Search
./run_tests.sh bookmarks   # Bookmarks

# By category
./run_tests.sh hebrew      # Hebrew/RTL tests
./run_tests.sh navigation  # Navigation tests
./run_tests.sh performance # Performance tests

# Everything (10 min)
./run_tests.sh all
```

---

## 📊 What Gets Tested

### ✨ Recent Features
- [x] **Daily Halacha** - Modulo logic, always shows one section
- [x] **Parsha Integration** - Hebcal API with fallback
- [x] **Modern Design** - Gradient headers, shadows
- [x] **Hebrew Grammar** - Singular/plural forms
- [x] **Search** - Hebrew normalization with nikud removal
- [x] **Badges** - Pending answers, question counts
- [x] **Saved Bookmarks** - Label updates everywhere

### 🔤 Hebrew Support
- [x] RTL layout
- [x] Hebrew text display
- [x] Nikud rendering
- [x] Text normalization
- [x] Hebrew search
- [x] Gematria numbers
- [x] Mixed content (Hebrew + English)

### 🧭 Navigation
- [x] Bottom tabs
- [x] Deep linking
- [x] Back button
- [x] Quick actions
- [x] State persistence
- [x] URL routing

### 📚 Content
- [x] Chapter loading
- [x] Section display
- [x] Next/previous navigation
- [x] Error handling
- [x] Content caching
- [x] Performance

---

## 📁 Project Structure

```
e2e-tests/
├── 📘 QUICKSTART.md          # Start here!
├── 📗 README.md              # Full docs
├── 📙 TEST_SUMMARY.md        # Coverage overview
├── 📄 index.md               # This file
│
├── 🔧 run_tests.sh           # Quick runner
├── ⚙️ pytest.ini             # Configuration
├── ⚙️ conftest.py            # Fixtures
├── 📝 requirements.txt       # Dependencies
│
├── 📂 tests/                 # 186 tests
├── 📂 pages/                 # Page objects
├── 📂 utils/                 # Test helpers
├── 📂 reports/               # HTML reports
└── 📂 screenshots/           # Failure screenshots
```

---

## 🎯 Test Markers

Run tests by category:

```bash
pytest -m smoke          # Critical paths (fastest)
pytest -m hebrew         # Hebrew text tests
pytest -m navigation     # Navigation flows
pytest -m content        # Content loading
pytest -m questions      # Q&A system
pytest -m bookmarks      # Bookmarks
pytest -m performance    # Performance tests
pytest -m visual         # Visual/UI tests
pytest -m regression     # Full suite
```

---

## 🛠️ Page Objects

Reusable page models in `pages/`:

- **`base_page.py`** - Common functionality
- **`home_page.py`** - Main dashboard
- **`browse_page.py`** - Browse chapters
- **`chapter_page.py`** - Chapter view
- **`section_page.py`** - Section display
- **`questions_page.py`** - Q&A functionality

---

## 🧰 Test Utilities

`utils/test_helpers.py` provides:

```python
# Hebrew normalization
normalize_hebrew("שַׁבָּת")  # → "שבת"

# Daily halacha calculation
calculate_daily_halacha_id()  # Current day's section

# Hebrew date formatting
format_hebrew_date(date)  # → "8 פברואר 2026"

# Section/chapter extraction
extract_section_number(url)
extract_chapter_number(url)

# And more...
```

---

## 📊 Reports & Output

After running tests:

```bash
# View HTML report
open reports/report.html

# Check screenshots of failures
ls screenshots/

# View coverage
open reports/coverage/index.html
```

---

## 🐛 Debugging

```bash
# Run with browser visible
pytest --headed

# Slow motion (1s between actions)
pytest --headed --slowmo=1000

# Debug specific test
pytest tests/test_daily_halacha.py::test_001 -v -s --headed

# Pause execution (add to test code)
page.pause()  # Opens Playwright Inspector
```

---

## ✅ Pre-commit Checklist

Before pushing code:

```bash
# 1. Run smoke tests (quick)
./run_tests.sh smoke

# 2. If all pass, optionally run full suite
./run_tests.sh all

# 3. Check reports
open reports/report.html
```

---

## 🔄 CI/CD Integration

Tests run automatically on:
- Push to main
- Pull requests
- Scheduled daily runs

See `README.md` for GitHub Actions setup.

---

## 📈 Coverage Stats

- **186 tests** across 8 categories
- **3,756 lines** of test code
- **100%** critical path coverage
- **All** recent bug fixes tested
- **Full** Hebrew/RTL support

---

## 🎓 Learning Resources

- **Pytest Docs**: https://docs.pytest.org/
- **Playwright Python**: https://playwright.dev/python/
- **Page Object Model**: See `pages/` for examples
- **Hebrew Testing**: See `test_hebrew_content.py`

---

## 🆘 Getting Help

1. Check [QUICKSTART.md](QUICKSTART.md) for quick answers
2. Read [README.md](README.md) for detailed info
3. Look at test code - it's well commented!
4. Check `reports/report.html` for test results
5. Review `screenshots/` for visual confirmation

---

## 🎉 Quick Wins

**Just want to verify everything works?**

```bash
./run_tests.sh smoke
```

**2 minutes, 15 critical tests, confidence boost! 🚀**

---

## 📞 Support

Questions? Issues? Ideas?

1. Check documentation above
2. Review test output and reports
3. Look at existing test code for patterns
4. Run with `--headed` flag to see what's happening

---

**Ready to test?** → [QUICKSTART.md](QUICKSTART.md)

**Need details?** → [README.md](README.md)

**Curious about coverage?** → [TEST_SUMMARY.md](TEST_SUMMARY.md)

---

*Last Updated: February 8, 2026*
*Framework: Pytest + Playwright*
*Mobile Emulation: iPhone 14 Pro*
*Hebrew Support: Full RTL + Normalization*
