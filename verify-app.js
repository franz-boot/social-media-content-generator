#!/usr/bin/env node

/**
 * Verification script to check if the application can be launched
 * This script validates that all required files exist and are properly formatted
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Validates that a file path is within the allowed base directory
 * Prevents path traversal attacks by rejecting paths with .. or absolute paths
 * @param {string} userPath - The user-provided file path to validate
 * @returns {string} The validated and resolved absolute path
 * @throws {Error} If the path is invalid or tries to escape the base directory
 */
function validateFilePath(userPath) {
    const baseDir = path.resolve(__dirname);
    const resolvedPath = path.resolve(baseDir, userPath);
    
    // Ensure the resolved path is within the base directory
    if (!resolvedPath.startsWith(baseDir + path.sep) && resolvedPath !== baseDir) {
        throw new Error('Invalid file path: access denied');
    }
    
    return resolvedPath;
}

function checkFileExists(filePath) {
    try {
        const validatedPath = validateFilePath(filePath);
        fs.accessSync(validatedPath, fs.constants.R_OK);
        return true;
    } catch (err) {
        return false;
    }
}

function checkFileNotEmpty(filePath) {
    try {
        const validatedPath = validateFilePath(filePath);
        const stats = fs.statSync(validatedPath);
        return stats.size > 0;
    } catch (err) {
        return false;
    }
}

function validateHTML(filePath) {
    try {
        const validatedPath = validateFilePath(filePath);
        const content = fs.readFileSync(validatedPath, 'utf8');
        
        // Basic HTML validation checks
        const hasDoctype = /<!DOCTYPE html>/i.test(content);
        const hasHtmlTag = /<html[^>]*>/i.test(content);
        const hasHeadTag = /<head[^>]*>/i.test(content);
        const hasBodyTag = /<body[^>]*>/i.test(content);
        const hasTitle = /<title[^>]*>.*<\/title>/i.test(content);
        
        return {
            valid: hasDoctype && hasHtmlTag && hasHeadTag && hasBodyTag && hasTitle,
            details: {
                hasDoctype,
                hasHtmlTag,
                hasHeadTag,
                hasBodyTag,
                hasTitle
            }
        };
    } catch (err) {
        return { valid: false, error: err.message };
    }
}

function validateJS(filePath) {
    try {
        const validatedPath = validateFilePath(filePath);
        const content = fs.readFileSync(validatedPath, 'utf8');
        
        // Check for key functions
        const hasEventListener = /addEventListener/i.test(content);
        const hasDOMContentLoaded = /DOMContentLoaded/i.test(content);
        
        return {
            valid: hasEventListener && hasDOMContentLoaded,
            details: {
                hasEventListener,
                hasDOMContentLoaded
            }
        };
    } catch (err) {
        return { valid: false, error: err.message };
    }
}

function validateCSS(filePath) {
    try {
        const validatedPath = validateFilePath(filePath);
        const content = fs.readFileSync(validatedPath, 'utf8');
        
        // Basic CSS validation
        const hasCSSRules = /[^}]*\{[^}]*\}/.test(content);
        const hasColorDefinitions = /(color|background):/i.test(content);
        
        return {
            valid: hasCSSRules && hasColorDefinitions,
            details: {
                hasCSSRules,
                hasColorDefinitions
            }
        };
    } catch (err) {
        return { valid: false, error: err.message };
    }
}

function runVerification() {
    log('\n🚀 Starting Application Launch Verification...\n', 'blue');
    
    let allChecksPassed = true;
    
    // Define required files
    const requiredFiles = [
        { path: 'index.html', validator: validateHTML, type: 'HTML' },
        { path: 'script.js', validator: validateJS, type: 'JavaScript' },
        { path: 'styles.css', validator: validateCSS, type: 'CSS' }
    ];
    
    // Check each required file
    for (const file of requiredFiles) {
        const filePath = path.join(__dirname, file.path);
        
        log(`\nChecking ${file.type} file: ${file.path}`, 'yellow');
        
        // Check if file exists
        if (!checkFileExists(filePath)) {
            log(`  ✗ File does not exist`, 'red');
            allChecksPassed = false;
            continue;
        }
        log(`  ✓ File exists`, 'green');
        
        // Check if file is not empty
        if (!checkFileNotEmpty(filePath)) {
            log(`  ✗ File is empty`, 'red');
            allChecksPassed = false;
            continue;
        }
        log(`  ✓ File is not empty`, 'green');
        
        // Run specific validator
        if (file.validator) {
            const validation = file.validator(filePath);
            if (validation.valid) {
                log(`  ✓ ${file.type} validation passed`, 'green');
            } else {
                log(`  ✗ ${file.type} validation failed`, 'red');
                if (validation.error) {
                    log(`    Error: ${validation.error}`, 'red');
                }
                if (validation.details) {
                    for (const [key, value] of Object.entries(validation.details)) {
                        const symbol = value ? '✓' : '✗';
                        const color = value ? 'green' : 'red';
                        log(`    ${symbol} ${key}`, color);
                    }
                }
                allChecksPassed = false;
            }
        }
    }
    
    // Additional checks
    log('\n\nAdditional Checks:', 'yellow');
    
    // Check if script.js is referenced in index.html
    const indexPath = validateFilePath(path.join(__dirname, 'index.html'));
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (indexContent.includes('script.js')) {
        log('  ✓ script.js is referenced in index.html', 'green');
    } else {
        log('  ✗ script.js is NOT referenced in index.html', 'red');
        allChecksPassed = false;
    }
    
    // Check if styles.css is referenced in index.html
    if (indexContent.includes('styles.css')) {
        log('  ✓ styles.css is referenced in index.html', 'green');
    } else {
        log('  ✗ styles.css is NOT referenced in index.html', 'red');
        allChecksPassed = false;
    }
    
    // Final result
    log('\n' + '='.repeat(50), 'blue');
    if (allChecksPassed) {
        log('\n✅ All checks passed! Application is ready to launch.', 'green');
        log('\nTo launch the application:', 'blue');
        log('  1. Open index.html in a web browser', 'blue');
        log('  2. Or use a local web server:', 'blue');
        log('     - Python: python -m http.server 8000', 'blue');
        log('     - Node.js: npx http-server', 'blue');
        log('     - PHP: php -S localhost:8000', 'blue');
        log('\n');
        return 0;
    } else {
        log('\n❌ Some checks failed. Please fix the issues above.', 'red');
        log('\n');
        return 1;
    }
}

// Run verification
const exitCode = runVerification();
process.exit(exitCode);
