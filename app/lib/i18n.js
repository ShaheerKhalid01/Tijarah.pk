import fs from 'fs';
import path from 'path';

export function getMessages(locale) {
  try {
    const messagesPath = path.join(process.cwd(), 'messages', `${locale}.json`);
    const fileContents = fs.readFileSync(messagesPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error loading messages:', error);
    return null;
  }
}
