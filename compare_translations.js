const fs = require('fs');
const path = require('path');

try {
    const locales = ['ar', 'ur'];
    const enPath = path.join(process.cwd(), 'messages/en.json');
    console.error('Loading en from:', enPath);
    const enData = fs.readFileSync(enPath, 'utf8');
    const en = JSON.parse(enData);

    function getKeys(obj, prefix = '') {
        let keys = [];
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                keys = keys.concat(getKeys(obj[key], `${prefix}${key}.`));
            } else {
                keys.push(`${prefix}${key}`);
            }
        }
        return keys;
    }

    const enKeys = getKeys(en);
    const report = {};

    locales.forEach(locale => {
        const filePath = path.join(process.cwd(), `messages/${locale}.json`);
        console.error('Checking locale:', locale, 'at', filePath);
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const localeKeys = new Set(getKeys(data));
            report[locale] = enKeys.filter(key => !localeKeys.has(key));
        }
    });

    process.stdout.write(JSON.stringify(report, null, 2));
} catch (e) {
    console.error('Error in comparison script:', e);
    process.exit(1);
}
