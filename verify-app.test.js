#!/usr/bin/env node

/**
 * Unit tests for verify-app.js path validation security fix
 * Tests that path traversal attacks are properly blocked
 */

const assert = require('assert');
const path = require('path');

// Import the functions from verify-app.js
const { validateFilePath } = require('./verify-app.js');

// Test colors
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function test(description, testFn) {
    try {
        testFn();
        log(`  ✓ ${description}`, 'green');
        return true;
    } catch (err) {
        log(`  ✗ ${description}`, 'red');
        log(`    Error: ${err.message}`, 'red');
        return false;
    }
}

log('\n🔒 Running Path Validation Security Tests...\n', 'yellow');

let allPassed = true;

// Test 1: Valid relative paths should be accepted
allPassed &= test('Should accept valid relative path: index.html', () => {
    const result = validateFilePath('index.html');
    assert(result.endsWith('index.html'), 'Should return path ending with index.html');
    assert(path.isAbsolute(result), 'Should return absolute path');
});

// Test 2: Valid relative paths in current directory should be accepted
allPassed &= test('Should accept valid relative path: ./script.js', () => {
    const result = validateFilePath('./script.js');
    assert(result.endsWith('script.js'), 'Should return path ending with script.js');
});

// Test 3: Parent directory traversal should be blocked
allPassed &= test('Should reject path with parent directory: ../etc/passwd', () => {
    try {
        validateFilePath('../etc/passwd');
        throw new Error('Should have thrown an error');
    } catch (err) {
        assert(err.message.includes('Invalid file path: access denied'), 'Should throw access denied error');
    }
});

// Test 4: Multiple parent directory traversal should be blocked
allPassed &= test('Should reject path with multiple parent directories: ../../sensitive', () => {
    try {
        validateFilePath('../../sensitive');
        throw new Error('Should have thrown an error');
    } catch (err) {
        assert(err.message.includes('Invalid file path: access denied'), 'Should throw access denied error');
    }
});

// Test 5: Absolute paths should be blocked
allPassed &= test('Should reject absolute path: /etc/passwd', () => {
    try {
        validateFilePath('/etc/passwd');
        throw new Error('Should have thrown an error');
    } catch (err) {
        assert(err.message.includes('Invalid file path: access denied'), 'Should throw access denied error');
    }
});

// Test 6: Paths with .. in the middle should be blocked if they escape
allPassed &= test('Should reject path escaping with ..: subdir/../../etc/passwd', () => {
    try {
        validateFilePath('subdir/../../etc/passwd');
        throw new Error('Should have thrown an error');
    } catch (err) {
        assert(err.message.includes('Invalid file path: access denied'), 'Should throw access denied error');
    }
});

// Test 7: Windows-style absolute paths should be platform-specific
allPassed &= test('Should handle Windows-style paths correctly per platform', () => {
    const windowsPath = 'C:\\Windows\\System32\\config\\sam';
    
    if (process.platform === 'win32') {
        // On Windows, this is an absolute path and should be rejected
        try {
            validateFilePath(windowsPath);
            throw new Error('Should have thrown an error on Windows');
        } catch (err) {
            assert(err.message.includes('Invalid file path: access denied'), 
                   'Windows absolute paths should be rejected');
        }
    } else {
        // On Unix, Windows paths are treated as relative paths
        // They should be accepted if they don't escape the base directory
        const result = validateFilePath(windowsPath);
        assert(path.isAbsolute(result), 'Should return absolute path on Unix');
    }
});

// Test 8: URL-encoded path traversal attempts should be blocked
allPassed &= test('Should block URL-encoded path traversal attempts', () => {
    // Test URL-encoded traversal sequences
    // Note: Node.js path functions don't automatically decode URLs,
    // so %2e%2e%2f becomes a literal filename, not ../
    // This test verifies the validation handles these safely
    const encodedPath = '%2e%2e%2f%2e%2e%2fetc%2fpasswd';
    
    try {
        const result = validateFilePath(encodedPath);
        // If it doesn't throw, verify it's within base directory
        // The encoded string becomes a literal relative path (doesn't decode)
        assert(path.isAbsolute(result), 'Should return absolute path');
        // Verify it doesn't actually traverse (encoded strings are literal)
        assert(!result.includes('/etc/passwd'), 'Should not resolve to /etc/passwd');
    } catch (err) {
        // If it throws for any reason, that's acceptable for security
        assert(err.message.includes('Invalid file path') || err.message.includes('ENOENT'), 
               'Should handle encoded paths safely');
    }
});

log('\n' + '='.repeat(50), 'yellow');
if (allPassed) {
    log('\n✅ All security tests passed!', 'green');
    log('   Path traversal vulnerability has been fixed.\n', 'green');
    process.exit(0);
} else {
    log('\n❌ Some security tests failed!', 'red');
    log('   Path traversal vulnerability may still exist.\n', 'red');
    process.exit(1);
}
