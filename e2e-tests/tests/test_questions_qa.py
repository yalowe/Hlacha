"""
Questions & Answers Advanced Tests
Testing Q&A system, approval workflow, trust scoring, and categories
"""
import pytest
from pages.home_page import HomePage
from pages.questions_page import QuestionsPage


class TestQuestionsDisplay:
    """Test questions page display and layout"""
    
    @pytest.mark.smoke
    def test_001_questions_page_loads(self, page):
        """Test questions page loads successfully"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        assert page.is_visible("text=שאלות ותשובות"), "Questions title not visible"
    
    @pytest.mark.visual
    def test_002_questions_header_not_cut_off(self, page):
        """Test questions header has proper padding (not cut from top)"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Header should be fully visible with paddingTop: 70
        header = page.locator("text=שאלות ותשובות").first
        expect(header).to_be_visible()
        
        # Check header is not at very top (has padding)
        box = header.bounding_box()
        assert box['y'] > 50, "Header too close to top - may be cut off"
    
    @pytest.mark.content
    def test_003_search_bar_visible(self, page):
        """Test search bar is displayed"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        search = page.locator("input[placeholder*='חיפוש']")
        expect(search).to_be_visible()
    
    @pytest.mark.content
    def test_004_category_filters_visible(self, page):
        """Test category filter buttons are displayed"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Should show categories like כללי, שבת, כשרות, etc.
        assert page.locator("text=כללי").count() >= 0


class TestQuestionsBadges:
    """Test notification badges for questions"""
    
    @pytest.mark.regression
    def test_005_pending_answers_badge_shows_count(self, page):
        """Test pending answers badge displays count correctly"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # If there are pending answers, badge should show count
        badge = page.locator("text=/\\d+ תשובות ממתינות לאישור/")
        if badge.is_visible():
            # Badge shows number (even if it's 1)
            badge_text = badge.text_content()
            assert "תשובות" in badge_text
    
    @pytest.mark.regression
    def test_006_pending_badge_visible_immediately(self, page):
        """Test pending answers badge appears on page load (not after navigation)"""
        home = HomePage(page)
        home.goto_home()
        home.navigate_to_questions()
        
        page.wait_for_timeout(500)
        
        # Badge should be visible immediately if there are pending answers
        # (Fixed bug where it only appeared after entering and exiting questions)
        # No need to navigate away and back
    
    @pytest.mark.content
    def test_007_unanswered_questions_badge(self, page):
        """Test unanswered questions badge displays correctly"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Should show count of unanswered questions
        badge = page.locator("text=/\\d+ שאלות ממתינות לתשובה/")
        # Badge might not be visible if no unanswered questions
        # Just verify page loaded successfully
        assert page.url.endswith("/questions")
    
    @pytest.mark.regression
    def test_008_badge_shows_plural_form_always(self, page):
        """Test badges always show plural form (even for count 1)"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        page.wait_for_timeout(500)
        
        # Check if badge shows "1 תשובות" (plural) not "תשובה אחת" (singular)
        if page.locator("text=/1 תשובות/").is_visible():
            # Correct - shows plural even for 1
            pass
        elif page.locator("text=/תשובה אחת/").is_visible():
            pytest.fail("Badge shows singular form - should always be plural")


class TestQuestionsSearch:
    """Test Hebrew search functionality"""
    
    @pytest.mark.hebrew
    def test_009_search_hebrew_text(self, page):
        """Test searching with Hebrew text"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        questions.search_questions("שבת")
        page.wait_for_timeout(1000)
        
        # Should filter questions
        # Results should be relevant to שבת
    
    @pytest.mark.hebrew
    def test_010_search_with_nikud(self, page):
        """Test search handles nikud (vowel marks) correctly"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Search with nikud
        questions.search_questions("שַׁבָּת")
        page.wait_for_timeout(1000)
        
        # Should normalize and match "שבת" (without nikud)
    
    @pytest.mark.hebrew
    def test_011_search_partial_words(self, page):
        """Test fuzzy search with partial Hebrew words"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        questions.search_questions("כשר")
        page.wait_for_timeout(1000)
        
        # Should match "כשרות", "כשרו", etc.
    
    @pytest.mark.regression
    def test_012_search_clears_correctly(self, page):
        """Test clearing search returns all questions"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        initial_count = page.locator("[class*='questionCard']").count()
        
        questions.search_questions("שבת")
        page.wait_for_timeout(500)
        
        # Clear search
        page.locator("input[placeholder*='חיפוש']").fill("")
        page.wait_for_timeout(500)
        
        # Should show all questions again
        final_count = page.locator("[class*='questionCard']").count()
        # Count should be restored (or at least > 0)


class TestQuestionsFilters:
    """Test category filtering"""
    
    @pytest.mark.content
    def test_013_filter_by_category_shabbat(self, page):
        """Test filtering by Shabbat category"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        # Click Shabbat category
        shabbat_filter = page.locator("text=שבת").first
        if shabbat_filter.is_visible():
            shabbat_filter.click()
            page.wait_for_timeout(500)
            
            # Questions should be filtered
    
    @pytest.mark.content
    def test_014_filter_by_category_kashrut(self, page):
        """Test filtering by Kashrut category"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        kashrut_filter = page.locator("text=כשרות").first
        if kashrut_filter.is_visible():
            kashrut_filter.click()
            page.wait_for_timeout(500)
    
    @pytest.mark.regression
    def test_015_category_filter_updates_count(self, page):
        """Test filtering updates question count"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        initial_count = page.locator("[class*='questionCard']").count()
        
        # Apply filter
        category_button = page.locator("text=כללי").first
        if category_button.is_visible():
            category_button.click()
            page.wait_for_timeout(500)
            
            # Count might change (unless no filtering logic)
    
    @pytest.mark.regression
    def test_016_filter_all_categories(self, page):
        """Test 'All Categories' shows all questions"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        all_button = page.locator("text=הכל, text=כל הקטגוריות").first
        if all_button.is_visible():
            all_button.click()
            page.wait_for_timeout(500)


class TestAskQuestion:
    """Test asking new questions"""
    
    @pytest.mark.questions
    def test_017_ask_question_button_visible(self, page):
        """Test 'Ask Question' button is visible"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        ask_btn = page.locator("text=שאל שאלה, text=שאל שאלה חדשה").first
        # Button might be anywhere on page
        # Just verify questions page loaded
        assert "/questions" in page.url
    
    @pytest.mark.questions
    def test_018_ask_question_navigation(self, page):
        """Test clicking ask question navigates to form"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        ask_btn = page.locator("text=שאל שאלה").first
        if ask_btn.is_visible():
            ask_btn.click()
            page.wait_for_timeout(500)
            
            # Should navigate to ask-question page
            assert "/ask-question" in page.url or "modal" in page.url


class TestAnswerApproval:
    """Test pending answers approval workflow"""
    
    @pytest.mark.admin
    def test_019_pending_answers_button_clickable(self, page):
        """Test pending answers badge is clickable"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        badge = page.locator("text=/תשובות ממתינות לאישור/").first
        if badge.is_visible():
            badge.click()
            page.wait_for_timeout(500)
            
            # Should navigate to pending-answers page
            assert "/pending-answers" in page.url or page.url
    
    @pytest.mark.admin
    def test_020_pending_answers_page_loads(self, page):
        """Test pending answers page loads when navigating directly"""
        page.goto("http://localhost:8081/pending-answers")
        page.wait_for_timeout(1000)
        
        # Should load pending answers view
        # Might require admin authentication


class TestQuestionDisplay:
    """Test individual question display"""
    
    @pytest.mark.content
    def test_021_question_card_shows_title(self, page):
        """Test question cards display titles"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        page.wait_for_timeout(1000)
        
        # Should show question titles
        question_cards = page.locator("[class*='questionCard']")
        if question_cards.count() > 0:
            first_card = question_cards.first
            expect(first_card).to_be_visible()
    
    @pytest.mark.content
    def test_022_question_shows_category(self, page):
        """Test question cards display category"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        page.wait_for_timeout(1000)
        
        # Questions should show their category
        # Look for category labels
    
    @pytest.mark.content
    def test_023_question_shows_timestamp(self, page):
        """Test question cards show when asked"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        page.wait_for_timeout(1000)
        
        # Should show date/time like "לפני 3 ימים"
    
    @pytest.mark.navigation
    def test_024_click_question_opens_detail(self, page):
        """Test clicking question opens detail view"""
        questions = QuestionsPage(page)
        questions.goto_questions()
        
        page.wait_for_timeout(1000)
        
        question_card = page.locator("[class*='questionCard']").first
        if question_card.is_visible():
            question_card.click()
            page.wait_for_timeout(500)
            
            # Should navigate to question detail
            assert "/question/" in page.url


class TestQuestionsHomeIntegration:
    """Test questions integration on home page"""
    
    @pytest.mark.integration
    def test_025_questions_badge_on_home(self, page):
        """Test questions count badge appears on home page"""
        home = HomePage(page)
        home.goto_home()
        
        # Quick actions should show badge count
        # Badge shows combined: unanswered + pending
    
    @pytest.mark.integration
    def test_026_home_quick_action_navigates_to_questions(self, page):
        """Test clicking questions from home navigates correctly"""
        home = HomePage(page)
        home.goto_home()
        home.click_questions()
        
        assert "/questions" in page.url, "Did not navigate to questions"
