import fs from 'fs';
import path from 'path';

const locales = ['ar', 'ur', 'id', 'zh', 'tr', 'ms'];
const sourceFile = 'messages/en.json';
const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

function syncObjects(source, target) {
    let changed = false;
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
                target[key] = {};
                changed = true;
            }
            if (syncObjects(source[key], target[key])) {
                changed = true;
            }
        } else {
            if (target[key] === undefined) {
                target[key] = source[key];
                changed = true;
            }
        }
    }
    return changed;
}

locales.forEach(locale => {
    const filePath = `messages/${locale}.json`;
    console.log(`Processing ${locale}...`);

    let targetData = {};
    if (fs.existsSync(filePath)) {
        try {
            targetData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.error(`Error parsing ${filePath}, starting fresh: ${e.message}`);
        }
    }

    if (syncObjects(sourceData, targetData)) {
        fs.writeFileSync(filePath, JSON.stringify(targetData, null, 2), 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`${filePath} is already in sync`);
    }
});

console.log('Synchronization complete!');
