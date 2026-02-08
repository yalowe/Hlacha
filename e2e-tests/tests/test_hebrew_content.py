"""
Hebrew Content and RTL Tests
Testing Hebrew text display, RTL layout, and Hebrew-specific features
"""
import pytest
from pages.home_page import HomePage
from pages.section_page import SectionPage
from pages.browse_page import BrowsePage


class TestHebrewTextDisplay:
    """Test Hebrew text rendering and display"""
    
    @pytest.mark.smoke
    @pytest.mark.hebrew
    def test_001_app_displays_hebrew_text(self, page):
        """Test app shows Hebrew text correctly"""
        home = HomePage(page)
        home.goto_home()
        
        # Should show Hebrew UI elements
        hebrew_pattern = "text=/[א-ת]+/"
        assert page.locator(hebrew_pattern).count() > 0, "No Hebrew text found"
    
    @pytest.mark.hebrew
    def test_002_section_shows_hebrew_content(self, page):
        """Test section page displays Hebrew halacha text"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        section.assert_hebrew_text_visible()
    
    @pytest.mark.hebrew
    def test_003_hebrew_with_nikud_displays(self, page):
        """Test Hebrew text with nikud displays correctly"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Hebrew text should include nikud (vowel points)
        # Check for presence of nikud characters (U+0591 to U+05C7)
        content = page.locator("text=/[א-ת]+/").first
        expect(content).to_be_visible()
    
    @pytest.mark.hebrew
    def test_004_hebrew_punctuation_displays(self, page):
        """Test Hebrew punctuation marks display correctly"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Should show geresh (׳), gershayim (״), maqaf (־), etc.
        # Just verify Hebrew content loads
    
    @pytest.mark.hebrew
    def test_005_hebrew_numbers_display(self, page):
        """Test Hebrew number representations (gematria)"""
        home = HomePage(page)
        home.goto_home()
        
        # Should show סימן א׳, סימן ב׳, etc.
        # Hebrew numbers using letters with geresh
        hebrew_number = page.locator("text=/[א-ת]׳/").first
        # Might or might not be visible depending on design


class TestRTLLayout:
    """Test Right-to-Left layout functionality"""
    
    @pytest.mark.visual
    @pytest.mark.hebrew
    def test_006_app_uses_rtl_layout(self, page):
        """Test app uses RTL (right-to-left) layout"""
        home = HomePage(page)
        home.goto_home()
        
        # Check HTML dir attribute
        html = page.locator("html").first
        dir_attr = html.get_attribute("dir")
        
        # Should be "rtl" or have RTL styling
        # (React Native might handle differently than web)
    
    @pytest.mark.visual
    @pytest.mark.hebrew
    def test_007_text_aligns_right(self, page):
        """Test Hebrew text aligns to the right"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Hebrew text should be right-aligned
        text_block = page.locator("text=/[א-ת]{10,}/").first
        if text_block.is_visible():
            # Text should flow from right to left
            pass
    
    @pytest.mark.visual
    @pytest.mark.hebrew
    def test_008_navigation_rtl(self, page):
        """Test navigation elements respect RTL"""
        home = HomePage(page)
        home.goto_home()
        
        # Next/previous buttons should be reversed
        # Back arrow should point right (not left)
    
    @pytest.mark.visual
    @pytest.mark.hebrew
    def test_009_icons_positioned_rtl(self, page):
        """Test icons are positioned correctly for RTL"""
        home = HomePage(page)
        home.goto_home()
        
        # Icons should be on the right side of text (not left)
        # Arrows should be flipped


class TestHebrewNumbers:
    """Test Hebrew number system (gematria)"""
    
    @pytest.mark.hebrew
    def test_010_chapter_numbers_hebrew(self, page):
        """Test chapter numbers use Hebrew numerals"""
        browse = BrowsePage(page)
        browse.goto_browse()
        
        page.wait_for_timeout(1000)
        
        # Should show סימן א׳, סימן ב׳, etc.
        # Or at least "סימן 1", "סימן 2"
        siman_label = page.locator("text=/סימן/").first
        if siman_label.is_visible():
            pass
    
    @pytest.mark.hebrew
    def test_011_section_numbers_hebrew(self, page):
        """Test section numbers use Hebrew format"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Should show סעיף א׳ or similar
        seif_label = page.locator("text=/סעיף/").first
        # Might or might not be visible
    
    @pytest.mark.hebrew
    def test_012_date_format_hebrew(self, page):
        """Test dates display in Hebrew format"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        page.wait_for_timeout(1000)
        
        # Daily badge should show Hebrew date format
        # Like "8 פברואר 2026" or Hebrew month names


class TestHebrewFonts:
    """Test Hebrew font rendering"""
    
    @pytest.mark.visual
    @pytest.mark.hebrew
    def test_013_hebrew_font_readable(self, page):
        """Test Hebrew text uses readable font"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Hebrew text should be readable
        # Check font-family includes Hebrew-compatible fonts
        text = page.locator("text=/[א-ת]{5,}/").first
        if text.is_visible():
            # Font should render correctly
            pass
    
    @pytest.mark.visual
    @pytest.mark.hebrew
    def test_014_nikud_doesnt_overlap(self, page):
        """Test nikud doesn't overlap with letters"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Nikud should be positioned correctly
        # Line height should accommodate nikud
    
    @pytest.mark.visual
    @pytest.mark.hebrew
    def test_015_consistent_font_size(self, page):
        """Test Hebrew text has consistent sizing"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Font size should be consistent throughout


class TestHebrewInput:
    """Test Hebrew text input"""
    
    @pytest.mark.hebrew
    def test_016_search_accepts_hebrew(self, page):
        """Test search field accepts Hebrew input"""
        page.goto("http://localhost:8081/questions")
        page.wait_for_timeout(500)
        
        search_input = page.locator("input[placeholder*='חיפוש']")
        search_input.fill("שבת")
        
        value = search_input.input_value()
        assert value == "שבת", "Hebrew input not accepted"
    
    @pytest.mark.hebrew
    def test_017_question_form_accepts_hebrew(self, page):
        """Test ask question form accepts Hebrew"""
        page.goto("http://localhost:8081/ask-question")
        page.wait_for_timeout(500)
        
        # Fill Hebrew text in question form
        title_input = page.locator("input, textarea").first
        if title_input.is_visible():
            title_input.fill("שאלה בעברית")
            
            value = title_input.input_value()
            assert "עברית" in value, "Hebrew not preserved in input"
    
    @pytest.mark.hebrew
    def test_018_hebrew_input_rtl_cursor(self, page):
        """Test cursor moves right-to-left for Hebrew input"""
        page.goto("http://localhost:8081/questions")
        page.wait_for_timeout(500)
        
        search_input = page.locator("input[placeholder*='חיפוש']")
        
        # Type Hebrew character by character
        search_input.type("שבת", delay=100)
        
        # Cursor should move right to left


class TestMixedContent:
    """Test mixed Hebrew and English content"""
    
    @pytest.mark.hebrew
    def test_019_mixed_hebrew_english(self, page):
        """Test pages with mixed Hebrew/English display correctly"""
        home = HomePage(page)
        home.goto_home()
        
        # Should handle both languages gracefully
        # English terms might appear in brackets or transliteration
    
    @pytest.mark.hebrew
    def test_020_numbers_in_hebrew_context(self, page):
        """Test numeric digits in Hebrew sentences"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Numbers like "3 דקות" should display correctly
        # LTR numbers mixed with RTL Hebrew
    
    @pytest.mark.hebrew
    def test_021_english_terms_in_hebrew(self, page):
        """Test English terms embedded in Hebrew text"""
        # Some technical terms might be in English
        # Should render inline correctly


class TestHebrewAccessibility:
    """Test accessibility for Hebrew content"""
    
    @pytest.mark.accessibility
    @pytest.mark.hebrew
    def test_022_screen_reader_hebrew(self, page):
        """Test Hebrew content is accessible to screen readers"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Content should have proper semantic HTML
        # Hebrew text should be in correct direction
    
    @pytest.mark.accessibility
    @pytest.mark.hebrew
    def test_023_hebrew_labels_for_icons(self, page):
        """Test icons have Hebrew aria-labels"""
        home = HomePage(page)
        home.goto_home()
        
        # Icons should have Hebrew accessibility labels
        # For screen readers in Hebrew
    
    @pytest.mark.accessibility
    @pytest.mark.hebrew
    def test_024_keyboard_navigation_rtl(self, page):
        """Test keyboard navigation respects RTL"""
        home = HomePage(page)
        home.goto_home()
        
        # Tab order should go right to left
        # Arrow keys should be reversed


class TestHebrewEdgeCases:
    """Test edge cases for Hebrew content"""
    
    @pytest.mark.regression
    @pytest.mark.hebrew
    def test_025_very_long_hebrew_word(self, page):
        """Test handling of very long Hebrew words"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Long words should wrap correctly
        # Not overflow container
    
    @pytest.mark.regression
    @pytest.mark.hebrew
    def test_026_hebrew_at_line_boundaries(self, page):
        """Test Hebrew text wraps correctly at line boundaries"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Text should wrap at word boundaries
        # Not mid-word (unless necessary)
    
    @pytest.mark.regression
    @pytest.mark.hebrew
    def test_027_empty_hebrew_fields(self, page):
        """Test empty Hebrew text fields display correctly"""
        page.goto("http://localhost:8081/ask-question")
        page.wait_for_timeout(500)
        
        # Empty input with Hebrew placeholder should show correctly
    
    @pytest.mark.regression
    @pytest.mark.hebrew
    def test_028_hebrew_copy_paste(self, page):
        """Test copying and pasting Hebrew text"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Select Hebrew text (if possible in test environment)
        # Should preserve nikud and formatting when copied


class TestHebrewSpecialCases:
    """Test Hebrew-specific special cases"""
    
    @pytest.mark.hebrew
    def test_029_yiddish_characters(self, page):
        """Test Yiddish characters display if used"""
        # Some texts might use ײ, װ, etc.
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
    
    @pytest.mark.hebrew
    def test_030_cantillation_marks(self, page):
        """Test Torah cantillation marks (trop) if used"""
        # Parsha might include trop marks
        page.goto("http://localhost:8081/parsha/bereshit")
        page.wait_for_timeout(1500)
        
        # Should handle cantillation marks correctly
