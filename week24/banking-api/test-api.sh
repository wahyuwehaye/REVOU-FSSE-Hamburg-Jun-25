#!/bin/bash

echo "🧪 Testing Banking API Endpoints..."
echo ""

# Test 1: Login as Customer
echo "1️⃣  Testing Login (Customer: john@email.com)"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@email.com","password":"password123"}')

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('accessToken', ''))" 2>/dev/null)

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo "✅ Login successful! Token received."
else
  echo "❌ Login failed!"
  echo "Response: $RESPONSE"
  exit 1
fi

echo ""

# Test 2: Get Profile
echo "2️⃣  Testing Get Profile (Protected Endpoint)"
PROFILE=$(curl -s http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN")
EMAIL=$(echo $PROFILE | python3 -c "import sys, json; print(json.load(sys.stdin).get('email', ''))" 2>/dev/null)

if [ "$EMAIL" = "john@email.com" ]; then
  echo "✅ Profile retrieved: $EMAIL"
else
  echo "❌ Profile retrieval failed!"
  echo "Response: $PROFILE"
fi

echo ""

# Test 3: Get Accounts
echo "3️⃣  Testing Get Accounts"
ACCOUNTS=$(curl -s http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer $TOKEN")
ACCOUNT_COUNT=$(echo $ACCOUNTS | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
echo "✅ Found $ACCOUNT_COUNT account(s)"

echo ""

# Test 4: Get Notifications
echo "4️⃣  Testing Get Notifications"
NOTIFICATIONS=$(curl -s http://localhost:3000/api/v1/notifications \
  -H "Authorization: Bearer $TOKEN")
NOTIF_COUNT=$(echo $NOTIFICATIONS | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
echo "✅ Found $NOTIF_COUNT notification(s)"

echo ""

# Test 5: Test RBAC - Try to access Admin endpoint as Customer (should fail)
echo "5️⃣  Testing RBAC (Customer trying to access Admin endpoint)"
ADMIN_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/v1/admin/statistics \
  -H "Authorization: Bearer $TOKEN")
HTTP_CODE=$(echo "$ADMIN_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "403" ]; then
  echo "✅ RBAC working! Customer blocked from admin endpoint (403 Forbidden)"
else
  echo "⚠️  Expected 403, got $HTTP_CODE"
fi

echo ""

# Test 6: Login as Admin
echo "6️⃣  Testing Login (Admin: admin@bank.com)"
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bank.com","password":"password123"}')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('accessToken', ''))" 2>/dev/null)

if [ -n "$ADMIN_TOKEN" ] && [ "$ADMIN_TOKEN" != "null" ] && [ "$ADMIN_TOKEN" != "" ]; then
  echo "✅ Admin login successful!"
else
  echo "❌ Admin login failed!"
  echo "Response: $ADMIN_RESPONSE"
  exit 1
fi

echo ""

# Test 7: Access Admin Statistics
echo "7️⃣  Testing Admin Statistics Endpoint"
STATS=$(curl -s http://localhost:3000/api/v1/admin/statistics \
  -H "Authorization: Bearer $ADMIN_TOKEN")
TOTAL_USERS=$(echo $STATS | python3 -c "import sys, json; print(json.load(sys.stdin).get('totalUsers', 0))" 2>/dev/null)

if [ -n "$TOTAL_USERS" ] && [ "$TOTAL_USERS" != "null" ] && [ "$TOTAL_USERS" != "0" ]; then
  echo "✅ Admin statistics retrieved! Total users: $TOTAL_USERS"
else
  echo "⚠️  Statistics response: $STATS"
fi

echo ""
echo "🎉 All tests completed!"
