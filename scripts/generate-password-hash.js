// Run this script to generate password hashes for authentication
// Usage: node scripts/generate-password-hash.js your-password-here

const crypto = require('crypto');

const password = process.argv[2];

if (!password) {
  console.log('Usage: node scripts/generate-password-hash.js <your-password>');
  console.log('\nThis will generate the values you need for your .env file or GitHub secrets.');
  process.exit(1);
}

// Generate simple base64 encoding (for VITE_AUTH_PASSWORD_SIMPLE)
const simpleHash = Buffer.from(password).toString('base64');

// Generate SHA-256 hash (for VITE_AUTH_PASSWORD_HASH)
const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('\n========================================');
console.log('Password Hash Generator for PourDecisions');
console.log('========================================\n');
console.log('Add these to your .env file or GitHub repository secrets:\n');
console.log(`VITE_AUTH_PASSWORD_SIMPLE=${simpleHash}`);
console.log(`VITE_AUTH_PASSWORD_HASH=${sha256Hash}`);
console.log('\n========================================');
console.log('\nFor GitHub deployment:');
console.log('1. Go to your repo Settings → Secrets and variables → Actions');
console.log('2. Click "New repository secret"');
console.log('3. Add both VITE_AUTH_PASSWORD_SIMPLE and VITE_AUTH_PASSWORD_HASH');
console.log('========================================\n');
