#!/usr/bin/env node

/**
 * Quick verification script to test if the package works correctly
 * Run this after publishing to verify the package is functional
 */

const { DataDomeEncryptor, DataDomeDecryptor } = require('../src/index.js');

console.log('Testing datadome-de-encoder package...\n');

let errors = 0;

// Test 1: Module exports
try {
    if (typeof DataDomeEncryptor !== 'function') throw new Error('DataDomeEncryptor is not a function');
    if (typeof DataDomeDecryptor !== 'function') throw new Error('DataDomeDecryptor is not a function');
    console.log('✓ Test 1: Module exports correctly');
} catch (err) {
    console.error('✗ Test 1 failed:', err.message);
    errors++;
}

// Test 2: Basic encryption/decryption (captcha mode)
try {
    const hash = "TEST_HASH_123";
    const cid = "TEST_CID_456";
    const salt = 0;
    
    const enc = new DataDomeEncryptor(hash, cid, salt, 'captcha');
    enc.add("test", "value");
    const encrypted = enc.encrypt();
    
    const dec = new DataDomeDecryptor(hash, cid, salt, 'captcha');
    const decrypted = dec.decrypt(encrypted);
    
    if (decrypted.length !== 1) throw new Error('Expected 1 decrypted item');
    if (decrypted[0][0] !== 'test') throw new Error('Key mismatch');
    if (decrypted[0][1] !== 'value') throw new Error('Value mismatch');
    
    console.log('✓ Test 2: Basic encryption/decryption (captcha)');
} catch (err) {
    console.error('✗ Test 2 failed:', err.message);
    errors++;
}

// Test 3: Interstitial mode
try {
    const hash = "TEST_HASH_123";
    const cid = "TEST_CID_456";
    const salt = 0;
    
    const enc = new DataDomeEncryptor(hash, cid, salt, 'interstitial');
    enc.add("mode", "interstitial");
    const encrypted = enc.encrypt();
    
    const dec = new DataDomeDecryptor(hash, cid, salt, 'interstitial');
    const decrypted = dec.decrypt(encrypted);
    
    if (decrypted.length !== 1) throw new Error('Expected 1 decrypted item');
    if (decrypted[0][0] !== 'mode') throw new Error('Key mismatch');
    if (decrypted[0][1] !== 'interstitial') throw new Error('Value mismatch');
    
    console.log('✓ Test 3: Interstitial mode works');
} catch (err) {
    console.error('✗ Test 3 failed:', err.message);
    errors++;
}

// Test 4: Multiple key-value pairs
try {
    const hash = "TEST_HASH_123";
    const cid = "TEST_CID_456";
    const salt = 12345;
    
    const enc = new DataDomeEncryptor(hash, cid, salt, 'captcha');
    enc.add("key1", "value1");
    enc.add("key2", 123);
    enc.add("key3", true);
    const encrypted = enc.encrypt();
    
    const dec = new DataDomeDecryptor(hash, cid, salt, 'captcha');
    const decrypted = dec.decrypt(encrypted);
    
    if (decrypted.length !== 3) throw new Error('Expected 3 decrypted items');
    
    console.log('✓ Test 4: Multiple key-value pairs work');
} catch (err) {
    console.error('✗ Test 4 failed:', err.message);
    errors++;
}

// Test 5: Challenge type switching
try {
    const hash = "TEST_HASH_123";
    const cid = "TEST_CID_456";
    const salt = 0;
    
    const enc = new DataDomeEncryptor(hash, cid, salt, 'captcha');
    if (enc.getChallengeType() !== 'captcha') throw new Error('Initial type should be captcha');
    
    enc.setChallengeType('interstitial');
    if (enc.getChallengeType() !== 'interstitial') throw new Error('Type should be interstitial');
    
    console.log('✓ Test 5: Challenge type switching works');
} catch (err) {
    console.error('✗ Test 5 failed:', err.message);
    errors++;
}

console.log('\n' + '='.repeat(50));
if (errors === 0) {
    console.log('✓ All tests passed!');
    process.exit(0);
} else {
    console.error(`✗ ${errors} test(s) failed`);
    process.exit(1);
}
