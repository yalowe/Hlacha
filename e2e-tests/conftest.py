"""
Pytest Configuration and Global Fixtures
Shared setup for all E2E tests
"""
import pytest
import os
import json
from datetime import datetime
from pathlib import Path
from playwright.sync_api import Page, Browser, BrowserContext, Playwright
from typing import Dict, Generator, Any

# Constants
BASE_URL = os.getenv('BASE_URL', 'http://localhost:8081')
SCREENSHOTS_DIR = Path(__file__).parent / 'screenshots'
TEST_DATA_DIR = Path(__file__).parent / 'test_data'
REPORTS_DIR = Path(__file__).parent / 'reports'

# Ensure directories exist
SCREENSHOTS_DIR.mkdir(exist_ok=True)
TEST_DATA_DIR.mkdir(exist_ok=True)
REPORTS_DIR.mkdir(exist_ok=True)


# ==================== Browser Fixtures ====================

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """Configure browser context with common settings"""
    return {
        **browser_context_args,
        "viewport": {"width": 390, "height": 844},  # iPhone 14 Pro
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
        "locale": "he-IL",
        "timezone_id": "Asia/Jerusalem",
        "permissions": ["geolocation", "notifications"],
        "has_touch": True,
        "is_mobile": True,
    }


@pytest.fixture(scope="function")
def page(context: BrowserContext) -> Generator[Page, None, None]:
    """Create a new page for each test with proper cleanup"""
    page = context.new_page()
    page.set_default_timeout(30000)  # 30 seconds
    
    # Navigate to base URL
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    
    yield page
    
    # Cleanup
    page.close()


@pytest.fixture(scope="function")
def authenticated_page(page: Page) -> Page:
    """Page with authenticated admin user"""
    # Navigate to settings
    page.click("text=הגדרות")
    page.wait_for_timeout(1000)
    
    # Enter admin code
    page.fill('input[placeholder="הזן קוד מנהל"]', 'KITZUR2026')
    page.click('text=אשר')
    page.wait_for_timeout(2000)
    
    # Verify admin status
    assert page.is_visible('text=SuperAdmin פעיל'), "Admin authentication failed"
    
    return page


# ==================== Data Fixtures ====================

@pytest.fixture
def test_chapter_data() -> Dict[str, Any]:
    """Sample chapter data for testing"""
    return {
        "id": "siman-001",
        "simanLabel": "סימן א",
        "simanNumber": 1,
        "title": "סדר השכמת הבוקר",
        "sections": [
            {
                "section": 1,
                "text": "יִתְגַּבֵּר כַּאֲרִי לַעֲמוֹד בַּבֹּקֶר לַעֲבוֹדַת בּוֹרְאוֹ"
            }
        ]
    }


@pytest.fixture
def test_question_data() -> Dict[str, Any]:
    """Sample question DATA for testing"""
    return {
        "id": "q-001",
        "title": "שאלת בדיקה",
        "category": "הלכה",
        "text": "האם מותר לעשות כך?",
        "answers": [],
        "ratings": {}
    }


@pytest.fixture
def hebrew_test_strings() -> Dict[str, str]:
    """Hebrew strings for RTL testing"""
    return {
        "simple": "שלום עולם",
        "with_nikud": "בָּרוּךְ אַתָּה יְיָ",
        "mixed": "Hello שלום 123",
        "punctuation": "האם כך? כן!",
        "parentheses": "(בְּרֵאשִׁית)",
        "long": "קִיצוּר שֻׁלְחָן עָרוּךְ הוא ספר הלכה שנכתב על ידי הרב שלמה גנצפריד"
    }


# ==================== Screenshot Fixtures ====================

@pytest.fixture(autouse=True)
def screenshot_on_failure(request, page: Page):
    """Automatically capture screenshot on test failure"""
    yield
    
    if request.node.rep_call.failed:
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        test_name = request.node.name
        screenshot_path = SCREENSHOTS_DIR / f"{test_name}-{timestamp}.png"
        
        page.screenshot(path=str(screenshot_path), full_page=True)
        print(f"\n📸 Screenshot saved: {screenshot_path}")
        
        # Also save HTML
        html_path = SCREENSHOTS_DIR / f"{test_name}-{timestamp}.html"
        html_path.write_text(page.content())


@pytest.fixture
def capture_screenshot(page: Page):
    """Manual screenshot capture helper"""
    def _capture(name: str, full_page: bool = True):
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        path = SCREENSHOTS_DIR / f"{name}-{timestamp}.png"
        page.screenshot(path=str(path), full_page=full_page)
        return path
    
    return _capture


# ==================== Performance Fixtures ====================

@pytest.fixture
def measure_performance(page: Page):
    """Measure page load and interaction performance"""
    metrics = {}
    
    def _measure(action_name: str):
        start_time = datetime.now()
        
        def end_measure():
            end_time = datetime.now()
            duration_ms = (end_time - start_time).total_milliseconds()
            metrics[action_name] = duration_ms
            return duration_ms
        
        return end_measure
    
    yield _measure
    
    # Log all metrics after test
    if metrics:
        print("\n⚡ Performance Metrics:")
        for action, duration in metrics.items():
            print(f"  {action}: {duration}ms")


# ==================== Storage Fixtures ====================

@pytest.fixture
def clear_storage(page: Page):
    """Clear AsyncStorage before tests"""
    page.evaluate("""
        async () => {
            if (window.AsyncStorage) {
                await window.AsyncStorage.clear();
            }
        }
    """)


@pytest.fixture
def mock_storage_data(page: Page):
    """Insert mock data into AsyncStorage"""
    def _insert(key: str, value: Any):
        page.evaluate(f"""
            async () => {{
                await window.AsyncStorage.setItem(
                    '{key}',
                    JSON.stringify({json.dumps(value)})
                );
            }}
        """)
    
    return _insert


# ==================== Network Fixtures ====================

@pytest.fixture
def block_images(page: Page):
    """Block image loading for faster tests"""
    page.route("**/*.{png,jpg,jpeg,gif,svg,webp}", lambda route: route.abort())


@pytest.fixture
def mock_api_response(page: Page):
    """Mock API responses"""
    def _mock(url_pattern: str, response_data: Dict):
        page.route(
            url_pattern,
            lambda route: route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps(response_data)
            )
        )
    
    return _mock


@pytest.fixture
def simulate_offline(page: Page):
    """Simulate offline mode"""
    page.context.set_offline(True)
    yield
    page.context.set_offline(False)


# ==================== Hooks ====================

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Make test results available to fixtures"""
    outcome = yield
    rep = outcome.get_result()
    setattr(item, "rep_" + rep.when, rep)


def pytest_configure(config):
    """Configure pytest"""
    print(f"\n🚀 Starting Kitzur App E2E Tests")
    print(f"📍 Base URL: {BASE_URL}")
    print(f"📁 Screenshots: {SCREENSHOTS_DIR}")
    print(f"📊 Reports: {REPORTS_DIR}\n")


def pytest_sessionfinish(session, exitstatus):
    """Session cleanup"""
    print(f"\n✅ Test session finished with status: {exitstatus}")
