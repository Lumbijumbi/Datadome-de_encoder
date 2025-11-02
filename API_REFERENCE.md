# API Quick Reference

## Starting the Server

```bash
npm start
```

Server runs on `http://localhost:3000` (default)

## Endpoints

### Health Check
```bash
GET http://localhost:3000/health
```

### Encrypt
```bash
POST http://localhost:3000/encrypt
Content-Type: application/json

{
  "hash": "YOUR_HASH",
  "cid": "YOUR_CLIENT_ID",
  "data": {
    "key1": "value1",
    "key2": 123
  },
  "salt": 0,                      // optional
  "challengeType": "captcha"      // optional: "captcha" or "interstitial"
}
```

**Response:**
```json
{
  "success": true,
  "encrypted": "encoded_string",
  "salt": 0,
  "challengeType": "captcha"
}
```

### Decrypt
```bash
POST http://localhost:3000/decrypt
Content-Type: application/json

{
  "hash": "YOUR_HASH",
  "cid": "YOUR_CLIENT_ID",
  "encrypted": "encoded_string",
  "salt": 0,                      // optional, must match encryption salt
  "challengeType": "captcha"      // optional, must match encryption type
}
```

**Response:**
```json
{
  "success": true,
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

### Documentation
```bash
GET http://localhost:3000/
```

Returns API documentation in JSON format.

## Testing

### Manual Testing
```bash
./api/test-api.sh
```

### Integration Tests
```bash
node api/test-integration.js
```

## OpenBullet2 Integration

See [OPENBULLET2.md](OPENBULLET2.md) for complete integration guide.

**Quick Example:**

1. HTTP Request Block → POST to `http://localhost:3000/encrypt`
2. Body: JSON with hash, cid, and data
3. Parse response → Extract `encrypted` field
4. Use encrypted value in subsequent requests

## Error Codes

- **400**: Bad Request (missing/invalid parameters)
- **500**: Internal Server Error (encryption/decryption failed)

## Common Issues

**Q: Server not starting?**
A: Make sure port 3000 is available or set custom port: `PORT=8080 npm start`

**Q: Decryption fails?**
A: Ensure salt and challengeType match between encrypt and decrypt

**Q: Invalid data error?**
A: Check that data is an object or array of [key, value] pairs

## Examples

See test files for more examples:
- `api/test-api.sh` - Shell script examples
- `api/test-integration.js` - JavaScript examples
