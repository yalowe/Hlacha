"""
Questions Page Object
Questions & Answers functionality
"""
from .base_page import BasePage
from playwright.sync_api import Page


class QuestionsPage(BasePage):
    """Questions and answers functionality"""
    
    def __init__(self, page: Page):
        super().__init__(page)
        
        # Locators
        self.page_title = "text=שאלות ותשובות"
        self.search_bar = "input[placeholder*='חיפוש']"
        self.category_filters = "[class*='categoryFilter']"
        self.sort_options = "[class*='sortOptions']"
        self.question_cards = "[class*='questionCard']"
        self.ask_question_button = "text=שאל שאלה"
        self.filter_unanswered = "text=לא נענו"
        self.filter_answered = "text=נענו"
    
    def goto_questions(self):
        """Navigate to questions page"""
        self.goto("questions")
        self.wait_for_selector(self.page_title)
    
    def search_questions(self, query: str):
        """Search for questions"""
        self.fill(self.search_bar, query)
        self.wait_for_timeout(800)
    
    def filter_by_category(self, category: str):
        """Filter questions by category"""
        self.click(f"text={category}")
        self.wait_for_timeout(500)
    
    def filter_unanswered_only(self):
        """Show only unanswered questions"""
        self.click(self.filter_unanswered)
        self.wait_for_timeout(500)
    
    def sort_by_rating(self):
        """Sort by rating descending"""
        self.click("text=לפי דירוג")
        self.wait_for_timeout(500)
    
    def get_questions_count(self) -> int:
        """Count visible questions"""
        return len(self.get_elements(self.question_cards))
    
    def click_first_question(self):
        """Open first question"""
        self.click(f"{self.question_cards}:first-of-type")
        self.wait_for_url("**/question/**")
    
    def click_ask_question(self):
        """Navigate to ask question form"""
        self.click(self.ask_question_button)
        self.wait_for_url("**/ask-question")
    
    def get_question_title(self, index: int = 0) -> str:
        """Get question title by index"""
        selector = f"{self.question_cards}:nth-of-type({index + 1}) [class*='title']"
        return self.get_text(selector)
    
    def assert_questions_loaded(self):
        """Verify questions are displayed"""
        count = self.get_questions_count()
        assert count > 0, "No questions loaded"
