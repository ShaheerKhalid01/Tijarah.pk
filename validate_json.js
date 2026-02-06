const fs = require('fs');
try {
    JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));
    console.log('ar.json is valid');
} catch (e) {
    console.error(e);
}
try {
    JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
    console.log('en.json is valid');
} catch (e) {
    console.error(e);
}
