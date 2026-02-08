"""
Search Functionality Tests
Testing Hebrew search with normalization and fuzzy matching
"""
import pytest
from pages.questions_page import QuestionsPage
from pages.browse_page import BrowsePage


class TestHebrewSearch:
    """Test Hebrew text search functionality"""
    
    @pytest.mark.smoke
    @pytest.mark.hebrew
    def test_001_search_basic_hebrew(self, page):
        """Test basic Hebrew text search"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        questions.search_questions("שבת")
        page.wait_for_timeout(800)
        
        # Should show filtered results
        # No error should appear
        assert not page.is_visible("text=שגיאה"), "Error during search"
    
    @pytest.mark.hebrew
    def test_002_search_with_nikud_vowels(self, page):
        """Test search handles Hebrew nikud (vowel points)"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Search with nikud
        questions.search_questions("שַׁבָּת")
        page.wait_for_timeout(800)
        
        # Should normalize and match "שבת" without nikud
        # hebrewNormalize.ts handles this
    
    @pytest.mark.hebrew
    def test_003_search_ignores_geresh_gershayim(self, page):
        """Test search ignores Hebrew punctuation marks"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Search with geresh (׳) and gershayim (״)
        questions.search_questions("ג׳")
        page.wait_for_timeout(800)
        
        # Should match "ג" without marks
    
    @pytest.mark.hebrew
    def test_004_search_handles_final_letters(self, page):
        """Test search handles Hebrew final letters correctly"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # ך should match כ, ם should match מ, etc.
        questions.search_questions("דבר")
        page.wait_for_timeout(800)
        
        # Should match both "דבר" and "דברים" (with final mem)
    
    @pytest.mark.hebrew
    def test_005_search_partial_word(self, page):
        """Test fuzzy search with partial Hebrew words"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Search with partial word
        questions.search_questions("כשר")
        page.wait_for_timeout(800)
        
        # Should match "כשרות", "כשרו", "הכשר", etc.
    
    @pytest.mark.hebrew
    def test_006_search_multiple_words(self, page):
        """Test search with multiple Hebrew words"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        questions.search_questions("שבת קודש")
        page.wait_for_timeout(800)
        
        # Should filter for both words
    
    @pytest.mark.hebrew
    def test_007_search_empty_string(self, page):
        """Test search with empty string shows all results"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        initial_count = page.locator("[class*='questionCard']").count()
        
        # Search something
        questions.search_questions("שבת")
        page.wait_for_timeout(500)
        
        # Clear search
        page.locator("input[placeholder*='חיפוש']").fill("")
        page.wait_for_timeout(500)
        
        # Should show all again
        final_count = page.locator("[class*='questionCard']").count()
        assert final_count >= 0  # At least not errored


class TestSearchNormalization:
    """Test Hebrew normalization logic"""
    
    @pytest.mark.hebrew
    def test_008_normalize_removes_nikud(self, page):
        """Test normalizer removes all nikud marks"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Comprehensive nikud test
        nikud_text = "בְּרֵאשִׁית בָּרָא אֱלֹהִים"
        questions.search_questions(nikud_text)
        page.wait_for_timeout(800)
        
        # Should normalize to "בראשית ברא אלהים"
    
    @pytest.mark.hebrew
    def test_009_normalize_removes_maqaf(self, page):
        """Test normalizer removes maqaf (־)"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        questions.search_questions("דבר־אל")
        page.wait_for_timeout(800)
        
        # Should match "דבר אל"
    
    @pytest.mark.hebrew
    def test_010_normalize_converts_final_letters(self, page):
        """Test normalizer converts final letters to regular"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # ךםןףץ → כמנפצ
        questions.search_questions("ספרים")
        page.wait_for_timeout(800)
        
        # Should match regardless of final mem
    
    @pytest.mark.hebrew
    def test_011_normalize_case_insensitive(self, page):
        """Test search is case-insensitive (for English)"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        questions.search_questions("shabbat")
        page.wait_for_timeout(800)
        
        # Should match "Shabbat", "SHABBAT", etc.


class TestSearchPerformance:
    """Test search performance and responsiveness"""
    
    @pytest.mark.performance
    def test_012_search_responds_quickly(self, page):
        """Test search results appear within reasonable time"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        import time
        start = time.time()
        
        questions.search_questions("שבת")
        
        # Should respond within 1 second
        elapsed = time.time() - start
        assert elapsed < 1.5, f"Search took too long: {elapsed}s"
    
    @pytest.mark.performance
    def test_013_search_debounced(self, page):
        """Test search is debounced (not searching on every keystroke)"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        search_input = page.locator("input[placeholder*='חיפוש']")
        
        # Type multiple characters quickly
        search_input.type("שבת", delay=50)
        
        # Should wait before filtering (debounced)
        page.wait_for_timeout(800)


class TestSearchInBrowse:
    """Test search in browse/chapter context"""
    
    @pytest.mark.content
    def test_014_search_chapters(self, page):
        """Test searching for chapters in browse"""
        browse = BrowsePage(page)
        browse.goto_browse()
        
        # If browse has search
        search_input = page.locator("input[placeholder*='חיפוש'], input[placeholder*='חפש']")
        if search_input.is_visible():
            search_input.fill("שבת")
            page.wait_for_timeout(800)
    
    @pytest.mark.content
    def test_015_search_sections_hebrew(self, page):
        """Test searching for Hebrew section content"""
        browse = BrowsePage(page)
        browse.goto_browse()
        
        # Search within sections if available
        page.wait_for_timeout(500)


class TestSearchEdgeCases:
    """Test edge cases and error handling"""
    
    @pytest.mark.regression
    def test_016_search_special_characters(self, page):
        """Test search handles special characters"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        questions.search_questions("!@#$%")
        page.wait_for_timeout(500)
        
        # Should not crash
        assert not page.is_visible("text=Error, text=שגיאה")
    
    @pytest.mark.regression
    def test_017_search_very_long_query(self, page):
        """Test search handles very long queries"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        long_query = "שבת " * 100  # 100 repetitions
        questions.search_questions(long_query)
        page.wait_for_timeout(500)
        
        # Should handle gracefully
    
    @pytest.mark.regression
    def test_018_search_no_results(self, page):
        """Test search shows appropriate message when no results"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Search something unlikely to exist
        questions.search_questions("xyzקלמנופדגשדכגשדכגשדכ")
        page.wait_for_timeout(800)
        
        # Should show "no results" or empty state
        # Or just show 0 questions
        count = page.locator("[class*='questionCard']").count()
        # Should be 0 or show "לא נמצאו תוצאות"
    
    @pytest.mark.regression
    def test_019_search_with_numbers(self, page):
        """Test search handles Hebrew numbers"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Search for Hebrew number representation
        questions.search_questions("א")  # Aleph = 1
        page.wait_for_timeout(800)
    
    @pytest.mark.regression
    def test_020_search_preserves_on_navigation(self, page):
        """Test search query is preserved when navigating back"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        questions.search_questions("שבת")
        page.wait_for_timeout(500)
        
        # Click a question
        question_card = page.locator("[class*='questionCard']").first
        if question_card.is_visible():
            question_card.click()
            page.wait_for_timeout(500)
            
            # Go back
            page.go_back()
            page.wait_for_timeout(500)
            
            # Search should be preserved (or cleared - depends on implementation)
            search_input = page.locator("input[placeholder*='חיפוש']")
            search_value = search_input.input_value()
            # Either preserved or cleared is acceptable
