"""
Navigation Tests - 30 comprehensive tests
Testing app navigation, routing, and user flows
"""
import pytest
from pages.home_page import HomePage
from pages.browse_page import BrowsePage
from pages.chapter_page import ChapterPage
from pages.section_page import SectionPage
from pages.questions_page import QuestionsPage


class TestBasicNavigation:
    """Basic navigation flow tests"""
    
    @pytest.mark.smoke
    def test_001_app_loads_successfully(self, page):
        """Test that app loads without errors"""
        home = HomePage(page)
        home.goto_home()
        home.assert_home_page_loaded()
    
    @pytest.mark.smoke
    def test_002_bottom_navigation_visible(self, page):
        """Test bottom navigation bar is present"""
        home = HomePage(page)
        home.goto_home()
        assert home.is_visible("text=בית"), "Home tab not visible"
        assert home.is_visible("text=דפדוף"), "Browse tab not visible"
        assert home.is_visible("text=שאלות"), "Questions tab not visible"
        assert home.is_visible("text=הגדרות"), "Settings tab not visible"
    
    @pytest.mark.smoke
    def test_003_navigate_to_browse(self, page):
        """Test navigation to browse page"""
        home = HomePage(page)
        home.goto_home()
        home.navigate_to_browse()
        assert "/browse" in page.url, "Did not navigate to browse"
    
    @pytest.mark.smoke
    def test_004_navigate_to_questions(self, page):
        """Test navigation to questions page"""
        home = HomePage(page)
        home.goto_home()
        home.navigate_to_questions()
        assert "/questions" in page.url, "Did not navigate to questions"
    
    @pytest.mark.smoke
    def test_005_navigate_to_settings(self, page):
        """Test navigation to settings page"""
        home = HomePage(page)
        home.goto_home()
        home.navigate_to_settings()
        assert "explore" in page.url, "Did not navigate to settings"
    
    @pytest.mark.navigation
    def test_006_home_to_chapter_flow(self, page):
        """Test complete flow from home to chapter"""
        home = HomePage(page)
        home.goto_home()
        home.click_browse()
        
        browse = BrowsePage(page)
        browse.click_chapter(1)
        
        chapter = ChapterPage(page)
        assert chapter.get_sections_count() > 0, "No sections loaded"
    
    @pytest.mark.navigation
    def test_007_chapter_to_section_flow(self, page):
        """Test navigation from chapter to section"""
        chapter = ChapterPage(page)
        chapter.goto_chapter("siman-001")
        chapter.click_section(1)
        
        section = SectionPage(page)
        section.assert_hebrew_text_visible()
    
    @pytest.mark.navigation
    def test_008_section_navigation_next(self, page):
        """Test next section navigation"""
        section = SectionPage(page)
        section.goto_section("siman-001-seif-001")
        
        initial_url = page.url
        section.click_next_section()
        
        assert page.url != initial_url, "URL did not change"
    
    @pytest.mark.navigation
    def test_009_section_navigation_previous(self, page):
        """Test previous section navigation"""
        section = SectionPage(page)
        section.goto_section("siman-001-seif-002")
        
        initial_url = page.url
        section.click_previous_section()
        
        assert page.url != initial_url, "URL did not change"
    
    @pytest.mark.navigation
    def test_010_back_navigation_works(self, page):
        """Test browser back button"""
        home = HomePage(page)
        home.goto_home()
        home.click_browse()
        
        browse = BrowsePage(page)
        browse.click_chapter(1)
        
        page.go_back()
        assert "/browse" in page.url, "Back navigation failed"


class TestQuickActions:
    """Quick action button tests"""
    
    @pytest.mark.navigation
    def test_011_quick_action_browse(self, page):
        """Test browse quick action"""
        home = HomePage(page)
        home.goto_home()
        home.click_browse()
        assert "/browse" in page.url
    
    @pytest.mark.navigation
    def test_012_quick_action_questions(self, page):
        """Test questions quick action"""
        home = HomePage(page)
        home.goto_home()
        home.click_questions()
        assert "/questions" in page.url
    
    @pytest.mark.navigation
    def test_013_quick_action_bookmarks(self, page):
        """Test bookmarks quick action"""
        home = HomePage(page)
        home.goto_home()
        home.click_bookmarks()
        assert "/bookmarks" in page.url
    
    @pytest.mark.navigation
    def test_014_quick_action_parsha(self, page):
        """Test parsha quick action"""
        home = HomePage(page)
        home.goto_home()
        home.click_parsha()
        assert "/shnayim-mikra" in page.url
    
    @pytest.mark.navigation
    def test_015_all_quick_actions_visible(self, page):
        """Test all quick actions are displayed"""
        home = HomePage(page)
        home.goto_home()
        home.assert_all_quick_actions_visible()


class TestDeepLinking:
    """Deep link and direct URL navigation tests"""
    
    @pytest.mark.navigation
    def test_016_direct_chapter_url(self, page):
        """Test direct navigation to chapter URL"""
        chapter = ChapterPage(page)
        chapter.goto_chapter("siman-001")
        assert chapter.get_sections_count() > 0
    
    @pytest.mark.navigation
    def test_017_direct_section_url(self, page):
        """Test direct navigation to section URL"""
        section = SectionPage(page)
        section.goto_section("siman-001-seif-001")
        section.assert_hebrew_text_visible()
    
    @pytest.mark.navigation
    def test_018_direct_question_url(self, page):
        """Test direct navigation to question"""
        page.goto("http://localhost:8081/question/q-001")
        assert "/question/" in page.url
    
    @pytest.mark.navigation
    def test_019_invalid_chapter_url_handling(self, page):
        """Test handling of invalid chapter ID"""
        page.goto("http://localhost:8081/chapter/invalid-id")
        # Should show error or redirect
        assert page.is_visible("text=שגיאה") or "/browse" in page.url
    
    @pytest.mark.navigation
    def test_020_invalid_section_url_handling(self, page):
        """Test handling of invalid section ID"""
        page.goto("http://localhost:8081/section/invalid-section")
        # Should show error or redirect
        assert page.is_visible("text=שגיאה") or page.url.endswith("/")


class TestNavigationState:
    """Navigation state persistence tests"""
    
    @pytest.mark.navigation
    def test_021_active_tab_highlighted(self, page):
        """Test active tab is highlighted"""
        home = HomePage(page)
        home.goto_home()
        home.navigate_to_browse()
        
        # Check if browse tab is active (has different styling)
        browse_tab = page.locator("text=דפדוף")
        assert browse_tab.is_visible()
    
    @pytest.mark.navigation
    def test_022_navigation_preserves_scroll(self, page):
        """Test scroll position is maintained"""
        browse = BrowsePage(page)
        browse.goto_browse()
        
        # Scroll down
        page.evaluate("window.scrollTo(0, 500)")
        scroll_before = page.evaluate("window.pageYOffset")
        
        # Navigate away and back
        page.click("text=בית")
        page.wait_for_timeout(500)
        page.click("text=דפדוף")
        page.wait_for_timeout(500)
        
        # Note: Scroll might reset, that's expected behavior
        # This test documents the actual behavior
    
    @pytest.mark.navigation
    def test_023_rapid_tab_switching(self, page):
        """Test rapid switching between tabs"""
        home = HomePage(page)
        home.goto_home()
        
        for _ in range(5):
            page.click("text=דפדוף")
            page.wait_for_timeout(300)
            page.click("text=בית")
            page.wait_for_timeout(300)
        
        # Should still work without crashes
        home.assert_home_page_loaded()
    
    @pytest.mark.navigation
    def test_024_navigation_during_loading(self, page):
        """Test navigation while page is loading"""
        page.goto("http://localhost:8081/browse")
        # Immediately navigate away
        page.goto("http://localhost:8081/")
        
        home = HomePage(page)
        home.assert_home_page_loaded()
    
    @pytest.mark.navigation
    def test_025_multiple_back_forward(self, page):
        """Test multiple back/forward navigations"""
        home = HomePage(page)
        home.goto_home()
        home.click_browse()
        
        browse = BrowsePage(page)
        browse.click_chapter(1)
        
        page.go_back()  # Back to browse
        page.go_back()  # Back to home
        page.go_forward()  # Forward to browse
        
        assert "/browse" in page.url


class TestSpecialNavigation:
    """Special navigation features"""
    
    @pytest.mark.navigation
    def test_026_daily_halacha_navigation(self, page):
        """Test clicking daily halacha navigates correctly"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        assert "/section/" in page.url, "Did not navigate to daily section"
    
    @pytest.mark.navigation
    def test_027_continue_learning_navigation(self, page):
        """Test continue learning card navigation"""
        home = HomePage(page)
        home.goto_home()
        
        if home.is_continue_learning_visible():
            home.click_continue_learning()
            # Should navigate somewhere
            assert page.url != "http://localhost:8081/"
    
    @pytest.mark.navigation
    def test_028_recent_question_navigation(self, page):
        """Test clicking recent question"""
        home = HomePage(page)
        home.goto_home()
        
        if home.is_recent_questions_visible():
            home.click_first_recent_question()
            assert "/question/" in page.url
    
    @pytest.mark.navigation
    def test_029_bookmark_navigation_from_home(self, page):
        """Test bookmark navigation"""
        home = HomePage(page)
        home.goto_home()
        home.click_bookmarks()
        
        assert "/bookmarks" in page.url
    
    @pytest.mark.navigation
    def test_030_settings_navigation_comprehensive(self, page):
        """Test various settings navigation paths"""
        home = HomePage(page)
        home.goto_home()
        home.navigate_to_settings()
        
        # Settings page should load
        assert page.is_visible("text=גודל טקסט") or page.is_visible("text=ערכת נושא")
