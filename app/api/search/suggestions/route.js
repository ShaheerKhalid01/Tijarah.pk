import { getAllProducts } from '@/app/lib/product-data';

export async function GET(request) {
    try {
        console.log('[API] /api/search/suggestions called');

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        // Use centralized product data
        const products = getAllProducts();

        // Map products to the format expected by the navbar
        const allProducts = products.map(p => ({
            _id: p.id,
            name: p.name || p.id,
            image: p.image || (p.images && p.images[0]) || '', // Handle both image and images array
            price: p.price || 0,
            originalPrice: p.originalPrice || 0,
            brand: p.brand || 'Tijarah',
            category: p.category || 'Electronics', // Keep as string for filtering
            discount: p.discount || 0
        }));

        console.log('[API] Total products from central store:', allProducts.length);

        // If empty or no query
        if (!query || query.trim() === '') {
            return Response.json({
                suggestions: allProducts.slice(0, 8), // Just return top 8
                success: true,
                count: Math.min(allProducts.length, 8),
                message: 'All products'
            }, { status: 200 });
        }

        // Filter products
        const searchLower = query.toLowerCase().trim();
        const filtered = allProducts.filter(product => {
            const nameMatch = product.name.toLowerCase().includes(searchLower);
            const brandMatch = product.brand.toLowerCase().includes(searchLower);
            const categoryMatch = product.category.toLowerCase().includes(searchLower);

            return nameMatch || brandMatch || categoryMatch;
        });

        console.log('[API] Filtered results:', filtered.length, 'products');

        return Response.json({
            suggestions: filtered.slice(0, 10), // Limit to 10 suggestions
            success: true,
            query: query,
            count: filtered.length,
            message: `Found ${filtered.length} products matching "${query}"`
        }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('[API] ERROR:', error.message);
        return Response.json({
            success: false,
            suggestions: [],
            error: error.message,
            message: 'Error fetching suggestions'
        }, { status: 500 });
    }
}