#!/bin/bash

# Integration Test Script
# Run this script after deploying to an environment with database access

set -e

echo "🧪 Starting Integration Tests"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL (change this to your deployment URL)
BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "Testing against: $BASE_URL"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local expected_code=$4
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$BASE_URL$endpoint")
    
    if [ "$response" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $response)"
    fi
}

echo "1. Testing Health Check"
echo "------------------------"
test_endpoint "GET" "/api/health" "Health endpoint" 200
echo ""

echo "2. Testing Authentication Required"
echo "-----------------------------------"
test_endpoint "GET" "/api/projects" "Projects without auth" 401
test_endpoint "GET" "/api/deployments" "Deployments without auth" 401
test_endpoint "GET" "/api/tokens" "Tokens without auth" 401
test_endpoint "GET" "/api/users/profile" "Profile without auth" 401
echo ""

echo "3. Testing Database Connection"
echo "-------------------------------"
echo "Run: npx prisma migrate status"
npx prisma migrate status || echo -e "${RED}Database not accessible${NC}"
echo ""

echo "4. Testing Prisma Client"
echo "-------------------------"
echo "Run: npx prisma validate"
npx prisma validate && echo -e "${GREEN}✓ Schema valid${NC}" || echo -e "${RED}✗ Schema invalid${NC}"
echo ""

echo "5. Checking Generated Types"
echo "----------------------------"
if [ -d "node_modules/@prisma/client" ]; then
    echo -e "${GREEN}✓ Prisma client generated${NC}"
else
    echo -e "${RED}✗ Prisma client not found${NC}"
    echo "Run: npx prisma generate"
fi
echo ""

echo "6. Type Checking"
echo "----------------"
echo "Run: npx nuxi typecheck"
npx nuxi typecheck 2>&1 | head -20 || echo -e "${YELLOW}Some type errors found (see above)${NC}"
echo ""

echo "========================================"
echo "Integration Test Summary"
echo "========================================"
echo ""
echo "Manual Testing Checklist:"
echo "1. ☐ Login to the application"
echo "2. ☐ Create a new project"
echo "3. ☐ Deploy a project"
echo "4. ☐ View deployment history"
echo "5. ☐ Create an API token"
echo "6. ☐ Delete a token"
echo "7. ☐ Update user profile"
echo "8. ☐ Create a team"
echo "9. ☐ Add team members"
echo "10. ☐ Delete a project"
echo ""
echo "All automated tests completed!"
