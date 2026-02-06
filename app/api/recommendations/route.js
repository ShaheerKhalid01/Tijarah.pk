import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Recommendation from '../../../../models/Recommendation';
import Product from '../../../../models/Product';
import User from '../../../../models/User';

/**
 * GET /api/recommendations
 * Get personalized recommendations for authenticated user
 */
export async function GET(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const type = searchParams.get('type') || 'collaborative'; // collaborative, popular, similar

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let recommendations = [];

    switch (type) {
      case 'collaborative':
        recommendations = await getCollaborativeRecommendations(userId, limit);
        break;
      case 'popular':
        recommendations = await getPopularRecommendations(userId, limit);
        break;
      case 'similar':
        recommendations = await getSimilarProductsRecommendations(userId, limit);
        break;
      default:
        recommendations = await getCollaborativeRecommendations(userId, limit);
    }

    return NextResponse.json({
      success: true,
      recommendations,
      type,
      count: recommendations.length,
    });

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recommendations
 * Track user interaction with product
 */
export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { userId, productId, interactionType, rating, metadata } = await request.json();

    if (!userId || !productId || !interactionType) {
      return NextResponse.json(
        { error: 'userId, productId, and interactionType are required' },
        { status: 400 }
      );
    }

    // Validate user and product exist
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const interaction = await Recommendation.updateInteraction(
      userId,
      productId,
      interactionType,
      { rating, metadata }
    );

    return NextResponse.json({
      success: true,
      interaction,
      message: 'Interaction tracked successfully',
    });

  } catch (error) {
    console.error('Error tracking interaction:', error);
    return NextResponse.json(
      { error: 'Failed to track interaction' },
      { status: 500 }
    );
  }
}

/**
 * Collaborative Filtering Recommendations
 * Based on similar users' preferences
 */
async function getCollaborativeRecommendations(userId, limit) {
  try {
    // Get user's interaction history
    const userInteractions = await Recommendation.find({ user: userId })
      .distinct('product');

    // Find similar users
    const similarUsers = await Recommendation.getSimilarUsers(userId, 20);

    if (similarUsers.length === 0) {
      return await getPopularRecommendations(userId, limit);
    }

    // Get products liked by similar users but not by current user
    const similarUserIds = similarUsers.map(u => u._id);
    
    const recommendations = await Recommendation.aggregate([
      {
        $match: {
          user: { $in: similarUserIds },
          product: { $nin: userInteractions },
          interactionType: { $in: ['purchase', 'like', 'wishlist_add'] }
        }
      },
      {
        $group: {
          _id: '$product',
          score: { $sum: '$weight' },
          interactions: { $sum: 1 }
        }
      },
      {
        $sort: { score: -1, interactions: -1 }
      },
      {
        $limit: limit * 2 // Get more to filter out inactive products
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $match: {
          'product.active': true,
          'product.stock': { $gt: 0 }
        }
      },
      {
        $limit: limit
      },
      {
        $project: {
          product: 1,
          score: 1,
          interactions: 1,
          recommendationType: 'collaborative'
        }
      }
    ]);

    return recommendations;
  } catch (error) {
    console.error('Error in collaborative recommendations:', error);
    return [];
  }
}

/**
 * Popular Products Recommendations
 * Based on overall popularity and trending items
 */
async function getPopularRecommendations(userId, limit) {
  try {
    const userInteractions = await Recommendation.find({ user: userId })
      .distinct('product');

    const recommendations = await Recommendation.aggregate([
      {
        $match: {
          interactionType: { $in: ['purchase', 'like'] },
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: '$product',
          score: { $sum: '$weight' },
          interactions: { $sum: 1 }
        }
      },
      {
        $sort: { score: -1, interactions: -1 }
      },
      {
        $limit: limit * 2
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $match: {
          'product.active': true,
          'product.stock': { $gt: 0 },
          '_id': { $nin: userInteractions }
        }
      },
      {
        $limit: limit
      },
      {
        $project: {
          product: 1,
          score: 1,
          interactions: 1,
          recommendationType: 'popular'
        }
      }
    ]);

    return recommendations;
  } catch (error) {
    console.error('Error in popular recommendations:', error);
    return [];
  }
}

/**
 * Similar Products Recommendations
 * Based on products in the same categories as user's preferences
 */
async function getSimilarProductsRecommendations(userId, limit) {
  try {
    // Get user's preferred categories
    const userPreferences = await Recommendation.find({ user: userId })
      .populate({
        path: 'product',
        select: 'category subcategory'
      })
      .sort({ weight: -1 })
      .limit(20);

    const categoryIds = [...new Set(
      userPreferences
        .filter(p => p.product && p.product.category)
        .map(p => p.product.category.toString())
    )];

    const userProductIds = userPreferences.map(p => p.product._id.toString());

    if (categoryIds.length === 0) {
      return await getPopularRecommendations(userId, limit);
    }

    const recommendations = await Product.aggregate([
      {
        $match: {
          category: { $in: categoryIds.map(id => new mongoose.Types.ObjectId(id)) },
          _id: { $nin: userProductIds.map(id => new mongoose.Types.ObjectId(id)) },
          active: true,
          stock: { $gt: 0 }
        }
      },
      {
        $addFields: {
          // Boost products with higher ratings and more reviews
          popularityScore: {
            $add: [
              { $multiply: ['$rating', 10] },
              { $size: { $ifNull: ['$reviews', []] } }
            ]
          }
        }
      },
      {
        $sort: { popularityScore: -1, createdAt: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          product: '$$ROOT',
          score: '$popularityScore',
          interactions: { $size: { $ifNull: ['$reviews', []] } },
          recommendationType: 'similar'
        }
      }
    ]);

    return recommendations;
  } catch (error) {
    console.error('Error in similar products recommendations:', error);
    return [];
  }
}
