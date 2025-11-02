#!/bin/bash

# Example script to test DataDome API endpoints

API_URL="http://localhost:3000"

echo "=== Testing DataDome De/Encoder API ==="
echo ""

# Test health endpoint
echo "1. Testing Health Check:"
curl -s "${API_URL}/health" | python3 -m json.tool
echo ""
echo ""

# Test encrypt endpoint
echo "2. Testing Encryption:"
ENCRYPTED_RESPONSE=$(curl -s -X POST "${API_URL}/encrypt" \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "D9A52CB22EA3EBADB89B9212A5EB6",
    "cid": "tUL4RXkyLUJxd3N2UVY4X3NHfmJkZX5zYGBmZmZ8Y1VpY1U",
    "data": {
      "screenWidth": 1920,
      "screenHeight": 1080,
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    },
    "salt": 0,
    "challengeType": "captcha"
  }')

echo "$ENCRYPTED_RESPONSE" | python3 -m json.tool
echo ""

# Extract encrypted value
ENCRYPTED_VALUE=$(echo "$ENCRYPTED_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['encrypted'])")
echo "Encrypted value: $ENCRYPTED_VALUE"
echo ""
echo ""

# Test decrypt endpoint
echo "3. Testing Decryption:"
curl -s -X POST "${API_URL}/decrypt" \
  -H "Content-Type: application/json" \
  -d "{
    \"hash\": \"D9A52CB22EA3EBADB89B9212A5EB6\",
    \"cid\": \"tUL4RXkyLUJxd3N2UVY4X3NHfmJkZX5zYGBmZmZ8Y1VpY1U\",
    \"encrypted\": \"$ENCRYPTED_VALUE\",
    \"salt\": 0,
    \"challengeType\": \"captcha\"
  }" | python3 -m json.tool
echo ""
echo ""

# Test interstitial challenge type
echo "4. Testing Interstitial Challenge Type:"
curl -s -X POST "${API_URL}/encrypt" \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "E6EAF460AA2A8322D66B42C85B62F9",
    "cid": "555MAOBIIVcO~ayUK3Tm4j9ZbRlZzDff5osUo3oWgzLY4KaB99kYWZJe01qFFpJvBCG4805UbG28PeRGWNEZM63b154ZbJzSI8xCa5MNlDk26n7eb_CXv9u3g~S3C4xp",
    "data": {
      "pageLoad": true,
      "timestamp": 1234567890
    },
    "challengeType": "interstitial"
  }' | python3 -m json.tool
echo ""

echo "=== All tests completed ==="
