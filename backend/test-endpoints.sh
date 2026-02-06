#!/bin/bash


GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

BASE_URL="http://localhost:5000/api"
TOKEN=""
EXPENSE_ID=""

echo -e "${YELLOW} Testing Expense Tracker API Endpoints${NC}\n"


echo -e "${YELLOW}1. Testing Health Check...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:5000/health)
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN} Health check passed${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED} Health check failed (Status: $HTTP_STATUS)${NC}"
    exit 1
fi
echo ""


echo -e "${YELLOW}2. Testing User Registration...${NC}"
TIMESTAMP=$(date +%s)
EMAIL="test${TIMESTAMP}@example.com"
PASSWORD="Test@12345678"

REGISTER_DATA="{
  \"email\": \"$EMAIL\",
  \"password\": \"$PASSWORD\"
}"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$REGISTER_DATA" \
  "$BASE_URL/auth/register")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "201" ]; then
    echo -e "${GREEN} Registration successful${NC}"
    echo "Response: $BODY"
    TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: $TOKEN"
else
    echo -e "${YELLOW} Registration returned status $HTTP_STATUS (user might already exist)${NC}"
    echo "Response: $BODY"
fi
echo ""


echo -e "${YELLOW}3. Testing User Login...${NC}"
LOGIN_DATA="{
  \"email\": \"$EMAIL\",
  \"password\": \"$PASSWORD\"
}"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA" \
  "$BASE_URL/auth/login")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN} Login successful${NC}"
    echo "Response: $BODY"
    TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token extracted: $TOKEN"
else
    echo -e "${RED} Login failed (Status: $HTTP_STATUS)${NC}"
    echo "Response: $BODY"
    exit 1
fi
echo ""


echo -e "${YELLOW}4. Testing Create Expense...${NC}"
EXPENSE_DATA='{
  "amount": 50.99,
  "category": "Food",
  "date": "2026-02-06T10:00:00.000Z",
  "note": "Lunch at restaurant"
}'

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$EXPENSE_DATA" \
  "$BASE_URL/expenses")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "201" ]; then
    echo -e "${GREEN} Expense created successfully${NC}"
    echo "Response: $BODY"
    EXPENSE_ID=$(echo "$BODY" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "Expense ID: $EXPENSE_ID"
else
    echo -e "${RED} Create expense failed (Status: $HTTP_STATUS)${NC}"
    echo "Response: $BODY"
    exit 1
fi
echo ""


echo -e "${YELLOW}5. Testing Get All Expenses...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/expenses")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN} Get all expenses successful${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED} Get all expenses failed (Status: $HTTP_STATUS)${NC}"
    echo "Response: $BODY"
    exit 1
fi
echo ""


echo -e "${YELLOW}6. Testing Get Expense by ID...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/expenses/$EXPENSE_ID")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN} Get expense by ID successful${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED} Get expense by ID failed (Status: $HTTP_STATUS)${NC}"
    echo "Response: $BODY"
    exit 1
fi
echo ""


echo -e "${YELLOW}7. Testing Update Expense...${NC}"
UPDATE_DATA='{
  "amount": 75.50,
  "note": "Updated: Lunch and coffee"
}'

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$UPDATE_DATA" \
  "$BASE_URL/expenses/$EXPENSE_ID")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN} Update expense successful${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED} Update expense failed (Status: $HTTP_STATUS)${NC}"
    echo "Response: $BODY"
    exit 1
fi
echo ""


echo -e "${YELLOW}8. Testing Get Expenses Summary...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/expenses/summary")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN} Get expenses summary successful${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED} Get expenses summary failed (Status: $HTTP_STATUS)${NC}"
    echo "Response: $BODY"
    exit 1
fi
echo ""


echo -e "${YELLOW}9. Testing Get Expenses with Category Filter...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/expenses?category=Food")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN} Get expenses with filter successful${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED} Get expenses with filter failed (Status: $HTTP_STATUS)${NC}"
    echo "Response: $BODY"
    exit 1
fi
echo ""


echo -e "${YELLOW}10. Testing Delete Expense...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/expenses/$EXPENSE_ID")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN} Delete expense successful${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED} Delete expense failed (Status: $HTTP_STATUS)${NC}"
    echo "Response: $BODY"
    exit 1
fi
echo ""


echo -e "${YELLOW}11. Testing Invalid Login (Should Fail)...${NC}"
INVALID_LOGIN='{
  "email": "test@example.com",
  "password": "wrongpassword"
}'

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$INVALID_LOGIN" \
  "$BASE_URL/auth/login")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "401" ]; then
    echo -e "${GREEN} Invalid login correctly rejected${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED} Invalid login test failed (Expected 401, got $HTTP_STATUS)${NC}"
    echo "Response: $BODY"
fi
echo ""


echo -e "${YELLOW}12. Testing Unauthorized Access (Should Fail)...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET \
  "$BASE_URL/expenses")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" == "401" ]; then
    echo -e "${GREEN} Unauthorized access correctly rejected${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED} Unauthorized access test failed (Expected 401, got $HTTP_STATUS)${NC}"
    echo "Response: $BODY"
fi
echo ""

echo -e "${GREEN} All endpoint tests completed!${NC}"
