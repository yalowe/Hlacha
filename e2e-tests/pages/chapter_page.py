"""
Chapter Page Object
Single chapter with sections
"""
from .base_page import BasePage
from playwright.sync_api import Page


class ChapterPage(BasePage):
    """Chapter reading and interaction"""
    
    def __init__(self, page: Page):
        super().__init__(page)
        
        # Locators
        self.chapter_title = "[class*='chapterTitle']"
        self.chapter_number = "[class*='chapterNumber']"
        self.sections_list = "[class*='sectionsList']"
        self.section_items = "[class*='sectionItem']"
        self.mark_complete_button = "text=סמן כהושלם"
        self.back_button = "[aria-label='חזור']"
    
    def goto_chapter(self, chapter_id: str):
        """Navigate to specific chapter"""
        self.goto(f"chapter/{chapter_id}")
        self.wait_for_selector(self.chapter_title)
    
    def get_chapter_title(self) -> str:
        """Get chapter title"""
        return self.get_text(self.chapter_title)
    
    def get_sections_count(self) -> int:
        """Count sections in chapter"""
        return len(self.get_elements(self.section_items))
    
    def click_section(self, section_number: int):
        """Click specific section"""
        selector = f"text=סעיף {section_number}"
        self.click(selector)
        self.wait_for_url("**/section/**")
    
    def mark_as_completed(self):
        """Mark chapter as completed"""
        self.click(self.mark_complete_button)
        self.wait_for_timeout(500)
    
    def is_marked_completed(self) -> bool:
        """Check if chapter is marked as completed"""
        return self.is_visible("text=בוטל סימון")
    
    def go_back_to_browse(self):
        """Navigate back to browse"""
        self.click(self.back_button)
        self.wait_for_url("**/browse")
