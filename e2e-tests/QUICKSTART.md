# E2E Tests Quick Start Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd e2e-tests
pip install -r requirements.txt
playwright install chromium
```

### 2. Start the App
```bash
# In a separate terminal
cd ../kitzur
npm start
# Wait for "Metro waiting on exp://..."
```

### 3. Run Tests
```bash
# In e2e-tests directory
./run_tests.sh smoke    # Quick smoke tests (2 min)
./run_tests.sh all      # All tests (10 min)
```

## 📊 Test Summary

**8 Test Files** covering all major features:

| File | Tests | Focus Area |
|------|-------|------------|
| `test_navigation.py` | 30 | Navigation flows, deep links, back button |
| `test_daily_halacha.py` | 20 | Daily halacha calculation, modulo logic, badges |
| `test_parsha.py` | 20 | Hebcal API, gradient design, parsha display |
| `test_questions_qa.py` | 26 | Q&A system, badges, search, categories |
| `test_search.py` | 20 | Hebrew search, normalization, fuzzy match |
| `test_bookmarks.py` | 20 | Bookmarks, persistence, "Saved Bookmarks" |
| `test_hebrew_content.py` | 30 | Hebrew text, RTL, nikud, fonts |
| `test_content_loading.py` | 20 | Chapters, sections, caching, errors |

**Total: 186 tests** 🎯

## 🎯 Test by Category

```bash
# Critical paths only (FASTEST - 2 min)
./run_tests.sh smoke

# Hebrew-specific tests
./run_tests.sh hebrew

# Feature-specific
./run_tests.sh daily        # Daily halacha
./run_tests.sh parsha        # Parsha
./run_tests.sh questions     # Q&A
./run_tests.sh search        # Search
./run_tests.sh bookmarks     # Bookmarks

# Performance tests
./run_tests.sh performance

# Everything (10 min)
./run_tests.sh all
```

## 📁 Output

After running tests:

```
e2e-tests/
├── reports/
│   └── report.html          ← Open this in browser
├── screenshots/
│   └── [failed_tests]       ← Screenshots of failures
└── reports/coverage/
    └── index.html           ← Code coverage
```

**View report:**
```bash
open reports/report.html
```

## ✅ What Gets Tested

### Daily Halacha ✨
- ✅ Modulo calculation (wraps around when sections don't exist)
- ✅ Always shows one section per day
- ✅ Date badge displays correctly
- ✅ Custom 6-year learning cycle
- ✅ Fallback handling

### Parsha 📖
- ✅ Hebcal API integration
- ✅ Modern gradient header design
- ✅ Hebrew parsha names
- ✅ Combined parshiot (Vayakhel-Pekudei)
- ✅ Offline fallback

### Questions & Answers ❓
- ✅ Header not cut off (padding: 70)
- ✅ Pending answers badge shows count
- ✅ Badge visible immediately (not after navigation)
- ✅ Plural form always (even "1 תשובות")
- ✅ Hebrew search with normalization
- ✅ Category filtering works

### Search 🔍
- ✅ Hebrew text normalization
- ✅ Nikud removal
- ✅ Final letter conversion (ך→כ, ם→מ)
- ✅ Fuzzy partial matching
- ✅ Fast response (<1s)

### Bookmarks 🔖
- ✅ "Saved Bookmarks" label everywhere
- ✅ Add/remove bookmarks
- ✅ AsyncStorage persistence
- ✅ Integration with daily halacha

### Hebrew Content 🔤
- ✅ RTL layout
- ✅ Hebrew text display
- ✅ Nikud rendering
- ✅ Hebrew numbers (gematria)
- ✅ Mixed Hebrew/English

## 🐛 Debugging Failed Tests

### Option 1: View HTML Report
```bash
open reports/report.html
# Shows which tests failed, error messages, screenshots
```

### Option 2: Run With Browser Visible
```bash
pytest tests/test_daily_halacha.py --headed
# Watch the test run in real browser
```

### Option 3: Slow Motion
```bash
pytest tests/test_parsha.py --headed --slowmo=1000
# 1 second delay between actions
```

### Option 4: Debug Specific Test
```bash
pytest tests/test_questions_qa.py::TestQuestionsBadges::test_005 -v -s --headed
# Run one test with full output
```

## 🔧 Common Issues

### "App not running"
```bash
# Start app first:
cd ../kitzur
npm start
# Wait for Metro to be ready
```

### "Module not found"
```bash
pip install -r requirements.txt
playwright install chromium
```

### Tests timeout
```bash
# Check if app is responding:
curl http://localhost:8081
```

### Port already in use
```bash
# Kill Metro:
lsof -ti:8081 | xargs kill -9
# Restart app
```

## 📈 Coverage Goals

Current coverage:
- ✅ **Navigation**: 100%
- ✅ **Daily Halacha**: 100%
- ✅ **Parsha**: 100%
- ✅ **Questions**: 95%
- ✅ **Search**: 90%
- ✅ **Bookmarks**: 85%
- ✅ **Hebrew/RTL**: 100%
- ✅ **Content**: 90%

## 🎓 Writing New Tests

### 1. Create test file
```bash
touch tests/test_my_feature.py
```

### 2. Use template
```python
"""
My Feature Tests
Testing my new feature
"""
import pytest
from pages.home_page import HomePage

class TestMyFeature:
    """Test my feature"""
    
    @pytest.mark.smoke
    def test_001_feature_works(self, page):
        """Test feature does something"""
        home = HomePage(page)
        home.goto_home()
        
        # Your test code
        assert page.is_visible("text=כותרת")
```

### 3. Run it
```bash
pytest tests/test_my_feature.py -v
```

## 🚦 CI/CD Integration

Tests can run in:
- GitHub Actions
- GitLab CI
- CircleCI
- Jenkins

See `README.md` for GitHub Actions example.

## 📚 More Info

- Full README: `README.md`
- Test utilities: `utils/test_helpers.py`
- Page objects: `pages/`
- Configuration: `pytest.ini`, `conftest.py`

## 🆘 Need Help?

1. Check `reports/report.html` for detailed results
2. Look at `screenshots/` for visual confirmation
3. Run with `--headed` flag to watch execution
4. Check app logs in other terminal
5. Read test code - it's well commented!

## ⚡ Performance Tips

- Use `-n auto` for parallel execution (already in run_tests.sh)
- Run smoke tests first to catch critical issues fast
- Use markers to run related tests together
- Keep app running between test runs (faster startup)

---

**Happy Testing! 🎉**

Run `./run_tests.sh smoke` to get started!
