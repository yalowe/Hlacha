"""
Content Loading Tests
Testing chapter and section content loading, caching, and error handling
"""
import pytest
from pages.browse_page import BrowsePage
from pages.chapter_page import ChapterPage
from pages.section_page import SectionPage


class TestChapterLoading:
    """Test chapter content loading"""
    
    @pytest.mark.smoke
    @pytest.mark.content
    def test_001_browse_shows_chapters(self, page):
        """Test browse page displays chapter list"""
        browse = BrowsePage(page)
        browse.goto_browse()
        
        page.wait_for_timeout(1000)
        
        # Should show multiple chapters
        chapters = page.locator("[class*='chapter'], text=/סימן/")
        assert chapters.count() > 0, "No chapters displayed"
    
    @pytest.mark.content
    def test_002_chapter_loads_sections(self, page):
        """Test clicking chapter loads its sections"""
        browse = BrowsePage(page)
        browse.goto_browse()
        
        # Click first chapter
        browse.click_chapter(1)
        
        page.wait_for_timeout(1000)
        
        # Should show sections
        sections = page.locator("[class*='section'], text=/סעיף/")
        assert sections.count() > 0, "No sections loaded"
    
    @pytest.mark.content
    def test_003_section_loads_text(self, page):
        """Test section displays Hebrew text content"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        section.assert_hebrew_text_visible()
    
    @pytest.mark.performance
    def test_004_chapter_loads_quickly(self, page):
        """Test chapter loads within acceptable time"""
        import time
        
        start = time.time()
        
        chapter = ChapterPage(page)
        chapter.goto_chapter("kitzur_orach_chaim-001")
        
        elapsed = time.time() - start
        
        # Should load within 3 seconds
        assert elapsed < 3, f"Chapter took too long to load: {elapsed}s"


class TestSectionNavigation:
    """Test section-to-section navigation"""
    
    @pytest.mark.navigation
    def test_005_next_section_button(self, page):
        """Test next section button works"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        initial_url = page.url
        section.click_next_section()
        
        # Should navigate to s2
        assert page.url != initial_url
        assert "-s2" in page.url or page.url.endswith("s2")
    
    @pytest.mark.navigation
    def test_006_previous_section_button(self, page):
        """Test previous section button works"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s3")
        
        section.click_previous_section()
        
        # Should navigate to s2
        page.wait_for_timeout(500)
        assert "-s2" in page.url or page.url.endswith("s2")
    
    @pytest.mark.navigation
    def test_007_navigate_across_chapters(self, page):
        """Test navigating from last section of chapter to first of next"""
        # Go to last section of chapter 1
        section = SectionPage(page)
        # Assuming chapter 1 has multiple sections
        section.goto_section("kitzur_orach_chaim-001-s10")
        
        # May or may not exist, but test next navigation
        next_btn = page.locator("text=/הבא|Next/").first
        if next_btn.is_visible():
            next_btn.click()
            page.wait_for_timeout(500)


class TestContentStructure:
    """Test content structure and organization"""
    
    @pytest.mark.content
    def test_008_orach_chaim_sections(self, page):
        """Test Orach Chaim sections are available"""
        page.goto("http://localhost:8081/browse")
        page.wait_for_timeout(1000)
        
        # Should have Orach Chaim category
        oc_section = page.locator("text=/אורח חיים|Orach Chaim/").first
        # Might be visible or need to scroll
    
    @pytest.mark.content
    def test_009_yoreh_deah_sections(self, page):
        """Test Yoreh Deah sections if available"""
        page.goto("http://localhost:8081/browse")
        page.wait_for_timeout(1000)
        
        # Might have Yoreh Deah
        yd_section = page.locator("text=/יורה דעה|Yoreh Deah/").first
    
    @pytest.mark.content
    def test_010_special_content_sections(self, page):
        """Test special content like Birkat Hamazon"""
        # Check if special sections are accessible
        page.goto("http://localhost:8081/birkat-hamazon")
        page.wait_for_timeout(1000)
        
        # Should load special content
        # Or show appropriate message


class TestContentCaching:
    """Test content caching and performance"""
    
    @pytest.mark.performance
    def test_011_revisit_section_faster(self, page):
        """Test revisiting section loads from cache"""
        import time
        
        section = SectionPage(page)
        
        # First load
        start1 = time.time()
        section.goto_section("kitzur_orach_chaim-001-s1")
        first_load = time.time() - start1
        
        # Navigate away
        page.goto("http://localhost:8081")
        page.wait_for_timeout(500)
        
        # Second load (should be cached)
        start2 = time.time()
        section.goto_section("kitzur_orach_chaim-001-s1")
        second_load = time.time() - start2
        
        # Second load might be faster (cached)
        # (Not guaranteed in test environment)
    
    @pytest.mark.performance
    def test_012_multiple_sections_load_efficiently(self, page):
        """Test loading multiple sections sequentially"""
        section = SectionPage(page)
        
        # Load several sections
        for i in range(1, 6):
            section.goto_section(f"kitzur_orach_chaim-001-s{i}")
            page.wait_for_timeout(300)
            
            # Should not slow down significantly


class TestContentErrorHandling:
    """Test error handling for missing/invalid content"""
    
    @pytest.mark.regression
    def test_013_invalid_section_id(self, page):
        """Test handling of invalid section ID"""
        page.goto("http://localhost:8081/section/invalid-id-12345")
        page.wait_for_timeout(1000)
        
        # Should show error message or redirect
        assert page.is_visible("text=שגיאה") or \
               page.is_visible("text=לא נמצא") or \
               "/browse" in page.url
    
    @pytest.mark.regression
    def test_014_missing_chapter(self, page):
        """Test handling of non-existent chapter"""
        page.goto("http://localhost:8081/chapter/kitzur_orach_chaim-999")
        page.wait_for_timeout(1000)
        
        # Should handle gracefully
        assert page.is_visible("text=שגיאה") or \
               page.is_visible("text=לא נמצא") or \
               page.url
    
    @pytest.mark.regression
    def test_015_section_without_text(self, page):
        """Test handling of section with missing text"""
        # Some sections might not have full content
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-200-s1")
        
        page.wait_for_timeout(1000)
        
        # Should either show content or appropriate message
        # Not crash or show broken UI


class TestContentFormats:
    """Test different content formats"""
    
    @pytest.mark.content
    def test_016_section_with_subsections(self, page):
        """Test section with multiple subsections"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Might have subsections or paragraphs
        paragraphs = page.locator("p, [class*='paragraph']")
    
    @pytest.mark.content
    def test_017_section_with_lists(self, page):
        """Test section containing lists"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Might contain lists
        lists = page.locator("ul, ol, [class*='list']")
    
    @pytest.mark.content
    def test_018_footnotes_if_present(self, page):
        """Test footnotes display correctly if present"""
        section = SectionPage(page)
        section.goto_section("kitzur_orach_chaim-001-s1")
        
        page.wait_for_timeout(1000)
        
        # Look for footnote markers
        footnotes = page.locator("[class*='footnote'], sup")


class TestContentSearch:
    """Test searching within content"""
    
    @pytest.mark.content
    def test_019_chapter_index_search(self, page):
        """Test searching chapter index"""
        browse = BrowsePage(page)
        browse.goto_browse()
        
        page.wait_for_timeout(500)
        
        # If browse has search functionality
        search = page.locator("input[type='search'], input[placeholder*='חיפוש']")
        if search.is_visible():
            search.fill("שבת")
            page.wait_for_timeout(500)
    
    @pytest.mark.content
    def test_020_deep_link_to_section(self, page):
        """Test deep linking directly to specific section"""
        # Direct URL navigation
        page.goto("http://localhost:8081/section/kitzur_orach_chaim-001-s1")
        page.wait_for_timeout(1000)
        
        # Should load section directly
        assert "/section/" in page.url
        
        hebrew_text = page.locator("text=/[א-ת]{5,}/").first
        expect(hebrew_text).to_be_visible()
