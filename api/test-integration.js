/**
 * Integration test for DataDome De/Encoder API
 * Tests the complete encryption and decryption flow
 */

const http = require('http');

const API_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTests() {
    console.log('🧪 DataDome API Integration Tests\n');
    
    let passed = 0;
    let failed = 0;

    try {
        // Test 1: Health check
        console.log('Test 1: Health Check');
        const healthCheck = await makeRequest('/health');
        if (healthCheck.status === 200 && healthCheck.data.status === 'ok') {
            console.log('✓ Health check passed\n');
            passed++;
        } else {
            console.log('✗ Health check failed\n');
            failed++;
        }

        // Test 2: Encrypt with captcha
        console.log('Test 2: Encrypt with CAPTCHA challenge');
        const encryptData = {
            hash: 'D9A52CB22EA3EBADB89B9212A5EB6',
            cid: 'tUL4RXkyLUJxd3N2UVY4X3NHfmJkZX5zYGBmZmZ8Y1VpY1U',
            data: {
                screenWidth: 1920,
                screenHeight: 1080,
                userAgent: 'Test User Agent'
            },
            salt: 12345,
            challengeType: 'captcha'
        };
        const encryptResult = await makeRequest('/encrypt', 'POST', encryptData);
        if (encryptResult.status === 200 && encryptResult.data.success && encryptResult.data.encrypted) {
            console.log('✓ Encryption successful');
            console.log(`  Encrypted: ${encryptResult.data.encrypted.substring(0, 50)}...`);
            console.log(`  Salt: ${encryptResult.data.salt}\n`);
            passed++;

            // Test 3: Decrypt the same data
            console.log('Test 3: Decrypt the encrypted data');
            const decryptData = {
                hash: encryptData.hash,
                cid: encryptData.cid,
                encrypted: encryptResult.data.encrypted,
                salt: encryptResult.data.salt,
                challengeType: encryptData.challengeType
            };
            const decryptResult = await makeRequest('/decrypt', 'POST', decryptData);
            if (decryptResult.status === 200 && decryptResult.data.success) {
                console.log('✓ Decryption successful');
                console.log('  Decrypted data:', JSON.stringify(decryptResult.data.decrypted, null, 2));
                
                // Verify data integrity
                const match = JSON.stringify(decryptResult.data.decrypted) === JSON.stringify(encryptData.data);
                if (match) {
                    console.log('✓ Data integrity verified\n');
                    passed++;
                } else {
                    console.log('✗ Data mismatch\n');
                    failed++;
                }
            } else {
                console.log('✗ Decryption failed\n');
                failed++;
            }
        } else {
            console.log('✗ Encryption failed\n');
            failed++;
        }

        // Test 4: Encrypt with interstitial
        console.log('Test 4: Encrypt with INTERSTITIAL challenge');
        const interstitialData = {
            hash: 'E6EAF460AA2A8322D66B42C85B62F9',
            cid: '555MAOBIIVcO~ayUK3Tm4j9ZbRlZzDff5osUo3oWgzLY4KaB99k',
            data: {
                pageLoad: true,
                timestamp: Date.now()
            },
            challengeType: 'interstitial'
        };
        const interstitialResult = await makeRequest('/encrypt', 'POST', interstitialData);
        if (interstitialResult.status === 200 && interstitialResult.data.success) {
            console.log('✓ Interstitial encryption successful');
            console.log(`  Challenge type: ${interstitialResult.data.challengeType}\n`);
            passed++;
        } else {
            console.log('✗ Interstitial encryption failed\n');
            failed++;
        }

        // Test 5: Error handling
        console.log('Test 5: Error handling (missing fields)');
        const errorResult = await makeRequest('/encrypt', 'POST', { hash: 'TEST' });
        if (errorResult.status === 400 && errorResult.data.error) {
            console.log('✓ Error handling works correctly');
            console.log(`  Error: ${errorResult.data.error}\n`);
            passed++;
        } else {
            console.log('✗ Error handling failed\n');
            failed++;
        }

        // Test 6: API documentation
        console.log('Test 6: API documentation endpoint');
        const docResult = await makeRequest('/');
        if (docResult.status === 200 && docResult.data.name && docResult.data.endpoints) {
            console.log('✓ Documentation endpoint works');
            console.log(`  API: ${docResult.data.name} v${docResult.data.version}\n`);
            passed++;
        } else {
            console.log('✗ Documentation endpoint failed\n');
            failed++;
        }

    } catch (error) {
        console.error('Error during tests:', error.message);
        failed++;
    }

    console.log('═══════════════════════════════════');
    console.log(`Tests passed: ${passed}`);
    console.log(`Tests failed: ${failed}`);
    console.log(`Total: ${passed + failed}`);
    console.log('═══════════════════════════════════\n');

    if (failed === 0) {
        console.log('🎉 All tests passed!');
    } else {
        console.log('⚠️  Some tests failed');
        process.exit(1);
    }
}

// Check if server is running before starting tests
makeRequest('/health').then(() => {
    console.log('Server is running. Starting tests...\n');
    runTests();
}).catch(() => {
    console.error('❌ Error: Server is not running!');
    console.error('Please start the server first with: npm start\n');
    process.exit(1);
});
