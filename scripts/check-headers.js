#!/usr/bin/env node

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

/**
 * CI Deployment Guard - Checks that main JS module has correct MIME type
 * Usage: node scripts/check-headers.js [URL]
 * 
 * This script prevents deployment of builds with incorrect MIME types
 * that would cause "Failed to load module script" errors.
 */

async function checkHeaders() {
  try {
    // 1. Try to get the URL from environment or command line
    let jsUrl = process.env.CHECK_JS_URL || process.argv[2];
    
    // 2. If no URL provided, try to read from manifest
    if (!jsUrl) {
      try {
        const manifestPath = path.join(process.cwd(), 'dist', 'manifest.json');
        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
          const mainEntry = manifest['src/main.tsx'];
          if (mainEntry?.file) {
            const baseUrl = process.env.DEPLOY_URL || 'https://consoltech.shop';
            jsUrl = `${baseUrl}/${mainEntry.file}`;
          }
        }
      } catch (e) {
        console.warn('Could not read manifest:', e.message);
      }
    }
    
    // 3. Fallback to main entry point
    if (!jsUrl) {
      const baseUrl = process.env.DEPLOY_URL || 'https://consoltech.shop';
      jsUrl = `${baseUrl}/src/main.tsx`;
    }

    console.log(`🔍 Checking JS module: ${jsUrl}`);

    // 4. Make the request
    return new Promise((resolve, reject) => {
      const req = https.get(jsUrl, (res) => {
        const { statusCode, headers } = res;
        const contentType = (headers['content-type'] || '').toLowerCase();
        
        console.log(`📡 Response: ${statusCode} ${res.statusMessage}`);
        console.log(`📄 Content-Type: ${contentType}`);
        
        // 5. Validate response
        const isSuccess = statusCode === 200;
        const hasCorrectMIME = contentType.includes('text/javascript') || 
                              contentType.includes('application/javascript');
        
        if (!isSuccess) {
          console.error(`❌ HTTP Error: Expected 200, got ${statusCode}`);
          reject(new Error(`HTTP ${statusCode}`));
          return;
        }
        
        if (!hasCorrectMIME) {
          console.error(`❌ MIME Error: Expected text/javascript, got "${contentType}"`);
          console.error('🚨 This will cause "Failed to load module script" errors!');
          reject(new Error(`Wrong MIME type: ${contentType}`));
          return;
        }
        
        console.log('✅ All checks passed - JS module has correct MIME type');
        resolve({ statusCode, contentType });
      });
      
      req.on('error', (err) => {
        console.error(`❌ Network Error: ${err.message}`);
        reject(err);
      });
      
      req.setTimeout(10000, () => {
        console.error('❌ Timeout: Request took longer than 10 seconds');
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
    
  } catch (error) {
    console.error(`❌ Fatal Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the check
checkHeaders()
  .then(() => {
    console.log('🎉 Deployment guard passed - safe to deploy');
    process.exit(0);
  })
  .catch((error) => {
    console.error(`🛑 Deployment guard failed: ${error.message}`);
    console.error('🔧 Check server MIME type configuration before retrying');
    process.exit(1);
  });