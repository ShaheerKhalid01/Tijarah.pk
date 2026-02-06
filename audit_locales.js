import fs from 'fs';

const locales = ['ar', 'ur', 'id', 'zh'];
const sourceFile = 'messages/en.json';

try {
    const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

    function getKeysRecursive(obj, prefix = '') {
        let keys = [];
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                keys.push(prefix + key);
                keys = keys.concat(getKeysRecursive(obj[key], prefix + key + '.'));
            } else {
                keys.push(prefix + key);
            }
        }
        return keys;
    }

    const sourceKeysSet = new Set(getKeysRecursive(sourceData));
    const sourceKeys = Array.from(sourceKeysSet);

    locales.forEach(locale => {
        const filePath = `messages/${locale}.json`;
        if (!fs.existsSync(filePath)) {
            console.log(`\nLocale: ${locale} - File missing`);
            return;
        }

        try {
            const targetData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const targetKeysSet = new Set(getKeysRecursive(targetData));

            const missingKeys = sourceKeys.filter(key => !targetKeysSet.has(key));
            const topLevelMissing = missingKeys.filter(k => !k.includes('.'));

            console.log(`\nLocale: ${locale}`);
            console.log(`Missing Keys Total: ${missingKeys.length}`);
            if (topLevelMissing.length > 0) {
                console.log('Missing Top-level Keys:', topLevelMissing);
            } else if (missingKeys.length > 0) {
                console.log('Sample Missing Nested Keys:', missingKeys.slice(0, 10));
            }
        } catch (e) {
            console.log(`\nLocale: ${locale} - Error parsing JSON: ${e.message}`);
        }
    });
} catch (e) {
    console.log(`Error reading source file ${sourceFile}: ${e.message}`);
}
