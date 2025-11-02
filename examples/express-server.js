/**
 * Express server example for DataDome encryption/decryption API
 * 
 * This example demonstrates how to create a REST API server that provides
 * encryption and decryption endpoints using the datadome-de-encoder package.
 * 
 * Installation:
 *   npm install express body-parser
 * 
 * Usage:
 *   node examples/express-server.js
 * 
 * Then test with curl:
 *   # Encrypt
 *   curl -X POST http://localhost:3000/encrypt \
 *     -H "Content-Type: application/json" \
 *     -d '{"hash":"test","cid":"test","salt":0,"challengeType":"captcha","data":{"key":"value"}}'
 * 
 *   # Decrypt
 *   curl -X POST http://localhost:3000/decrypt \
 *     -H "Content-Type: application/json" \
 *     -d '{"hash":"test","cid":"test","salt":0,"challengeType":"captcha","encrypted":"..."}'
 */

const express = require('express');
const bodyParser = require('body-parser');
const { DataDomeEncryptor, DataDomeDecryptor } = require('../src/index.js');

const app = express();
app.use(bodyParser.json());

// Encryption endpoint
app.post('/encrypt', (req, res) => {
    try {
        const { hash, cid, salt, challengeType, data } = req.body;
        
        // Validate required fields
        if (!hash || !cid || !data) {
            return res.status(400).json({ 
                error: 'Missing required fields: hash, cid, and data are required' 
            });
        }
        
        // Create encryptor
        const encryptor = new DataDomeEncryptor(hash, cid, salt, challengeType);
        
        // Add all data entries
        for (const [key, value] of Object.entries(data)) {
            encryptor.add(key, value);
        }
        
        // Encrypt and return result
        const encrypted = encryptor.encrypt();
        res.json({ 
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

// Decryption endpoint
app.post('/decrypt', (req, res) => {
    try {
        const { hash, cid, salt, challengeType, encrypted } = req.body;
        
        // Validate required fields
        if (!hash || !cid || salt === undefined || !encrypted) {
            return res.status(400).json({ 
                error: 'Missing required fields: hash, cid, salt, and encrypted are required' 
            });
        }
        
        // Create decryptor
        const decryptor = new DataDomeDecryptor(hash, cid, salt, challengeType);
        
        // Decrypt and return result
        const decrypted = decryptor.decrypt(encrypted);
        
        // Convert array of pairs to object for easier consumption
        const decryptedObject = {};
        decrypted.forEach(([key, value]) => {
            decryptedObject[key] = value;
        });
        
        res.json({ 
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

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'DataDome Encryption API' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DataDome server listening on port ${PORT}!`);
    console.log(`Endpoints:`);
    console.log(`  POST http://localhost:${PORT}/encrypt`);
    console.log(`  POST http://localhost:${PORT}/decrypt`);
    console.log(`  GET  http://localhost:${PORT}/health`);
});
