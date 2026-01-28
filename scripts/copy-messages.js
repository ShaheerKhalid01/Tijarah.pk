const fs = require('fs');
const path = require('path');

// Create public/messages directory if it doesn't exist
const publicMessagesDir = path.join(process.cwd(), 'public', 'messages');
if (!fs.existsSync(publicMessagesDir)) {
  fs.mkdirSync(publicMessagesDir, { recursive: true });
}

// Copy all JSON files from messages/ to public/messages/
const messagesDir = path.join(process.cwd(), 'messages');
const files = fs.readdirSync(messagesDir);

files.forEach(file => {
  if (file.endsWith('.json')) {
    const sourcePath = path.join(messagesDir, file);
    const destPath = path.join(publicMessagesDir, file);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to public/messages/`);
  }
});

console.log('All message files copied successfully!');
