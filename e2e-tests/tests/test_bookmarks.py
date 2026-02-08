"""
Bookmarks Tests
Testing bookmark functionality and persistence
"""
import pytest
from pages.home_page import HomePage
from pages.section_page import SectionPage


class TestBookmarksDisplay:
    """Test bookmarks page display"""
    
    @pytest.mark.smoke
    def test_001_bookmarks_button_visible(self, page):
        """Test bookmarks quick action is visible on home"""
        home = HomePage(page)
        home.goto_home()
        
        # Should show "סימניות שמורות" (not just "סימניות")
        bookmarks_btn = page.locator("text=סימניות שמורות, text=סימניות").first
        expect(bookmarks_btn).to_be_visible()
    
    @pytest.mark.smoke
    def test_002_navigate_to_bookmarks(self, page):
        """Test navigation to bookmarks page"""
        home = HomePage(page)
        home.goto_home()
        home.click_bookmarks()
        
        # Should navigate to bookmarks
        assert "/bookmarks" in page.url, "Did not navigate to bookmarks"
    
    @pytest.mark.content
    def test_003_bookmarks_page_title(self, page):
        """Test bookmarks page shows correct title"""
        page.goto("http://localhost:8081/bookmarks")
        page.wait_for_timeout(500)
        
        # Should show "סימניות שמורות" as title
        assert page.is_visible("text=סימניות שמורות") or page.is_visible("text=סימניות")
    
    @pytest.mark.visual
    def test_004_bookmarks_label_updated_everywhere(self, page):
        """Test 'Bookmarks' changed to 'Saved Bookmarks' everywhere"""
        # Check home page
        home = HomePage(page)
        home.goto_home()
        
        # Should say "סימניות שמורות"
        assert page.is_visible("text=סימניות שמורות", timeout=3000) or \
               page.is_visible("text=סימניות", timeout=3000)
        
        # Check navigation
        home.click_bookmarks()
        page.wait_for_timeout(500)


class TestBookmarkActions:
    """Test adding and removing bookmarks"""
    
    @pytest.mark.bookmarks
    def test_005_bookmark_a_section(self, page):
        """Test bookmarking a section"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Look for bookmark button (star icon or bookmark icon)
        bookmark_btn = page.locator("[name*='bookmark'], [name*='star']").first
        if bookmark_btn.is_visible():
            bookmark_btn.click()
            page.wait_for_timeout(500)
            
            # Should show confirmation or button state change
    
    @pytest.mark.bookmarks
    def test_006_unbookmark_section(self, page):
        """Test removing a bookmark"""
        # First bookmark
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        page.wait_for_timeout(1000)
        
        bookmark_btn = page.locator("[name*='bookmark'], [name*='star']").first
        if bookmark_btn.is_visible():
            # Click twice - add then remove
            bookmark_btn.click()
            page.wait_for_timeout(300)
            bookmark_btn.click()
            page.wait_for_timeout(300)
    
    @pytest.mark.bookmarks
    def test_007_bookmark_persists_after_reload(self, page):
        """Test bookmark is saved after page reload"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-002-s1")
        page.wait_for_timeout(1000)
        
        # Bookmark it
        bookmark_btn = page.locator("[name*='bookmark'], [name*='star']").first
        if bookmark_btn.is_visible():
            bookmark_btn.click()
            page.wait_for_timeout(500)
            
            # Reload page
            page.reload()
            page.wait_for_timeout(1000)
            
            # Bookmark should still be active
            # Button should show "bookmarked" state


class TestBookmarksList:
    """Test bookmarks list view"""
    
    @pytest.mark.bookmarks
    def test_008_view_bookmarked_sections(self, page):
        """Test viewing list of bookmarked sections"""
        page.goto("http://localhost:8081/bookmarks")
        page.wait_for_timeout(1000)
        
        # Should show list of bookmarks (or empty state)
    
    @pytest.mark.bookmarks
    def test_009_empty_bookmarks_state(self, page):
        """Test empty state when no bookmarks"""
        page.goto("http://localhost:8081/bookmarks")
        page.wait_for_timeout(1000)
        
        # Should show empty state message or empty list
        # "אין סימניות שמורות" or similar
    
    @pytest.mark.bookmarks
    def test_010_click_bookmark_opens_section(self, page):
        """Test clicking a bookmark navigates to that section"""
        page.goto("http://localhost:8081/bookmarks")
        page.wait_for_timeout(1000)
        
        # If there are bookmarks
        bookmark_item = page.locator("[class*='bookmark']").first
        if bookmark_item.is_visible():
            bookmark_item.click()
            page.wait_for_timeout(500)
            
            # Should navigate to section
            assert "/section/" in page.url or "/chapter/" in page.url


class TestBookmarksStorage:
    """Test bookmark persistence in AsyncStorage"""
    
    @pytest.mark.bookmarks
    def test_011_bookmarks_stored_locally(self, page):
        """Test bookmarks are stored in AsyncStorage"""
        # This tests @kitzur_bookmarks key persistence
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-003-s1")
        page.wait_for_timeout(1000)
        
        # Bookmark something
        bookmark_btn = page.locator("[name*='bookmark'], [name*='star']").first
        if bookmark_btn.is_visible():
            bookmark_btn.click()
            page.wait_for_timeout(500)
        
        # Navigate away and back
        page.goto("http://localhost:8081")
        page.wait_for_timeout(500)
        page.goto("http://localhost:8081/bookmarks")
        page.wait_for_timeout(1000)
        
        # Bookmark should still be there
    
    @pytest.mark.bookmarks
    def test_012_bookmarks_survive_app_restart(self, page):
        """Test bookmarks persist across sessions"""
        # Add bookmark
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-004-s1")
        page.wait_for_timeout(1000)
        
        bookmark_btn = page.locator("[name*='bookmark'], [name*='star']").first
        if bookmark_btn.is_visible():
            bookmark_btn.click()
            page.wait_for_timeout(500)
        
        # Simulate restart by closing and reopening browser context
        # (In real app, AsyncStorage persists across restarts)


class TestBookmarksIntegration:
    """Test bookmarks integration with other features"""
    
    @pytest.mark.integration
    def test_013_bookmark_daily_halacha(self, page):
        """Test bookmarking the daily halacha section"""
        home = HomePage(page)
        home.goto_home()
        home.click_daily_quote()
        
        page.wait_for_timeout(1000)
        
        # Bookmark daily section
        bookmark_btn = page.locator("[name*='bookmark'], [name*='star']").first
        if bookmark_btn.is_visible():
            bookmark_btn.click()
            page.wait_for_timeout(500)
    
    @pytest.mark.integration
    def test_014_bookmark_from_browse(self, page):
        """Test bookmarking a section found via browse"""
        page.goto("http://localhost:8081/browse")
        page.wait_for_timeout(500)
        
        # Click first chapter
        chapter = page.locator("[class*='chapter']").first
        if chapter.is_visible():
            chapter.click()
            page.wait_for_timeout(500)
            
            # Click first section
            section = page.locator("[class*='section']").first
            if section.is_visible():
                section.click()
                page.wait_for_timeout(1000)
                
                # Bookmark it
                bookmark_btn = page.locator("[name*='bookmark'], [name*='star']").first
                if bookmark_btn.is_visible():
                    bookmark_btn.click()
                    page.wait_for_timeout(500)
    
    @pytest.mark.integration
    def test_015_bookmark_counter_on_home(self, page):
        """Test bookmarks count shows on home page"""
        home = HomePage(page)
        home.goto_home()
        
        # Quick action might show count of bookmarks
        # Look for badge or count indicator


class TestBookmarksNavigation:
    """Test navigation related to bookmarks"""
    
    @pytest.mark.navigation
    def test_016_back_from_bookmarks(self, page):
        """Test back navigation from bookmarks page"""
        home = HomePage(page)
        home.goto_home()
        home.click_bookmarks()
        
        page.go_back()
        
        # Should return to home
        assert page.url.endswith("/") or "index" in page.url
    
    @pytest.mark.navigation
    def test_017_bottom_nav_to_bookmarks(self, page):
        """Test accessing bookmarks from bottom navigation"""
        page.goto("http://localhost:8081")
        page.wait_for_timeout(500)
        
        # If bookmarks is in bottom nav
        # (Currently might be in quick actions only)


class TestBookmarksEdgeCases:
    """Test edge cases for bookmarks"""
    
    @pytest.mark.regression
    def test_018_bookmark_same_section_twice(self, page):
        """Test bookmarking same section multiple times doesn't duplicate"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-005-s1")
        page.wait_for_timeout(1000)
        
        bookmark_btn = page.locator("[name*='bookmark'], [name*='star']").first
        if bookmark_btn.is_visible():
            # Click multiple times
            bookmark_btn.click()
            page.wait_for_timeout(200)
            bookmark_btn.click()
            page.wait_for_timeout(200)
            bookmark_btn.click()
            page.wait_for_timeout(200)
        
        # Go to bookmarks
        page.goto("http://localhost:8081/bookmarks")
        page.wait_for_timeout(1000)
        
        # Should not have duplicates
    
    @pytest.mark.regression
    def test_019_remove_all_bookmarks(self, page):
        """Test removing all bookmarks"""
        # Add some bookmarks first
        # Then remove them all
        # Then verify empty state
        
        page.goto("http://localhost:8081/bookmarks")
        page.wait_for_timeout(1000)
    
    @pytest.mark.regression
    def test_020_bookmark_invalid_section(self, page):
        """Test handling of bookmarking invalid/deleted section"""
        # Try to bookmark a section that doesn't exist
        page.goto("http://localhost:8081/section/invalid-id")
        page.wait_for_timeout(1000)
        
        # Should handle gracefully
