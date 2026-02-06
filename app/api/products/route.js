import { connectToDatabase } from '@/lib/db';

// Mock products data as fallback
const mockProducts = [
  {
    _id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    originalPrice: 299.99,
    brand: 'AudioTech',
    category: { _id: 'cat1', name: 'Electronics' },
    images: ['/placeholder-headphones.jpg'],
    rating: 4.5,
    stock: 50,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking and health monitoring',
    price: 299.99,
    originalPrice: 399.99,
    brand: 'TechWatch',
    category: { _id: 'cat1', name: 'Electronics' },
    images: ['/placeholder-watch.jpg'],
    rating: 4.3,
    stock: 30,
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Laptop Backpack',
    description: 'Durable backpack with laptop compartment',
    price: 49.99,
    originalPrice: 69.99,
    brand: 'TravelGear',
    category: { _id: 'cat2', name: 'Accessories' },
    images: ['/placeholder-backpack.jpg'],
    rating: 4.7,
    stock: 100,
    createdAt: new Date().toISOString()
  }
];

/**
 * GET /api/products
 * Returns all products from database or fallback data
 */
export async function GET(request) {
  try {
    // Try database first
    try {
      await connectToDatabase();

      // Import Product model
      let Product;
      try {
        Product = (await import('@/models/Product')).default;
      } catch (modelError) {
        throw new Error('Product model not available');
      }

      // Get pagination parameters from query
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      // Get products with pagination
      const products = await Product.find({})
        .populate('category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return Response.json({
        data: products,
        pagination: {
          page,
          limit,
          hasNextPage: products.length === limit
        }
      }, { status: 200 });

    } catch (dbError) {
      console.warn('Database not available, using fallback data:', dbError.message);
      
      // Return mock data when database fails
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '10');
      
      return Response.json({
        data: mockProducts.slice(0, limit),
        pagination: {
          page: 1,
          limit,
          hasNextPage: false
        },
        fallback: true
      }, { status: 200 });
    }

  } catch (error) {
    console.error('[Products API Error]:', error.message);
    return Response.json(
      { error: 'Failed to fetch products', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product
 */
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.price) {
      return Response.json(
        { error: 'Missing required fields: name, price' },
        { status: 400 }
      );
    }

    // Import Product model
    const Product = (await import('@/models/Product')).default;

    // Create product
    const product = new Product({
      name: body.name,
      description: body.description || '',
      price: body.price,
      category: body.category || null,
      sku: body.sku || '',
      stock: body.stock || 0,
      images: body.images || [],
      specifications: body.specifications || {},
      isActive: body.isActive !== false,
    });

    await product.save();

    return Response.json(product, { status: 201 });

  } catch (error) {
    console.error('[Products API Error]:', error.message);
    return Response.json(
      { error: 'Failed to create product', message: error.message },
      { status: 500 }
    );
  }
}