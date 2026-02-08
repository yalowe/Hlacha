"""
Test Utilities and Helper Functions
Common utilities for all E2E tests
"""
from typing import List, Dict, Any
import re
from datetime import datetime, timedelta


def normalize_hebrew(text: str) -> str:
    """
    Normalize Hebrew text for comparison (matches app's hebrewNormalize.ts)
    
    - Removes nikud (vowel points)
    - Removes punctuation marks (geresh, gershayim, maqaf)
    - Converts final letters to regular letters
    - Lowercases
    """
    if not text:
        return ""
    
    # Remove nikud (U+0591 to U+05C7)
    text = re.sub(r'[\u0591-\u05C7]', '', text)
    
    # Remove geresh and gershayim
    text = text.replace('׳', '').replace('״', '')
    
    # Remove maqaf
    text = text.replace('־', ' ')
    
    # Convert final letters to regular
    final_to_regular = {
        'ך': 'כ',
        'ם': 'מ',
        'ן': 'נ',
        'ף': 'פ',
        'ץ': 'צ'
    }
    
    for final, regular in final_to_regular.items():
        text = text.replace(final, regular)
    
    # Lowercase and trim
    text = text.lower().strip()
    
    return text


def extract_section_number(url: str) -> int:
    """
    Extract section number from URL
    Example: "section/kitzur_orach_chaim-001-s3" -> 3
    """
    match = re.search(r'-s(\d+)', url)
    if match:
        return int(match.group(1))
    return 0


def extract_chapter_number(url: str) -> int:
    """
    Extract chapter (siman) number from URL
    Example: "chapter/kitzur_orach_chaim-042" -> 42
    """
    match = re.search(r'-(\d+)(?:-s\d+)?$', url)
    if match:
        return int(match.group(1))
    return 0


def calculate_daily_halacha_id(date: datetime = None) -> str:
    """
    Calculate daily halacha section ID for given date (matches app logic)
    
    Algorithm:
    - Days since 1864-01-01
    - Modulo 2210 sections
    - Format: kitzur_orach_chaim-{siman}-s{section}
    """
    if date is None:
        date = datetime.now()
    
    base_date = datetime(1864, 1, 1)
    days_diff = (date - base_date).days
    
    # 2210 sections in cycle
    section_index = days_diff % 2210
    
    # Calculate siman (chapter) and section
    siman_num = (section_index // 10) + 1
    section_num = (section_index % 10) + 1
    
    return f"kitzur_orach_chaim-{siman_num:03d}-s{section_num}"


def is_valid_hebrew_text(text: str) -> bool:
    """Check if text contains Hebrew characters"""
    return bool(re.search(r'[א-ת]', text))


def count_hebrew_words(text: str) -> int:
    """Count Hebrew words in text"""
    hebrew_words = re.findall(r'[א-ת]+', text)
    return len(hebrew_words)


def format_hebrew_date(date: datetime) -> str:
    """
    Format date in Hebrew style (matches app display)
    Returns: "8 פברואר 2026"
    """
    hebrew_months = {
        1: 'ינואר', 2: 'פברואר', 3: 'מרץ', 4: 'אפריל',
        5: 'מאי', 6: 'יוני', 7: 'יולי', 8: 'אוגוסט',
        9: 'ספטמבר', 10: 'אוקטובר', 11: 'נובמבר', 12: 'דצמבר'
    }
    
    day = date.day
    month = hebrew_months[date.month]
    year = date.year
    
    return f"{day} {month} {year}"


def wait_for_hebrew_text(page, timeout: int = 5000) -> bool:
    """
    Wait for any Hebrew text to appear on page
    Returns True if found, False if timeout
    """
    try:
        page.wait_for_selector("text=/[א-ת]+/", timeout=timeout)
        return True
    except:
        return False


def extract_question_id(url: str) -> str:
    """
    Extract question ID from URL
    Example: "/question/q-12345" -> "q-12345"
    """
    match = re.search(r'/question/([^/]+)', url)
    if match:
        return match.group(1)
    return ""


def parse_hebrew_number(text: str) -> int:
    """
    Parse Hebrew number (gematria) to integer
    Example: "א׳" -> 1, "י׳" -> 10, "כ׳" -> 20
    """
    hebrew_to_num = {
        'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5,
        'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10,
        'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60,
        'ע': 70, 'פ': 80, 'צ': 90, 'ק': 100, 'ר': 200
    }
    
    # Remove geresh and gershayim
    text = text.replace('׳', '').replace('״', '')
    
    total = 0
    for char in text:
        if char in hebrew_to_num:
            total += hebrew_to_num[char]
    
    return total


def get_test_categories() -> List[str]:
    """Get all available question categories"""
    return [
        'כללי',
        'שבת',
        'כשרות',
        'תפילה',
        'חגים',
        'משפחה'
    ]


def generate_test_question(category: str = 'כללי') -> Dict[str, Any]:
    """Generate sample question data for testing"""
    return {
        'title': f'שאלת בדיקה - {category}',
        'text': 'האם מותר לעשות כך בהלכה?',
        'category': category,
        'askedBy': 'test-user',
        'timestamp': datetime.now().isoformat()
    }


def generate_test_answer(question_id: str) -> Dict[str, Any]:
    """Generate sample answer data for testing"""
    return {
        'questionId': question_id,
        'text': 'כן, מותר לעשות זאת על פי ההלכה.',
        'source': 'קיצור שולחן ערוך סימן א',
        'answeredBy': 'test-rabbi',
        'timestamp': datetime.now().isoformat()
    }


def is_rtl_locale(page) -> bool:
    """Check if page is using RTL layout"""
    try:
        html = page.locator("html").first
        dir_attr = html.get_attribute("dir")
        return dir_attr == "rtl"
    except:
        return False


def get_parsha_list() -> List[str]:
    """Get list of all parshiot (matches parshaLoader.ts mapping)"""
    return [
        'bereshit', 'noach', 'lech_lecha', 'vayera', 'chayei_sarah',
        'toldot', 'vayetzei', 'vayishlach', 'vayeshev', 'miketz',
        'vayigash', 'vayechi', 'shemot', 'vaera', 'bo', 'beshalach',
        'yitro', 'mishpatim', 'terumah', 'tetzaveh', 'ki_tisa',
        'vayakhel', 'pekudei', 'vayikra', 'tzav', 'shemini',
        'tazria', 'metzora', 'acharei_mot', 'kedoshim', 'emor',
        'behar', 'bechukotai', 'bamidbar', 'nasso', 'behaalotcha',
        'shelach', 'korach', 'chukat', 'balak', 'pinchas',
        'matot', 'masei', 'devarim', 'vaetchanan', 'ekev',
        'reeh', 'shoftim', 'ki_teitzei', 'ki_tavo', 'nitzavim',
        'vayeilech', 'haazinu', 'vezot_haberachah'
    ]


class HebrewTextMatcher:
    """Helper class for matching Hebrew text with normalization"""
    
    def __init__(self, text: str):
        self.original = text
        self.normalized = normalize_hebrew(text)
    
    def matches(self, other: str) -> bool:
        """Check if other text matches (with normalization)"""
        return self.normalized == normalize_hebrew(other)
    
    def contains(self, other: str) -> bool:
        """Check if this text contains other text (normalized)"""
        return normalize_hebrew(other) in self.normalized
    
    def fuzzy_match(self, other: str, threshold: float = 0.8) -> bool:
        """Fuzzy match with similarity threshold"""
        from difflib import SequenceMatcher
        
        normalized_other = normalize_hebrew(other)
        similarity = SequenceMatcher(None, self.normalized, normalized_other).ratio()
        
        return similarity >= threshold


# Export commonly used functions
__all__ = [
    'normalize_hebrew',
    'extract_section_number',
    'extract_chapter_number',
    'calculate_daily_halacha_id',
    'is_valid_hebrew_text',
    'count_hebrew_words',
    'format_hebrew_date',
    'wait_for_hebrew_text',
    'extract_question_id',
    'parse_hebrew_number',
    'get_test_categories',
    'generate_test_question',
    'generate_test_answer',
    'is_rtl_locale',
    'get_parsha_list',
    'HebrewTextMatcher'
]
