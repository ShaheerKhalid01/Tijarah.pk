import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

console.log('[Products] MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing');

async function addTestProducts() {
  try {
    console.log('[Products] Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('[Products] Connected to MongoDB ✅');

    // Import Product model
    const productSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      sku: String,
      stock: Number,
      images: [String],
      category: mongoose.Schema.Types.ObjectId,
      isActive: Boolean,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });

    const Product = mongoose.model('Product', productSchema);

    const testProducts = [
      {
        name: 'MacBook Pro 16',
        description: 'Powerful laptop for professionals',
        price: 2499.99,
        sku: 'macbook-pro-16',
        stock: 10,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
        isActive: true,
      },
      {
        name: 'iPhone 15 Pro Max',
        description: 'Latest Apple smartphone',
        price: 1199.99,
        sku: 'iphone-15-pro-max',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500'],
        isActive: true,
      },
      {
        name: 'iPad Air',
        description: 'Versatile tablet for everyone',
        price: 599.99,
        sku: 'ipad-air',
        stock: 8,
        images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500'],
        isActive: true,
      },
      {
        name: 'AirPods Pro',
        description: 'Premium wireless earbuds',
        price: 249.99,
        sku: 'airpods-pro',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        isActive: true,
      },
      {
        name: 'Apple Watch Series 9',
        description: 'Advanced health and fitness tracker',
        price: 399.99,
        sku: 'apple-watch-series-9',
        stock: 12,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
        isActive: true,
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Noise-cancelling headphones',
        price: 399.99,
        sku: 'sony-wh-1000xm5',
        stock: 5,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        isActive: true,
      },
      {
        name: 'Dell XPS 13',
        description: 'Compact and powerful laptop',
        price: 1299.99,
        sku: 'dell-xps-13',
        stock: 7,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
        isActive: true,
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Latest Samsung flagship phone',
        price: 999.99,
        sku: 'samsung-galaxy-s24',
        stock: 18,
        images: ['https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500'],
        isActive: true,
      },
    ];

    console.log(`[Products] Adding ${testProducts.length} test products...`);
    
    const createdProducts = await Product.insertMany(testProducts);
    
    console.log(`✅ Successfully added ${createdProducts.length} products!\n`);
    createdProducts.forEach(product => {
      console.log(`   ✓ ${product.name} ($${product.price})`);
    });
    
    await mongoose.disconnect();
    console.log('\n[Products] Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addTestProducts();