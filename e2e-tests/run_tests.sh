#!/bin/bash
# Quick test runner script
# Usage: ./run_tests.sh [test_type]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL=${BASE_URL:-http://localhost:8081}
PYTEST_ARGS=""

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Kitzur E2E Test Runner                ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# Check if app is running
echo -e "${YELLOW}🔍 Checking if app is running at ${BASE_URL}...${NC}"
if curl -s "${BASE_URL}" > /dev/null; then
    echo -e "${GREEN}✓ App is running${NC}"
else
    echo -e "${RED}✗ App is not running at ${BASE_URL}${NC}"
    echo -e "${YELLOW}Please start the app first:${NC}"
    echo -e "  cd ../kitzur && npm start"
    exit 1
fi

echo ""

# Parse test type argument
TEST_TYPE=${1:-all}

case $TEST_TYPE in
    smoke)
        echo -e "${GREEN}🚀 Running SMOKE tests (critical paths only)...${NC}"
        PYTEST_ARGS="-m smoke"
        ;;
    hebrew)
        echo -e "${GREEN}🔤 Running HEBREW tests (RTL, Hebrew text, normalization)...${NC}"
        PYTEST_ARGS="-m hebrew"
        ;;
    daily)
        echo -e "${GREEN}📅 Running DAILY HALACHA tests...${NC}"
        PYTEST_ARGS="tests/test_daily_halacha.py"
        ;;
    parsha)
        echo -e "${GREEN}📖 Running PARSHA tests (Hebcal API)...${NC}"
        PYTEST_ARGS="tests/test_parsha.py"
        ;;
    questions)
        echo -e "${GREEN}❓ Running QUESTIONS & ANSWERS tests...${NC}"
        PYTEST_ARGS="tests/test_questions_qa.py"
        ;;
    search)
        echo -e "${GREEN}🔍 Running SEARCH tests...${NC}"
        PYTEST_ARGS="tests/test_search.py"
        ;;
    bookmarks)
        echo -e "${GREEN}🔖 Running BOOKMARKS tests...${NC}"
        PYTEST_ARGS="tests/test_bookmarks.py"
        ;;
    navigation)
        echo -e "${GREEN}🧭 Running NAVIGATION tests...${NC}"
        PYTEST_ARGS="-m navigation"
        ;;
    content)
        echo -e "${GREEN}📄 Running CONTENT tests...${NC}"
        PYTEST_ARGS="tests/test_content_loading.py"
        ;;
    performance)
        echo -e "${GREEN}⚡ Running PERFORMANCE tests...${NC}"
        PYTEST_ARGS="-m performance"
        ;;
    regression)
        echo -e "${GREEN}🔄 Running REGRESSION suite (all tests)...${NC}"
        PYTEST_ARGS="-m regression"
        ;;
    all)
        echo -e "${GREEN}🎯 Running ALL tests...${NC}"
        PYTEST_ARGS=""
        ;;
    quick)
        echo -e "${GREEN}⚡ Running QUICK tests (smoke + navigation)...${NC}"
        PYTEST_ARGS="-m 'smoke or navigation'"
        ;;
    *)
        echo -e "${RED}Unknown test type: $TEST_TYPE${NC}"
        echo ""
        echo "Available options:"
        echo "  smoke       - Critical path tests (fastest)"
        echo "  quick       - Smoke + navigation tests"
        echo "  hebrew      - Hebrew text and RTL tests"
        echo "  daily       - Daily halacha tests"
        echo "  parsha      - Parsha tests"
        echo "  questions   - Q&A tests"
        echo "  search      - Search tests"
        echo "  bookmarks   - Bookmarks tests"
        echo "  navigation  - Navigation tests"
        echo "  content     - Content loading tests"
        echo "  performance - Performance tests"
        echo "  regression  - Full regression suite"
        echo "  all         - All tests (default)"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

# Run tests
pytest $PYTEST_ARGS \
    --verbose \
    --tb=short \
    --color=yes \
    --html=reports/report.html \
    --self-contained-html \
    -n auto

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✓ ALL TESTS PASSED                    ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📊 View detailed report:${NC}"
    echo -e "   file://$(pwd)/reports/report.html"
else
    echo ""
    echo -e "${RED}╔══════════════════════════════════════════╗${NC}"
    echo -e "${RED}║   ✗ SOME TESTS FAILED                   ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}📊 Check report for details:${NC}"
    echo -e "   file://$(pwd)/reports/report.html"
    echo ""
    echo -e "${YELLOW}📸 Screenshots of failures:${NC}"
    echo -e "   $(pwd)/screenshots/"
    exit 1
fi
