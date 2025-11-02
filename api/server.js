const express = require('express');
const { DataDomeEncryptor, DataDomeDecryptor } = require('../src/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'DataDome De/Encoder API is running' });
});

// Encrypt endpoint
app.post('/encrypt', (req, res) => {
    try {
        // Validate request body exists and is an object
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                error: 'Invalid request body',
                message: 'Request body must be a valid JSON object'
            });
        }

        const { hash, cid, data, salt = null, challengeType = 'captcha' } = req.body;

        // Validate required fields
        if (!hash || !cid || !data) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['hash', 'cid', 'data'],
                received: { hash: !!hash, cid: !!cid, data: !!data }
            });
        }

        // Validate data is an object or array (but not null)
        if (data == null || typeof data !== 'object') {
            return res.status(400).json({
                error: 'Data must be an object or array of key-value pairs',
                example: { key1: 'value1', key2: 'value2' }
            });
        }

        // Create encryptor
        const encryptor = new DataDomeEncryptor(hash, cid, salt, challengeType);

        // Add data to encryptor
        if (Array.isArray(data)) {
            // If data is array of [key, value] pairs, validate structure
            for (const item of data) {
                if (!Array.isArray(item) || item.length !== 2) {
                    return res.status(400).json({
                        error: 'Array elements must be [key, value] pairs',
                        example: [['key1', 'value1'], ['key2', 'value2']]
                    });
                }
                const [key, value] = item;
                encryptor.add(key, value);
            }
        } else {
            // If data is an object
            Object.entries(data).forEach(([key, value]) => {
                encryptor.add(key, value);
            });
        }

        // Encrypt
        const encrypted = encryptor.encrypt();

        res.json({
            success: true,
            encrypted,
            salt: encryptor.salt,
            challengeType: encryptor.getChallengeType()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Encryption failed',
            message: error.message
        });
    }
});

// Decrypt endpoint
app.post('/decrypt', (req, res) => {
    try {
        // Validate request body exists and is an object
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                error: 'Invalid request body',
                message: 'Request body must be a valid JSON object'
            });
        }

        const { hash, cid, encrypted, salt = null, challengeType = 'captcha' } = req.body;

        // Validate required fields
        if (!hash || !cid || !encrypted) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['hash', 'cid', 'encrypted'],
                received: { hash: !!hash, cid: !!cid, encrypted: !!encrypted }
            });
        }

        // Create decryptor
        const decryptor = new DataDomeDecryptor(hash, cid, salt, challengeType);

        // Decrypt
        const decrypted = decryptor.decrypt(encrypted);

        // Convert array of pairs to object
        const decryptedObject = {};
        decrypted.forEach(([key, value]) => {
            decryptedObject[key] = value;
        });

        res.json({
            success: true,
            decrypted: decryptedObject,
            decryptedArray: decrypted,
            challengeType: decryptor.getChallengeType()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Decryption failed',
            message: error.message
        });
    }
});

// API documentation endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'DataDome De/Encoder API',
        version: '1.0.0',
        endpoints: {
            'GET /health': 'Health check',
            'POST /encrypt': 'Encrypt data with DataDome algorithm',
            'POST /decrypt': 'Decrypt DataDome payload',
            'GET /': 'API documentation'
        },
        usage: {
            encrypt: {
                method: 'POST',
                url: '/encrypt',
                body: {
                    hash: 'string (required) - DataDome hash',
                    cid: 'string (required) - Client ID',
                    data: 'object/array (required) - Data to encrypt',
                    salt: 'number (optional) - Encryption salt',
                    challengeType: 'string (optional) - "captcha" or "interstitial"'
                },
                example: {
                    hash: 'D9A52CB22EA3EBADB89B9212A5EB6',
                    cid: 'tUL4RXkyLUJxd3N2UVY4X3NHfmJkZX5zYGBmZmZ8Y1VpY1U',
                    data: { screenWidth: 1920, screenHeight: 1080 },
                    challengeType: 'captcha'
                }
            },
            decrypt: {
                method: 'POST',
                url: '/decrypt',
                body: {
                    hash: 'string (required) - DataDome hash',
                    cid: 'string (required) - Client ID',
                    encrypted: 'string (required) - Encrypted payload',
                    salt: 'number (optional) - Decryption salt',
                    challengeType: 'string (optional) - "captcha" or "interstitial"'
                },
                example: {
                    hash: 'D9A52CB22EA3EBADB89B9212A5EB6',
                    cid: 'tUL4RXkyLUJxd3N2UVY4X3NHfmJkZX5zYGBmZmZ8Y1VpY1U',
                    encrypted: 'PmRDbNihdAI36FxXflyd9eIzJNJ3Vo0O...',
                    challengeType: 'captcha'
                }
            }
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`DataDome De/Encoder API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Documentation: http://localhost:${PORT}/`);
});

module.exports = app;
