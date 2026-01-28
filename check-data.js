import { MongoClient } from 'mongodb';

async function checkData() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('tijarah');

        const productCount = await db.collection('products').countDocuments();
        const categoryCount = await db.collection('categories').countDocuments();

        console.log('Products:', productCount);
        console.log('Categories:', categoryCount);

        if (productCount > 0) {
            const p = await db.collection('products').findOne();
            console.log('Sample Product Category:', p.category, typeof p.category);
        }

        if (categoryCount > 0) {
            const c = await db.collection('categories').findOne({ parentCategory: { $ne: null } });
            if (c) {
                console.log('Sample Subcategory parent:', c.parentCategory, typeof c.parentCategory);
            } else {
                console.log('No subcategories found');
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        process.exit(0);
    }
}

checkData();
