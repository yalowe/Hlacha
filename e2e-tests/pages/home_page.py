"""
Home Page Object
Main screen with daily learning, quick actions, and recent questions
"""
from .base_page import BasePage
from playwright.sync_api import Page, expect


class HomePage(BasePage):
    """Home page interactions and verifications"""
    
    def __init__(self, page: Page):
        super().__init__(page)
        
        # Locators
        self.home_tab = "text=בית"
        self.daily_quote_title = "text=הלכה יומית"
        self.continue_learning_card = "[class*='continueLearning']"
        self.progress_ring = "[class*='progressRing']"
        self.streak_counter = "text=ימים ברצף"
        self.quick_actions_grid = "[class*='quickActions']"
        self.recent_questions = "text=שאלות אחרונות"
        
        # Quick Actions
        self.browse_button = "text=דפדוף"
        self.questions_button = "text=שאלות ותשובות"
        self.bookmarks_button = "text=סימניות"
        self.parsha_button = "text=פרשת השבוע"
        
    # ==================== Navigation ====================
    
    def goto_home(self):
        """Navigate to home page"""
        self.goto("")
        self.wait_for_home_loaded()
    
    def wait_for_home_loaded(self):
        """Wait for home page to fully load"""
        self.wait_for_selector(self.daily_quote_title, timeout=15000)
        self.wait_for_page_load()
    
    def click_home_tab(self):
        """Click home tab in navigation"""
        self.click(self.home_tab)
        self.wait_for_home_loaded()
    
    # ==================== Daily Quote ====================
    
    def is_daily_quote_visible(self) -> bool:
        """Check if daily quote card is visible"""
        return self.is_visible(self.daily_quote_title)
    
    def get_daily_quote_title(self) -> str:
        """Get the current daily halacha title"""
        selector = f"{self.daily_quote_title} + *"
        return self.get_text(selector)
    
    def click_daily_quote(self):
        """Click on daily quote card to navigate to section"""
        self.click(self.daily_quote_title)
        self.wait_for_url("**/section/**")
    
    def assert_daily_quote_shows_chapter(self, chapter_number: int):
        """Verify daily quote shows specific chapter"""
        selector = f"text=סימן {chapter_number}"
        self.assert_visible(selector)
    
    # ==================== Continue Learning ====================
    
    def is_continue_learning_visible(self) -> bool:
        """Check if continue learning card exists"""
        return self.is_visible(self.continue_learning_card)
    
    def click_continue_learning(self):
        """Click continue learning card"""
        self.click(self.continue_learning_card)
        self.wait_for_timeout(1000)
    
    def get_continue_learning_text(self) -> str:
        """Get continue learning card text"""
        return self.get_text(self.continue_learning_card)
    
    # ==================== Progress Ring ====================
    
    def is_progress_ring_visible(self) -> bool:
        """Check if progress ring is displayed"""
        return self.is_visible(self.progress_ring)
    
    def get_progress_percentage(self) -> str:
        """Get progress percentage text"""
        selector = f"{self.progress_ring} text='%'"
        return self.get_text(selector)
    
    def get_completed_sections_count(self) -> str:
        """Get count of completed sections"""
        selector = "text=סימנים שהושלמו"
        return self.get_text(selector)
    
    # ==================== Streak Counter ====================
    
    def is_streak_counter_visible(self) -> bool:
        """Check if streak counter is shown"""
        return self.is_visible(self.streak_counter)
    
    def get_streak_days(self) -> int:
        """Get current streak in days"""
        selector = f"{self.streak_counter}"
        text = self.get_text(selector)
        # Extract number from "X ימים ברצף"
        import re
        match = re.search(r'(\d+)', text)
        return int(match.group(1)) if match else 0
    
    def assert_streak_greater_than(self, minimum: int):
        """Assert streak is at least minimum days"""
        streak = self.get_streak_days()
        assert streak >= minimum, f"Streak {streak} is less than {minimum}"
    
    # ==================== Quick Actions ====================
    
    def is_quick_actions_visible(self) -> bool:
        """Check if quick actions grid is shown"""
        return self.is_visible(self.quick_actions_grid)
    
    def click_browse(self):
        """Click browse quick action"""
        self.click(self.browse_button)
        self.wait_for_url("**/browse")
    
    def click_questions(self):
        """Click questions quick action"""
        self.click(self.questions_button)
        self.wait_for_url("**/questions")
    
    def click_bookmarks(self):
        """Click bookmarks quick action"""
        self.click(self.bookmarks_button)
        self.wait_for_url("**/bookmarks")
    
    def click_parsha(self):
        """Click parsha quick action"""
        self.click(self.parsha_button)
        self.wait_for_url("**/shnayim-mikra")
    
    def assert_all_quick_actions_visible(self):
        """Verify all quick action buttons are present"""
        self.assert_visible(self.browse_button, "Browse button not visible")
        self.assert_visible(self.questions_button, "Questions button not visible")
        self.assert_visible(self.bookmarks_button, "Bookmarks button not visible")
        self.assert_visible(self.parsha_button, "Parsha button not visible")
    
    # ==================== Recent Questions ====================
    
    def is_recent_questions_visible(self) -> bool:
        """Check if recent questions section exists"""
        return self.is_visible(self.recent_questions)
    
    def get_recent_questions_count(self) -> int:
        """Count visible recent questions"""
        questions = self.get_elements("[class*='questionCard']")
        return len(questions)
    
    def click_first_recent_question(self):
        """Click on the first recent question"""
        self.click("[class*='questionCard']:first-of-type")
        self.wait_for_url("**/question/**")
    
    def get_recent_question_title(self, index: int = 0) -> str:
        """Get title of a recent question by index"""
        selector = f"[class*='questionCard']:nth-of-type({index + 1}) [class*='questionTitle']"
        return self.get_text(selector)
    
    def assert_recent_questions_exist(self):
        """Verify at least one recent question is shown"""
        count = self.get_recent_questions_count()
        assert count > 0, "No recent questions visible"
    
    # ==================== Bottom Navigation ====================
    
    def navigate_to_browse(self):
        """Navigate using bottom tab"""
        self.click("text=דפדוף")
        self.wait_for_timeout(1000)
    
    def navigate_to_questions(self):
        """Navigate to questions tab"""
        self.click("text=שאלות")
        self.wait_for_timeout(1000)
    
    def navigate_to_settings(self):
        """Navigate to settings tab"""
        self.click("text=הגדרות")
        self.wait_for_timeout(1000)
    
    # ==================== Assertions ====================
    
    def assert_home_page_loaded(self):
        """Comprehensive check that home page loaded correctly"""
        self.assert_visible(self.daily_quote_title, "Daily quote not visible")
        self.assert_visible(self.progress_ring, "Progress ring not visible")
        self.assert_visible(self.quick_actions_grid, "Quick actions not visible")
    
    def assert_hebrew_text_displayed(self):
        """Verify Hebrew content is showing correctly"""
        # Check if main text elements contain Hebrew characters
        title_text = self.get_text(self.daily_quote_title)
        assert any(ord(c) >= 0x0590 and ord(c) <= 0x05FF for c in title_text), \
            "No Hebrew characters found in daily quote"
    
    def assert_rtl_layout(self):
        """Verify RTL (Right-to-Left) layout is applied"""
        direction = self.get_attribute("body", "dir")
        assert direction == "rtl", f"Body does not have RTL direction: {direction}"
