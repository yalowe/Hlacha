"""
Section Page Object
Reading individual sections with Hebrew text
"""
from .base_page import BasePage
from playwright.sync_api import Page


class SectionPage(BasePage):
    """Section reading page"""
    
    def __init__(self, page: Page):
        super().__init__(page)
        
        # Locators
        self.section_text = "[class*='sectionText']"
        self.navigation_buttons = "[class*='navigation']"
        self.previous_button = "text=קודם"
        self.next_button = "text=הבא"
        self.bookmark_button = "[aria-label*='סימניה']"
        self.share_button = "text=שתף"
        self.text_size_controls = "[class*='textSize']"
    
    def goto_section(self, section_id: str):
        """Navigate to specific section"""
        self.goto(f"section/{section_id}")
        self.wait_for_selector(self.section_text)
    
    def get_section_text(self) -> str:
        """Get the Hebrew text content"""
        return self.get_text(self.section_text)
    
    def click_next_section(self):
        """Navigate to next section"""
        self.click(self.next_button)
        self.wait_for_timeout(1000)
    
    def click_previous_section(self):
        """Navigate to previous section"""
        self.click(self.previous_button)
        self.wait_for_timeout(1000)
    
    def toggle_bookmark(self):
        """Add/remove bookmark"""
        self.click(self.bookmark_button)
        self.wait_for_timeout(500)
    
    def is_bookmarked(self) -> bool:
        """Check if section is bookmarked"""
        # Check for filled bookmark icon
        return "bookmark" in self.get_attribute(self.bookmark_button, "name")
    
    def increase_text_size(self):
        """Increase text size"""
        self.click("text=גדול")
        self.wait_for_timeout(300)
    
    def decrease_text_size(self):
        """Decrease text size"""
        self.click("text=קטן")
        self.wait_for_timeout(300)
    
    def share_section(self):
        """Click share button"""
        self.click(self.share_button)
        self.wait_for_timeout(1000)
    
    def assert_hebrew_text_visible(self):
        """Verify Hebrew content is displayed"""
        text = self.get_section_text()
        assert len(text) > 0, "Section text is empty"
        # Check for Hebrew characters
        assert any(0x0590 <= ord(c) <= 0x05FF for c in text), \
            "No Hebrew characters in section text"
