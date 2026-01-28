import connectDB from './mongodb';
import Product from '@/models/Product';
import Category from '@/models/Categories';

// Helper function to connect to database if not already connected
async function ensureDBConnection() {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function getCategoryProducts(category, subcategory) {
  try {
    await ensureDBConnection();
    
    // First, get the category and subcategory IDs
    const categoryObj = await Category.findOne({ slug: category });
    if (!categoryObj) return [];
    
    let query = { 
      category: categoryObj._id,
      published: true 
    };
    
    if (subcategory) {
      const subcategoryObj = await Category.findOne({ 
        parent: categoryObj._id,
        slug: subcategory 
      });
      
      if (!subcategoryObj) return [];
      query.subcategory = subcategoryObj._id;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ createdAt: -1 });

    return products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
      image: product.images?.[0]?.url || '/placeholder-product.jpg',
      category: product.category?.name,
      subcategory: product.subcategory?.name,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 4) {
  try {
    await ensureDBConnection();
    
    const products = await Product.find({ 
      featured: true,
      published: true 
    })
    .limit(limit)
    .select('name price originalPrice images')
    .sort({ createdAt: -1 });

    return products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
      image: product.images?.[0]?.url || '/placeholder-product.jpg',
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getProductById(id) {
  try {
    await ensureDBConnection();
    
    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');

    if (!product) return null;

    return {
      ...product._doc,
      _id: product._id.toString(),
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
      images: product.images || [],
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
