import { connectToDatabase } from '@/lib/db';

/**
 * GET /api/products
 * Returns all products from database
 */
export async function GET(request) {
  try {
    console.log('[Products API] GET request received');
    
    await connectToDatabase();
    console.log('[Products API] Database connected');

    // Import Product model
    let Product;
    try {
      Product = (await import('@/models/Product')).default;
      console.log('[Products API] Product model imported');
    } catch (modelError) {
      console.error('[Products API] Failed to import Product model:', modelError.message);
      return Response.json(
        { error: 'Product model not found', message: modelError.message },
        { status: 500 }
      );
    }

    // Get pagination parameters from query
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '200'); // Increased default limit to 200
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Product.countDocuments({});
    
    // Get products with pagination
    const products = await Product.find({})
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(`[Products API] Found ${products.length} products (page ${page}, limit ${limit})`);

    return Response.json({
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    }, { status: 200 });

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
    console.log('[Products API] POST request received');
    
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

    console.log('[Products API] Product created:', product._id);

    return Response.json(product, { status: 201 });

  } catch (error) {
    console.error('[Products API Error]:', error.message);
    return Response.json(
      { error: 'Failed to create product', message: error.message },
      { status: 500 }
    );
  }
}