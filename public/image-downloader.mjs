// images-downloader.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import fetch from 'node-fetch';
import { pipeline } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const streamPipeline = promisify(pipeline);

const images = {
  // Category Images
  'categories/electronics.jpg': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/laptops.jpg': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/tablets.jpg': 'https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/accessories.jpg': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/mens-fashion.jpg': 'https://images.unsplash.com/photo-1445205170230-053b83016042?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/womens-fashion.jpg': 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/kids-fashion.jpg': 'https://images.unsplash.com/photo-1604917014474-5634732411b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/fashion-accessories.jpg': 'https://images.unsplash.com/photo-1542272604-78738341b1a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/furniture.jpg': 'https://images.unsplash.com/photo-1555041463-a8fe4813b2f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/decor.jpg': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/kitchen.jpg': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/garden.jpg': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/skincare.jpg': 'https://images.unsplash.com/photo-1571781926295-d6e9a9cfcd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/makeup.jpg': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/fragrances.jpg': 'https://images.unsplash.com/photo 1608068825208-e4b6f3a1a7e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/hair-care.jpg': 'https://images.unsplash.com/photo-1608248543803-ba780c3bfe42?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/fitness.jpg': 'https://images.unsplash.com/photo-1534438327276-14e6d8c2177c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/camping.jpg': 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/team-sports.jpg': 'https://images.unsplash.com/photo-1579952363872-0d3e771afd0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/outdoor.jpg': 'https://images.unsplash.com/photo-1526779259212-d1c2b25ef3a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/educational-toys.jpg': 'https://images.unsplash.com/photo 1583394838336-acd977736fca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/board-games.jpg': 'https://images.unsplash.com/photo-1608885138155-25d135a6d3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/dolls-figures.jpg': 'https://images.unsplash.com/photo-1582481725274-d63b5b66d8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'categories/puzzles.jpg': 'https://images.unsplash.com/photo-1585824802255-4891a5b84407?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  
  // Product Images
  'products/smartphone-pro.jpg': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'products/wireless-earbuds.jpg': 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'products/smart-watch.jpg': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'products/laptop-ultra.jpg': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'products/bluetooth-speaker.jpg': 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'products/mens-shirt.jpg': 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'products/womens-dress.jpg': 'https://images.unsplash.com/photo-1539109136884-43d0e9d63eee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'products/running-shoes.jpg': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'products/designer-handbag.jpg': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'products/sunglasses.jpg': 'https://images.unsplash.com/photo-1511499767150-a48a237ac008?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
};

async function downloadImage(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  await streamPipeline(response.body, fs.createWriteStream(filePath));
  console.log(`Downloaded ${filePath}`);
}

async function main() {
  // Create public directory if it doesn't exist
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  // Download all images
  const downloadPromises = Object.entries(images).map(async ([relativePath, url]) => {
    const filePath = path.join('public', relativePath);
    const dir = path.dirname(filePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    try {
      await downloadImage(url, filePath);
    } catch (error) {
      console.error(`Error downloading ${url}:`, error.message);
    }
  });

  await Promise.all(downloadPromises);
  console.log('All images downloaded successfully!');
}

main().catch(console.error);