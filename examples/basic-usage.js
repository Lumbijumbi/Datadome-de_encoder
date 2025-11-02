/**
 * Basic usage example for datadome-de-encoder
 * 
 * This example demonstrates how to use the DataDome encryption and decryption
 * module for both captcha and interstitial challenge types.
 */

const { DataDomeEncryptor, DataDomeDecryptor } = require('../src/index.js');

// Example 1: Basic Captcha Encryption/Decryption
console.log('=== Example 1: Basic Captcha Mode ===\n');

const hash = "D9A52CB22EA3EBADB89B9212A5EB6";
const cid = "tUL4RXkyLUJxd3N2UVY4X3NHfmJkZX5zYGBmZmZ8Y1VpY1U";

// Create encryptor (captcha is the default challenge type)
const encryptor = new DataDomeEncryptor(hash, cid, null, 'captcha');

// Add key-value pairs
encryptor.add("screenWidth", 1920);
encryptor.add("screenHeight", 1080);
encryptor.add("userAgent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
encryptor.add("timestamp", Date.now());

// Encrypt the data
const encrypted = encryptor.encrypt();
console.log("Encrypted payload:", encrypted.substring(0, 50) + "...");
console.log("Salt used:", encryptor.salt);

// Create decryptor with the same parameters
const decryptor = new DataDomeDecryptor(hash, cid, encryptor.salt, 'captcha');

// Decrypt the data
const decrypted = decryptor.decrypt(encrypted);
console.log("\nDecrypted data:");
decrypted.forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
});

// Example 2: Interstitial Mode
console.log('\n\n=== Example 2: Interstitial Mode ===\n');

const hash2 = "14D062F60A4BDE8CE8647DFC720349";
const cid2 = "client_identifier_here";

// Create encryptor with interstitial mode
const encryptor2 = new DataDomeEncryptor(hash2, cid2, 0, 'interstitial');

encryptor2.add("pageData", "interstitial_info");
encryptor2.add("deviceFingerprint", "abc123def456");
encryptor2.add("challenge", true);

const encrypted2 = encryptor2.encrypt();
console.log("Encrypted payload:", encrypted2.substring(0, 50) + "...");

// Decrypt with same parameters
const decryptor2 = new DataDomeDecryptor(hash2, cid2, 0, 'interstitial');
const decrypted2 = decryptor2.decrypt(encrypted2);

console.log("\nDecrypted data:");
decrypted2.forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
});

// Example 3: Using fixed salt for reproducibility
console.log('\n\n=== Example 3: Fixed Salt for Testing ===\n');

const fixedSalt = 12345;
const encryptor3 = new DataDomeEncryptor(hash, cid, fixedSalt, 'captcha');
encryptor3.add("test", "value");

const encrypted3a = encryptor3.encrypt();

// Create another encryptor with same salt
const encryptor3b = new DataDomeEncryptor(hash, cid, fixedSalt, 'captcha');
encryptor3b.add("test", "value");
const encrypted3b = encryptor3b.encrypt();

console.log("First encryption:  ", encrypted3a.substring(0, 40) + "...");
console.log("Second encryption: ", encrypted3b.substring(0, 40) + "...");
console.log("Are they identical?", encrypted3a === encrypted3b);

// Example 4: Switching challenge types dynamically
console.log('\n\n=== Example 4: Dynamic Challenge Type Switching ===\n');

const encryptor4 = new DataDomeEncryptor(hash, cid, 0, 'captcha');
encryptor4.add("mode", "captcha");
const captchaEncrypted = encryptor4.encrypt();
console.log("Captcha mode encrypted length:", captchaEncrypted.length);

// Switch to interstitial
encryptor4.setChallengeType('interstitial');
encryptor4.add("mode", "interstitial");
const interstitialEncrypted = encryptor4.encrypt();
console.log("Interstitial mode encrypted length:", interstitialEncrypted.length);

console.log('\n✓ All examples completed successfully!');
