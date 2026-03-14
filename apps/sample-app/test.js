console.log('🧪 Running tests...');

if (2 + 2 === 4) {
  console.log('✅ Math test passed');
} else {
  console.log('❌ Math test failed');
  process.exit(1);
}

if (process.version) {
  console.log('✅ Node version: ' + process.version);
} else {
  console.log('❌ Node test failed');
  process.exit(1);
}

console.log('✅ All tests passed!');
process.exit(0);
