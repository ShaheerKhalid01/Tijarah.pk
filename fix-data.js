import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function fixData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Get electronics category
        const electronics = await mongoose.connection.db.collection('categories').findOne({ slug: 'electronics' });

        if (electronics) {
            const result = await mongoose.connection.db.collection('products').updateMany(
                {},
                { $set: { category: electronics._id, active: true } }
            );
            console.log(`Updated ${result.modifiedCount} products to category electronics`);
        } else {
            console.log('Electronics category not found. Creating it...');
            const catResult = await mongoose.connection.db.collection('categories').insertOne({
                name: 'Electronics',
                slug: 'electronics',
                active: true,
                parentCategory: null
            });
            const result = await mongoose.connection.db.collection('products').updateMany(
                {},
                { $set: { category: catResult.insertedId, active: true } }
            );
            console.log(`Created category and updated ${result.modifiedCount} products`);
        }
    } catch (error) {
        console.error('Fix failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

fixData();
