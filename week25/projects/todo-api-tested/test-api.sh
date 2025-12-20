#!/bin/bash

# API Test Script for Todo API
# This script tests all the main endpoints

API_URL="http://localhost:3000/api"

echo "============================================"
echo "🧪 Testing Todo API - Week 25 Project"
echo "============================================"
echo ""

# Test 1: Register a new user
echo "1️⃣  Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }')

echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')
echo "✅ Token received: ${TOKEN:0:30}..."
echo ""

# Test 2: Login with the user
echo "2️⃣  Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')
echo "✅ Login successful"
echo ""

# Test 3: Get current user
echo "3️⃣  Testing Get Current User..."
USER_RESPONSE=$(curl -s -X GET "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $USER_RESPONSE"
echo "✅ Current user retrieved"
echo ""

# Test 4: Create a todo
echo "4️⃣  Testing Create Todo..."
TODO_RESPONSE=$(curl -s -X POST "$API_URL/todos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false
  }')

echo "Response: $TODO_RESPONSE"
TODO_ID=$(echo $TODO_RESPONSE | grep -o '"id":[0-9]*' | sed 's/"id"://')
echo "✅ Todo created with ID: $TODO_ID"
echo ""

# Test 5: Get all todos
echo "5️⃣  Testing Get All Todos..."
TODOS_RESPONSE=$(curl -s -X GET "$API_URL/todos" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $TODOS_RESPONSE"
echo "✅ Todos retrieved"
echo ""

# Test 6: Update todo
echo "6️⃣  Testing Update Todo..."
UPDATE_RESPONSE=$(curl -s -X PATCH "$API_URL/todos/$TODO_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Buy groceries (Updated)",
    "completed": true
  }')

echo "Response: $UPDATE_RESPONSE"
echo "✅ Todo updated"
echo ""

# Test 7: Toggle todo
echo "7️⃣  Testing Toggle Todo..."
TOGGLE_RESPONSE=$(curl -s -X PATCH "$API_URL/todos/$TODO_ID/toggle" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $TOGGLE_RESPONSE"
echo "✅ Todo toggled"
echo ""

# Test 8: Get single todo
echo "8️⃣  Testing Get Single Todo..."
SINGLE_TODO=$(curl -s -X GET "$API_URL/todos/$TODO_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $SINGLE_TODO"
echo "✅ Single todo retrieved"
echo ""

# Test 9: Delete todo
echo "9️⃣  Testing Delete Todo..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/todos/$TODO_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $DELETE_RESPONSE"
echo "✅ Todo deleted"
echo ""

# Test 10: Verify todo is deleted
echo "🔟 Testing Verify Delete (Should fail with 404)..."
VERIFY_RESPONSE=$(curl -s -X GET "$API_URL/todos/$TODO_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $VERIFY_RESPONSE"
echo "✅ Todo confirmed deleted"
echo ""

echo "============================================"
echo "✅ All API tests completed successfully!"
echo "============================================"
