# Examples

This directory contains usage examples for the datadome-de-encoder package.

## Available Examples

### 1. basic-usage.js

Demonstrates the core functionality of the package with various use cases:
- Basic encryption and decryption (captcha mode)
- Interstitial mode usage
- Fixed salt for reproducible results
- Dynamic challenge type switching

**Run:**
```bash
node examples/basic-usage.js
```

### 2. verify.js

Automated verification tests to ensure the package works correctly:
- Module exports verification
- Captcha and interstitial mode tests
- Multiple data types handling
- Challenge type switching

**Run:**
```bash
node examples/verify.js
```

### 3. express-server.js

REST API server providing encryption/decryption endpoints using Express.js.

**Installation:**
```bash
npm install express body-parser
```

**Run:**
```bash
node examples/express-server.js
```

**Endpoints:**

- `GET /health` - Health check
- `POST /encrypt` - Encrypt data
- `POST /decrypt` - Decrypt data

**Example requests:**

Encrypt:
```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "your_hash",
    "cid": "your_cid",
    "salt": 0,
    "challengeType": "captcha",
    "data": {
      "key1": "value1",
      "key2": 123
    }
  }'
```

Response:
```json
{
  "encrypted": "...",
  "salt": 0,
  "challengeType": "captcha"
}
```

Decrypt:
```bash
curl -X POST http://localhost:3000/decrypt \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "your_hash",
    "cid": "your_cid",
    "salt": 0,
    "challengeType": "captcha",
    "encrypted": "..."
  }'
```

Response:
```json
{
  "decrypted": {
    "key1": "value1",
    "key2": 123
  },
  "decryptedArray": [
    ["key1", "value1"],
    ["key2", 123]
  ],
  "challengeType": "captcha"
}
```

## Usage in Your Project

After installing the package:

```bash
npm install datadome-de-encoder
```

Use it in your code:

```javascript
const { DataDomeEncryptor, DataDomeDecryptor } = require('datadome-de-encoder');

// Encrypt
const encryptor = new DataDomeEncryptor(hash, cid, null, 'captcha');
encryptor.add('key', 'value');
const encrypted = encryptor.encrypt();

// Decrypt
const decryptor = new DataDomeDecryptor(hash, cid, encryptor.salt, 'captcha');
const decrypted = decryptor.decrypt(encrypted);
```

## Notes

- The Express server example requires additional dependencies (`express` and `body-parser`)
- For production use, consider adding authentication, rate limiting, and proper error handling
- All examples use relative imports (`../src/index.js`) for local testing
