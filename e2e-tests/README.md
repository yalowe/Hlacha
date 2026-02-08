# E2E Tests for Kitzur Shulchan Aruch App

## Overview
Comprehensive end-to-end testing suite for the Kitzur app using Pytest and Playwright.

## Test Coverage

### 📝 Test Files (150+ tests total)

1. **test_navigation.py** (30 tests)
   - Basic navigation flows
   - Quick action buttons
   - Deep linking
   - Navigation state persistence

2. **test_daily_halacha.py** (20 tests)
   - Daily halacha calculation with modulo logic
   - Date display and badge
   - Single section per day
   - Fallback handling for missing sections
   - 6-year custom learning cycle

3. **test_parsha.py** (20 tests)
   - Hebcal API integration for accurate parsha
   - Modern gradient design
   - Hebrew parsha names
   - Combined parshiot handling
   - Fallback calculation when offline

4. **test_questions_qa.py** (26 tests)
   - Questions display and header padding
   - Badge counts (pending answers + unanswered)
   - Hebrew search functionality
   - Category filtering
   - Approval workflow
   - Singular/plural Hebrew forms

5. **test_search.py** (20 tests)
   - Hebrew text normalization
   - Nikud removal
   - Final letter conversion
   - Fuzzy matching
   - Search performance

6. **test_bookmarks.py** (20 tests)
   - "Saved Bookmarks" label updates
   - Adding/removing bookmarks
   - AsyncStorage persistence
   - Integration with daily halacha

7. **test_hebrew_content.py** (30 tests)
   - Hebrew text display
   - RTL layout
   - Hebrew numbers (gematria)
   - Font rendering
   - Mixed Hebrew/English content
   - Accessibility

8. **test_content_loading.py** (20 tests)
   - Chapter and section loading
   - Navigation between sections
   - Content caching
   - Error handling
   - Performance testing

## Setup

### Prerequisites
```bash
# Python 3.8+
python --version

# Node.js (for running the app)
node --version

# Install dependencies
cd e2e-tests
pip install -r requirements.txt
playwright install chromium
```

### Configuration
```bash
# Set base URL (default: http://localhost:8081)
export BASE_URL=http://localhost:8081

# Run app in one terminal
cd ../kitzur
npm start

# Wait for Metro bundler and Expo to start
# Then run tests in another terminal
```

## Running Tests

### Run All Tests
```bash
cd e2e-tests
pytest
```

### Run by Category
```bash
# Smoke tests (critical paths)
pytest -m smoke

# Hebrew-specific tests
pytest -m hebrew

# Navigation tests
pytest -m navigation

# Content loading tests  
pytest -m content

# Questions & Answers tests
pytest -m questions

# Performance tests
pytest -m performance

# Visual/UI tests
pytest -m visual
```

### Run Specific File
```bash
# Daily halacha tests
pytest tests/test_daily_halacha.py

# Parsha tests
pytest tests/test_parsha.py

# Q&A tests
pytest tests/test_questions_qa.py

# Search tests
pytest tests/test_search.py
```

### Run Specific Test
```bash
pytest tests/test_daily_halacha.py::TestDailyHalachaCalculation::test_001_daily_halacha_appears_on_home
```

### Run with Options
```bash
# Verbose output
pytest -v

# Show print statements
pytest -s

# Stop on first failure
pytest -x

# Run in parallel (faster)
pytest -n auto

# Generate HTML report
pytest --html=reports/report.html

# Show slowest tests
pytest --durations=10
```

## Test Markers

Available markers (defined in pytest.ini):
- `smoke` - Critical path tests (fast, run first)
- `regression` - Full regression suite
- `navigation` - Navigation and routing
- `content` - Content loading and display
- `hebrew` - Hebrew text and RTL
- `questions` - Questions & Answers module
- `bookmarks` - Bookmarks functionality
- `progress` - Progress tracking
- `settings` - Settings and preferences
- `admin` - Admin and permissions
- `performance` - Performance and load tests
- `visual` - Visual regression tests
- `accessibility` - Accessibility tests
- `offline` - Offline functionality
- `integration` - Integration tests
- `slow` - Tests taking >30s

## Page Objects

Located in `pages/`:
- `base_page.py` - Common functionality for all pages
- `home_page.py` - Main dashboard
- `browse_page.py` - Browse chapters
- `chapter_page.py` - Chapter view
- `section_page.py` - Individual section view
- `questions_page.py` - Q&A functionality

## Reports

Test reports are generated in `reports/`:
- `report.html` - HTML test report
- `coverage/` - Code coverage reports
- `allure-results/` - Allure test results

View HTML report:
```bash
open reports/report.html
```

## Screenshots

Failed test screenshots are saved to `screenshots/` with timestamp and test name.

## Test Data

Test data and fixtures in `test_data/` (if needed).

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd e2e-tests
          pip install -r requirements.txt
          playwright install chromium
      
      - name: Start app
        run: |
          cd kitzur
          npm ci
          npm start &
          sleep 30  # Wait for app to start
      
      - name: Run tests
        run: |
          cd e2e-tests
          pytest -m smoke --html=reports/report.html
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: e2e-tests/reports/
```

## Best Practices

1. **Test Independence**: Each test should be independent and not rely on others
2. **Wait Strategies**: Use explicit waits, not sleep()
3. **Selectors**: Prefer text content over CSS classes (more stable)
4. **Hebrew Support**: All tests support RTL and Hebrew text
5. **Mobile First**: Tests configured for mobile viewport (iPhone 14 Pro)
6. **Clean Up**: Tests clean up after themselves (bookmarks, etc.)

## Debugging

### Run with headed browser
```bash
pytest --headed
```

### Run with slow motion
```bash
pytest --slowmo=1000  # 1 second delay between actions
```

### Debug specific test
```bash
pytest tests/test_daily_halacha.py::test_001 -v -s --headed
```

### Pause execution
Add `page.pause()` in test code to open Playwright Inspector.

## Maintenance

### Adding New Tests
1. Create test file in `tests/` following naming: `test_*.py`
2. Use appropriate markers from pytest.ini
3. Follow existing Page Object structure
4. Add Hebrew text support where needed
5. Update this README

### Updating Page Objects
1. Modify files in `pages/`
2. Keep selectors stable (prefer text over classes)
3. Add helper methods for common actions
4. Document complex interactions

## Known Issues

- Some tests may be flaky due to async loading
- Network-dependent tests (Hebcal API) may fail offline
- Mobile browser emulation differs from real device

## Support

For questions or issues:
1. Check test output and screenshots
2. Review reports/report.html for detailed results
3. Run specific test with `-v -s --headed` for debugging
4. Check app logs in parallel terminal

## Test Statistics

- **Total Tests**: 150+
- **Coverage Areas**: 8
- **Page Objects**: 6
- **Markers**: 15
- **Average Runtime**: ~5-10 minutes (full suite)
- **Smoke Tests**: ~2 minutes

## Recent Additions

✨ **New in this version:**
- Daily halacha modulo logic tests
- Parsha Hebcal API integration tests
- Hebrew singular/plural grammar tests
- Pending answers badge tests
- Hebrew search normalization tests
- Saved bookmarks label tests
- Modern gradient design tests
- Hebrew content and RTL layout tests
