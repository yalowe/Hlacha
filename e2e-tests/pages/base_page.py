"""
Base Page Object
All page objects inherit from this class
"""
from playwright.sync_api import Page, Locator, expect
from typing import Optional
import time


class BasePage:
    """Base page object with common functionality"""
    
    def __init__(self, page: Page):
        self.page = page
        self.base_url = "http://localhost:8081"
    
    # ==================== Navigation ====================
    
    def goto(self, path: str = ""):
        """Navigate to a specific path"""
        url = f"{self.base_url}/{path}" if path else self.base_url
        self.page.goto(url)
        self.wait_for_page_load()
    
    def wait_for_page_load(self, timeout: int = 30000):
        """Wait for page to fully load"""
        self.page.wait_for_load_state("networkidle", timeout=timeout)
        self.page.wait_for_load_state("domcontentloaded", timeout=timeout)
    
    def reload(self):
        """Reload the current page"""
        self.page.reload()
        self.wait_for_page_load()
    
    def go_back(self):
        """Navigate back"""
        self.page.go_back()
        self.wait_for_page_load()
    
    # ==================== Element Interactions ====================
    
    def click(self, selector: str, timeout: int = 10000):
        """Click an element"""
        self.page.click(selector, timeout=timeout)
        self.page.wait_for_timeout(500)  # Brief pause after click
    
    def fill(self, selector: str, text: str):
        """Fill an input field"""
        self.page.fill(selector, text)
    
    def type(self, selector: str, text: str, delay: int = 100):
        """Type text with delay (simulates human typing)"""
        self.page.type(selector, text, delay=delay)
    
    def select_option(self, selector: str, value: str):
        """Select an option from dropdown"""
        self.page.select_option(selector, value)
    
    def check(self, selector: str):
        """Check a checkbox"""
        self.page.check(selector)
    
    def uncheck(self, selector: str):
        """Uncheck a checkbox"""
        self.page.uncheck(selector)
    
    # ==================== Element Queries ====================
    
    def get_element(self, selector: str) -> Locator:
        """Get a single element"""
        return self.page.locator(selector)
    
    def get_elements(self, selector: str) -> list[Locator]:
        """Get multiple elements"""
        return self.page.locator(selector).all()
    
    def get_text(self, selector: str) -> str:
        """Get element text content"""
        return self.page.locator(selector).text_content() or ""
    
    def get_attribute(self, selector: str, attribute: str) -> Optional[str]:
        """Get element attribute"""
        return self.page.locator(selector).get_attribute(attribute)
    
    def get_value(self, selector: str) -> str:
        """Get input value"""
        return self.page.locator(selector).input_value()
    
    # ==================== Visibility & State ====================
    
    def is_visible(self, selector: str, timeout: int = 5000) -> bool:
        """Check if element is visible"""
        try:
            return self.page.locator(selector).is_visible(timeout=timeout)
        except:
            return False
    
    def is_hidden(self, selector: str) -> bool:
        """Check if element is hidden"""
        return self.page.locator(selector).is_hidden()
    
    def is_enabled(self, selector: str) -> bool:
        """Check if element is enabled"""
        return self.page.locator(selector).is_enabled()
    
    def is_disabled(self, selector: str) -> bool:
        """Check if element is disabled"""
        return self.page.locator(selector).is_disabled()
    
    def is_checked(self, selector: str) -> bool:
        """Check if checkbox/radio is checked"""
        return self.page.locator(selector).is_checked()
    
    # ==================== Waiting ====================
    
    def wait_for_selector(self, selector: str, timeout: int = 10000):
        """Wait for element to appear"""
        self.page.wait_for_selector(selector, timeout=timeout)
    
    def wait_for_text(self, text: str, timeout: int = 10000):
        """Wait for specific text to appear"""
        self.page.wait_for_selector(f"text={text}", timeout=timeout)
    
    def wait_for_url(self, url_pattern: str, timeout: int = 10000):
        """Wait for URL to match pattern"""
        self.page.wait_for_url(url_pattern, timeout=timeout)
    
    def wait_for_timeout(self, milliseconds: int):
        """Wait for specific duration"""
        self.page.wait_for_timeout(milliseconds)
    
    def wait_for_element_hidden(self, selector: str, timeout: int = 10000):
        """Wait for element to disappear"""
        self.page.wait_for_selector(selector, state="hidden", timeout=timeout)
    
    # ==================== Assertions ====================
    
    def assert_visible(self, selector: str, message: str = ""):
        """Assert element is visible"""
        expect(self.page.locator(selector)).to_be_visible()
    
    def assert_hidden(self, selector: str):
        """Assert element is hidden"""
        expect(self.page.locator(selector)).to_be_hidden()
    
    def assert_text(self, selector: str, expected_text: str):
        """Assert element contains text"""
        expect(self.page.locator(selector)).to_contain_text(expected_text)
    
    def assert_exact_text(self, selector: str, expected_text: str):
        """Assert element has exact text"""
        expect(self.page.locator(selector)).to_have_text(expected_text)
    
    def assert_count(self, selector: str, expected_count: int):
        """Assert number of elements"""
        expect(self.page.locator(selector)).to_have_count(expected_count)
    
    def assert_url_contains(self, url_part: str):
        """Assert URL contains string"""
        expect(self.page).to_have_url(lambda url: url_part in url)
    
    def assert_attribute(self, selector: str, attribute: str, value: str):
        """Assert element attribute value"""
        expect(self.page.locator(selector)).to_have_attribute(attribute, value)
    
    # ==================== Scrolling ====================
    
    def scroll_to_element(self, selector: str):
        """Scroll element into view"""
        self.page.locator(selector).scroll_into_view_if_needed()
    
    def scroll_to_top(self):
        """Scroll to top of page"""
        self.page.evaluate("window.scrollTo(0, 0)")
    
    def scroll_to_bottom(self):
        """Scroll to bottom of page"""
        self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    
    def scroll_by(self, x: int, y: int):
        """Scroll by specific amount"""
        self.page.evaluate(f"window.scrollBy({x}, {y})")
    
    # ==================== Screenshots ====================
    
    def take_screenshot(self, name: str, full_page: bool = True) -> str:
        """Take a screenshot"""
        path = f"screenshots/{name}-{int(time.time())}.png"
        self.page.screenshot(path=path, full_page=full_page)
        return path
    
    def take_element_screenshot(self, selector: str, name: str) -> str:
        """Take screenshot of specific element"""
        path = f"screenshots/{name}-{int(time.time())}.png"
        self.page.locator(selector).screenshot(path=path)
        return path
    
    # ==================== JavaScript Execution ====================
    
    def execute_script(self, script: str, *args):
        """Execute JavaScript"""
        return self.page.evaluate(script, *args)
    
    def get_local_storage(self, key: str) -> Optional[str]:
        """Get localStorage item"""
        return self.execute_script(f"localStorage.getItem('{key}')")
    
    def set_local_storage(self, key: str, value: str):
        """Set localStorage item"""
        self.execute_script(f"localStorage.setItem('{key}', '{value}')")
    
    def clear_local_storage(self):
        """Clear all localStorage"""
        self.execute_script("localStorage.clear()")
    
    # ==================== Mobile Specific ====================
    
    def swipe_left(self):
        """Swipe left (mobile gesture)"""
        self.page.evaluate("window.scrollBy(300, 0)")
    
    def swipe_right(self):
        """Swipe right (mobile gesture)"""
        self.page.evaluate("window.scrollBy(-300, 0)")
    
    def swipe_up(self):
        """Swipe up (mobile gesture)"""
        self.page.evaluate("window.scrollBy(0, 300)")
    
    def swipe_down(self):
        """Swipe down (mobile gesture)"""
        self.page.evaluate("window.scrollBy(0, -300)")
    
    # ==================== Hebrew/RTL Helpers ====================
    
    def assert_rtl_direction(self, selector: str):
        """Assert element has RTL direction"""
        direction = self.get_attribute(selector, "dir")
        assert direction == "rtl", f"Element is not RTL. Direction: {direction}"
    
    def get_computed_style(self, selector: str, property: str) -> str:
        """Get computed CSS property"""
        return self.execute_script(
            f"getComputedStyle(document.querySelector('{selector}')).{property}"
        )
    
    # ==================== Debug Helpers ====================
    
    def pause(self):
        """Pause execution for debugging"""
        self.page.pause()
    
    def print_console_logs(self):
        """Print browser console logs"""
        logs = self.execute_script("console.log.toString()")
        print(f"Console logs: {logs}")
    
    def get_page_title(self) -> str:
        """Get page title"""
        return self.page.title()
    
    def get_current_url(self) -> str:
        """Get current URL"""
        return self.page.url
