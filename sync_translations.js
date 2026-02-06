const fs = require('fs');
const path = require('path');

function mergeLocales(targetLocale) {
    const enPath = path.join(process.cwd(), 'messages/en.json');
    const targetPath = path.join(process.cwd(), `messages/${targetLocale}.json`);

    const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const target = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

    let addedCount = 0;

    function recurse(sourceObj, targetObj) {
        for (const key in sourceObj) {
            if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null && !Array.isArray(sourceObj[key])) {
                if (!targetObj[key]) {
                    targetObj[key] = {};
                    addedCount++;
                }
                recurse(sourceObj[key], targetObj[key]);
            } else {
                if (targetObj[key] === undefined) {
                    targetObj[key] = sourceObj[key];
                    addedCount++;
                }
            }
        }
    }

    recurse(en, target);
    fs.writeFileSync(targetPath, JSON.stringify(target, null, 2), 'utf8');
    console.log(`Merged ${targetLocale}. Added ${addedCount} keys.`);
}

mergeLocales('ar');
mergeLocales('ur');
