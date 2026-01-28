import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Categories';

export async function GET(request, { params }) {
  try {
    const { category } = await params;
    const { searchParams } = new URL(request.url);
    const subcategory = searchParams.get('subcategory');

    await connectToDatabase();

    // Get category
    const categoryObj = await Category.findOne({ slug: category });

    if (!categoryObj) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    let query = {
      category: categoryObj._id,
      active: true
    };

    if (subcategory) {
      const subcategoryObj = await Category.findOne({
        parentCategory: categoryObj._id,
        slug: subcategory
      });

      if (!subcategoryObj) {
        return NextResponse.json({ products: [] }, { status: 200 });
      }
      query.subcategory = subcategoryObj._id;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    const formattedProducts = products.map(product => {
      try {
        const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
        const originalPrice = product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(product.originalPrice)) : null;

        // Find best image
        let imageUrl = '/placeholder-product.jpg';
        if (product.image) {
          imageUrl = product.image;
        } else if (product.images && product.images.length > 0) {
          imageUrl = typeof product.images[0] === 'string' ? product.images[0] : (product.images[0].url || '/placeholder-product.jpg');
        }

        return {
          id: product._id.toString(),
          name: product.name || 'Unnamed Product',
          description: product.description || '',
          price,
          originalPrice,
          discount: product.discount || 0,
          image: imageUrl,
          category: product.category?.name || categoryObj.name,
          subcategory: product.subcategory?.name || subcategory,
          rating: product.rating || 0,
          reviewCount: product.reviews?.length || 0,
          inStock: product.stock > 0
        };
      } catch (err) {
        console.error(`Error formatting product ${product._id}:`, err);
        return null;
      }
    }).filter(Boolean);

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error('[Category API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}
