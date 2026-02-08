"""
Browse Page Object
Chapter listing and navigation
"""
from .base_page import BasePage
from playwright.sync_api import Page


class BrowsePage(BasePage):
    """Browse chapters functionality"""
    
    def __init__(self, page: Page):
        super().__init__(page)
        
        # Locators
        self.page_title = "text=דפדוף בפרקים"
        self.chapter_list = "[class*='chapterList']"
        self.chapter_items = "[class*='chapterItem']"
        self.search_input = "input[placeholder*='חפש']"
        self.section_filter = "[class*='sectionFilter']"
    
    def goto_browse(self):
        """Navigate to browse page"""
        self.goto("browse")
        self.wait_for_selector(self.page_title)
    
    def get_chapters_count(self) -> int:
        """Count visible chapters"""
        return len(self.get_elements(self.chapter_items))
    
    def click_chapter(self, chapter_number: int):
        """Click specific chapter by number"""
        selector = f"text=סימן {chapter_number}"
        self.click(selector)
        self.wait_for_url(f"**/chapter/**")
    
    def search_chapters(self, query: str):
        """Search for chapters"""
        self.fill(self.search_input, query)
        self.wait_for_timeout(500)
    
    def get_first_chapter_title(self) -> str:
        """Get first chapter title"""
        selector = f"{self.chapter_items}:first-of-type [class*='title']"
        return self.get_text(selector)
    
    def assert_chapters_loaded(self):
        """Verify chapters are displayed"""
        count = self.get_chapters_count()
        assert count > 0, "No chapters loaded"
        assert count == 221, f"Expected 221 chapters, got {count}"
