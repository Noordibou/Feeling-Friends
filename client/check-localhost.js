const fs = require('fs');

const filePath = 'src/URL.jsx';
const fileContent = fs.readFileSync(filePath, 'utf8');

if (fileContent.includes('localhost') && !fileContent.includes('// const URL = "http://localhost:3001"')) {
  console.error('!! PLEASE FIX !!: Uncommented localhost reference found.');
  process.exit(1);
} else {
  console.log('No uncommented localhost references found.');
  process.exit(0);
}