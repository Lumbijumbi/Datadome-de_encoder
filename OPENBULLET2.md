# OpenBullet2 Integration Guide

This guide explains how to use the DataDome De/Encoder API with OpenBullet2.

## Prerequisites

1. Start the API server:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:3000`

2. Make sure OpenBullet2 is running and you have access to create configs.

## Configuration Steps

### Step 1: Encrypt Data

In your OpenBullet2 config, add an **HTTP Request** block:

**Settings:**
- **Method**: POST
- **URL**: `http://localhost:3000/encrypt`
- **Content-Type**: `application/json`

**Request Body:**
```json
{
  "hash": "<hash>",
  "cid": "<cid>",
  "data": {
    "screenWidth": 1920,
    "screenHeight": 1080,
    "userAgent": "<userAgent>",
    "captchaResponse": "<captchaResponse>"
  },
  "challengeType": "captcha"
}
```

**Parse Response:**
Use a **Parse JSON** block or regex to extract the `encrypted` value from the response:
- Create variable: `encrypted`
- JSON Path: `$.encrypted`

### Step 2: Use Encrypted Payload

Use the `<encrypted>` variable in your subsequent requests to DataDome endpoints.

### Step 3: Decrypt Data (Optional)

If you need to decrypt a DataDome payload:

**Settings:**
- **Method**: POST
- **URL**: `http://localhost:3000/decrypt`
- **Content-Type**: `application/json`

**Request Body:**
```json
{
  "hash": "<hash>",
  "cid": "<cid>",
  "encrypted": "<encryptedPayload>",
  "challengeType": "captcha"
}
```

## Parameters Explanation

### Required Parameters

- **hash**: DataDome hash value (extract from page/response)
- **cid**: Client ID (extract from page/response)
- **data**: Object containing key-value pairs to encrypt
- **encrypted**: The encrypted payload to decrypt

### Optional Parameters

- **salt**: Numeric salt value (default: auto-generated)
- **challengeType**: `"captcha"` or `"interstitial"` (default: `"captcha"`)

## Challenge Types

### Captcha Challenge
Used for standard CAPTCHA responses:
```json
{
  "challengeType": "captcha"
}
```

### Interstitial Challenge
Used for interstitial pages:
```json
{
  "challengeType": "interstitial"
}
```

## Example OpenBullet2 Config Structure

```
1. [HTTP Request] - Get target page
   └─> Extract: hash, cid, userAgent

2. [HTTP Request] - Solve CAPTCHA
   └─> Extract: captchaResponse

3. [HTTP Request] - Encrypt payload
   URL: http://localhost:3000/encrypt
   Body: {hash, cid, data: {captchaResponse, userAgent, ...}}
   └─> Extract: encrypted

4. [HTTP Request] - Submit to DataDome
   Body: Use <encrypted> variable
   └─> Parse response

5. [Conditional] - Check success
```

## Error Handling

The API returns error responses with HTTP status codes:

- **400**: Missing or invalid parameters
- **500**: Encryption/Decryption failed

Example error response:
```json
{
  "error": "Missing required fields",
  "required": ["hash", "cid", "data"],
  "received": {
    "hash": true,
    "cid": false,
    "data": true
  }
}
```

## Tips

1. **Always use the same salt value** when encrypting and decrypting related data
2. **Match challenge types** between encryption and decryption
3. **Extract hash and cid** correctly from the target website
4. **Use variables** in OpenBullet2 to manage dynamic values

## Testing

Test the API manually before integrating with OpenBullet2:

```bash
# Run the test script
./api/test-api.sh
```

Or use curl directly:
```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "YOUR_HASH",
    "cid": "YOUR_CID",
    "data": {"test": "value"}
  }'
```

## Troubleshooting

### API not responding
- Check if the server is running: `curl http://localhost:3000/health`
- Check the port: default is 3000, change with `PORT=8080 npm start`

### Decryption fails
- Ensure salt values match between encryption and decryption
- Verify challengeType is consistent
- Check that hash and cid are correct

### OpenBullet2 connection issues
- If using Docker, expose port 3000
- If running remotely, update URL to remote IP
- Check firewall settings

## Support

For issues or questions:
- Discord: mxo23
- GitHub Issues: https://github.com/Lumbijumbi/Datadome-de_encoder/issues
