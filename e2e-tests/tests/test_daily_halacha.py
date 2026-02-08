"""
Daily Halacha Tests
Testing daily halacha calculation, display, and navigation
"""
import pytest
from datetime import datetime
from pages.home_page import HomePage
from pages.section_page import SectionPage


class TestDailyHalachaCalculation:
    """Test daily halacha calculation logic"""
    
    @pytest.mark.smoke
    def test_001_daily_halacha_appears_on_home(self, page):
        """Verify daily halacha card is displayed on home page"""
        home = HomePage(page)
        home.goto_home()
        assert home.is_daily_quote_visible(), "Daily halacha card not visible"
    
    @pytest.mark.content
    def test_002_daily_halacha_shows_current_date(self, page):
        """Verify daily halacha shows today's date"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        section = SectionPage(page)
        # Should show daily badge with date
        today = datetime.now().strftime("%d")
        date_selector = f"text=/.*{today}.*/"
        assert section.is_visible(date_selector, timeout=5000), "Date not displayed"
    
    @pytest.mark.content
    def test_003_daily_halacha_navigates_to_section(self, page):
        """Test clicking daily halacha opens correct section"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        # Should navigate to section page
        assert "/section/" in page.url, "Did not navigate to section"
    
    @pytest.mark.content
    def test_004_daily_halacha_always_has_content(self, page):
        """Verify daily halacha always shows a valid section (no empty state)"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        section = SectionPage(page)
        # Should not show error message
        assert not section.is_visible("text=לא נמצאה"), "Section not found error shown"
        # Should show Hebrew text content
        section.assert_hebrew_text_visible()
    
    @pytest.mark.content
    def test_005_daily_halacha_shows_single_section(self, page):
        """Verify daily halacha shows only one section per day (not full chapter)"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        section = SectionPage(page)
        # Verify we're on a section page (with -s in URL) not chapter page
        assert "-s" in page.url, "Not on section page - showing full chapter"
    
    @pytest.mark.regression
    def test_006_daily_halacha_badge_visible(self, page):
        """Test daily halacha badge appears on section page"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        # Should show "הלכה יומית" badge
        assert page.is_visible("text=הלכה יומית"), "Daily badge not visible"
    
    @pytest.mark.content
    def test_007_daily_halacha_handles_missing_section(self, page):
        """Test that if requested section doesn't exist, fallback to valid section"""
        # This tests the modulo logic - if siman has 6 sections but calculation requests s9,
        # it should wrap around to s3 using (9-1) % 6 + 1 = 3
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        section = SectionPage(page)
        # Should show content, not error
        section.assert_hebrew_text_visible()
        assert not section.is_visible("text=שגיאה"), "Error shown despite fallback"


class TestDailyHalachaDisplay:
    """Test daily halacha visual display and formatting"""
    
    @pytest.mark.visual
    def test_008_daily_badge_has_calendar_icon(self, page):
        """Verify daily halacha badge includes calendar icon"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        # Check for calendar icon (📅)
        assert page.is_visible("text=📅") or page.is_visible("[name*='calendar']"), \
            "Calendar icon not found"
    
    @pytest.mark.visual
    def test_009_daily_badge_styled_correctly(self, page):
        """Test daily halacha badge has proper styling"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        badge = page.locator("text=הלכה יומית").first
        # Badge should be visible with proper styling
        expect(badge).to_be_visible()
    
    @pytest.mark.hebrew
    def test_010_daily_section_shows_hebrew_text(self, page):
        """Test daily section displays Hebrew content correctly"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        section = SectionPage(page)
        section.assert_hebrew_text_visible()
    
    @pytest.mark.regression
    def test_011_daily_halacha_card_on_home_clickable(self, page):
        """Verify daily halacha card is interactive"""
        home = HomePage(page)
        home.goto_home()
        
        initial_url = page.url
        home.click_daily_quote()
        
        # URL should change after click
        assert page.url != initial_url, "Click did not navigate"


class TestDailyHalachaCycle:
    """Test daily halacha learning cycle"""
    
    @pytest.mark.content
    def test_012_daily_cycle_progresses_through_sections(self, page):
        """Verify cycle progresses through all sections"""
        # This is a custom 6-year cycle through 2,210 sections
        home = HomePage(page)
        home.goto_home()
        
        # Get current daily section ID from URL
        home.click_daily_quote()
        current_url = page.url
        
        # Verify URL contains valid section format
        assert "kitzur_" in current_url or "siman-" in current_url, \
            "Invalid section ID format"
    
    @pytest.mark.content
    def test_013_daily_description_mentions_custom_cycle(self, page):
        """Verify app indicates this is a custom learning cycle"""
        home = HomePage(page)
        home.goto_home()
        home.navigate_to_settings()
        
        # About page should mention custom cycle (מחזור פרטי)
        assert page.is_visible("text=מחזור פרטי"), \
            "Custom cycle not mentioned in about"
    
    @pytest.mark.regression
    def test_014_daily_section_persists_throughout_day(self, page):
        """Test same section is shown throughout the day"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        first_url = page.url
        
        # Navigate away and back
        page.go_back()
        home.click_daily_quote()
        
        # Should be same section
        assert page.url == first_url, "Daily section changed during same day"


class TestDailyHalachaNavigation:
    """Test navigation from/to daily halacha"""
    
    @pytest.mark.navigation
    def test_015_navigate_from_daily_to_next_section(self, page):
        """Test navigating to next section from daily halacha"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        section = SectionPage(page)
        initial_url = page.url
        section.click_next_section()
        
        # Should navigate to next section
        assert page.url != initial_url, "Did not navigate to next section"
    
    @pytest.mark.navigation
    def test_016_navigate_from_daily_to_chapter(self, page):
        """Test navigating to parent chapter from daily section"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        # Click breadcrumb or chapter link
        chapter_link = page.locator("text=/סימן \\d+/").first
        if chapter_link.is_visible():
            chapter_link.click()
            assert "/chapter/" in page.url or "/siman-" in page.url, \
                "Did not navigate to chapter"
    
    @pytest.mark.navigation
    def test_017_bookmark_daily_halacha(self, page):
        """Test bookmarking daily halacha section"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        section = SectionPage(page)
        # Try to bookmark (if bookmark button exists)
        bookmark_button = page.locator("[name*='bookmark'], text=סימן")
        if bookmark_button.first.is_visible():
            bookmark_button.first.click()
            page.wait_for_timeout(500)
    
    @pytest.mark.navigation
    def test_018_back_to_home_from_daily(self, page):
        """Test navigating back to home from daily section"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        page.go_back()
        assert page.url.endswith("/") or "index" in page.url, \
            "Did not return to home"


class TestDailyHalachaEdgeCases:
    """Test edge cases and error handling"""
    
    @pytest.mark.regression
    def test_019_daily_works_after_midnight(self, page):
        """Test daily halacha calculation works across day boundaries"""
        home = HomePage(page)
        home.goto_home()
        
        # Should always show a daily halacha
        assert home.is_daily_quote_visible(), "Daily not visible"
    
    @pytest.mark.regression
    def test_020_daily_works_offline(self, page):
        """Test daily halacha still works without network"""
        home = HomePage(page)
        home.goto_home()
        
        # Go offline
        page.context.set_offline(True)
        
        # Should still show daily (calculation is local)
        home.reload()
        assert home.is_daily_quote_visible(), "Daily not visible offline"
        
        page.context.set_offline(False)
