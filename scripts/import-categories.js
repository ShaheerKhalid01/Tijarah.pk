/**
 * Import Categories Script
 * 
 * This script reads category data from public/categories folder
 * and imports it into MongoDB
 * 
 * Usage: npm run import-categories
 * Or: node scripts/import-categories.js
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Category model
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  image: String,
  icon: String,
  emoji: String,
  parentCategory: mongoose.Schema.Types.ObjectId,
  subcategories: [mongoose.Schema.Types.ObjectId],
  featured: Boolean,
  active: {
    type: Boolean,
    default: true,
  },
  displayName: String,
  meta: mongoose.Schema.Types.Mixed,
  order: Number,
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// Helper function to slugify
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to format name from slug
function formatName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function importCategories() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get categories path
    const projectRoot = path.resolve(__dirname, '..');
    const categoriesPath = path.join(projectRoot, 'public', 'categories');
    
    if (!fs.existsSync(categoriesPath)) {
      throw new Error(`Categories folder not found at: ${categoriesPath}`);
    }

    // Read all category folders
    const folders = fs.readdirSync(categoriesPath)
      .filter(file => {
        const fullPath = path.join(categoriesPath, file);
        return fs.statSync(fullPath).isDirectory() && !file.startsWith('.');
      })
      .sort();

    console.log(`📂 Found ${folders.length} categories:\n`);

    const importedCategories = [];
    const errors = [];

    for (const folder of folders) {
      const folderPath = path.join(categoriesPath, folder);
      const dataFile = path.join(folderPath, 'data.json');

      try {
        let categoryData = {
          name: formatName(folder),
          slug: folder,
          description: '',
          image: `/categories/${folder}/image.jpg`,
          icon: '📁',
          active: true,
        };

        // If data.json exists, merge it
        if (fs.existsSync(dataFile)) {
          try {
            const fileData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
            categoryData = {
              ...categoryData,
              ...fileData,
              slug: folder, // Keep slug from folder name
            };
            console.log(`📄 ${folder}: Using data from data.json`);
          } catch (parseError) {
            console.warn(`⚠️  ${folder}: Invalid JSON in data.json, using defaults`);
          }
        } else {
          console.log(`📂 ${folder}: No data.json, using folder structure`);
        }

        // Check if category already exists
        const existing = await Category.findOne({ slug: folder });

        if (existing) {
          // Update existing category
          await Category.updateOne({ slug: folder }, categoryData);
          console.log(`   ✏️  Updated: ${folder}\n`);
        } else {
          // Create new category
          const created = await Category.create(categoryData);
          importedCategories.push(created);
          console.log(`   ✅ Created: ${folder}\n`);
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${folder}: ${error.message}\n`);
        errors.push({ folder, error: error.message });
      }
    }

    // Get final statistics
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ active: true });
    const featuredCategories = await Category.countDocuments({ featured: true });

    console.log('\n' + '='.repeat(50));
    console.log('📊 IMPORT STATISTICS\n');
    console.log(`Total categories: ${totalCategories}`);
    console.log(`Active categories: ${activeCategories}`);
    console.log(`Featured categories: ${featuredCategories}`);

    if (errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${errors.length}`);
      errors.forEach(err => {
        console.log(`   - ${err.folder}: ${err.error}`);
      });
    }

    console.log('\n✨ Import completed successfully!\n');
    console.log('📌 Next steps:');
    console.log('   1. Visit MongoDB Atlas to verify categories');
    console.log('   2. Create admin categories page');
    console.log('   3. Link products to categories');
    console.log('   4. Build category filtering in products page\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error('\nMake sure:');
    console.error('  1. MONGODB_URI is set in .env.local');
    console.error('  2. Categories folder exists at: public/categories/');
    console.error('  3. MongoDB connection is working');
    console.error('  4. You have write permissions to the database\n');
    process.exit(1);
  }
}

// Run the import
console.log('🚀 Starting category import...\n');
importCategories();