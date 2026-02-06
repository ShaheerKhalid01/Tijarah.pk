import mongoose from 'mongoose';

/**
 * Recommendation Model
 * Tracks user interactions with products for collaborative filtering
 * 
 * Location: models/Recommendation.js
 */
const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product'],
      index: true,
    },
    interactionType: {
      type: String,
      enum: ['view', 'like', 'purchase', 'cart_add', 'wishlist_add'],
      required: [true, 'Please provide an interaction type'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 1,
    },
    weight: {
      type: Number,
      default: function() {
        // Assign weights based on interaction type
        const weights = {
          view: 1,
          like: 2,
          cart_add: 3,
          wishlist_add: 3,
          purchase: 5
        };
        return weights[this.interactionType] || 1;
      },
    },
    metadata: {
      sessionId: String,
      source: {
        type: String,
        enum: ['search', 'category', 'recommendation', 'direct', 'other'],
        default: 'other',
      },
      duration: Number, // Time spent viewing product in seconds
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
recommendationSchema.index({ user: 1, interactionType: 1 });
recommendationSchema.index({ user: 1, product: 1 }, { unique: true });
recommendationSchema.index({ product: 1, interactionType: 1 });
recommendationSchema.index({ createdAt: -1 });

/**
 * METHOD: updateInteraction
 * Updates or creates an interaction record
 * 
 * Usage:
 * await Recommendation.updateInteraction(userId, productId, 'purchase', { rating: 5 });
 */
recommendationSchema.statics.updateInteraction = async function(
  userId, 
  productId, 
  interactionType, 
  options = {}
) {
  try {
    const updateData = {
      interactionType,
      weight: options.weight || this.getWeight(interactionType),
      ...options.metadata
    };

    if (options.rating) {
      updateData.rating = options.rating;
    }

    return await this.findOneAndUpdate(
      { user: userId, product: productId },
      updateData,
      { upsert: true, new: true }
    ).populate('product');
  } catch (error) {
    console.error('Error updating interaction:', error);
    throw error;
  }
};

/**
 * STATIC METHOD: getWeight
 * Returns weight for interaction type
 */
recommendationSchema.statics.getWeight = function(interactionType) {
  const weights = {
    view: 1,
    like: 2,
    cart_add: 3,
    wishlist_add: 3,
    purchase: 5
  };
  return weights[interactionType] || 1;
};

/**
 * STATIC METHOD: getUserPreferences
 * Gets user's interaction history for recommendation calculations
 */
recommendationSchema.statics.getUserPreferences = async function(userId, limit = 50) {
  try {
    return await this.find({ user: userId })
      .populate('product')
      .sort({ weight: -1, createdAt: -1 })
      .limit(limit);
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
};

/**
 * STATIC METHOD: getSimilarUsers
 * Finds users with similar product preferences
 */
recommendationSchema.statics.getSimilarUsers = async function(userId, limit = 10) {
  try {
    const userProducts = await this.find({ user: userId })
      .distinct('product');

    return await this.aggregate([
      {
        $match: {
          product: { $in: userProducts },
          user: { $ne: userId }
        }
      },
      {
        $group: {
          _id: '$user',
          commonProducts: { $sum: 1 },
          totalWeight: { $sum: '$weight' }
        }
      },
      {
        $sort: { totalWeight: -1, commonProducts: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      }
    ]);
  } catch (error) {
    console.error('Error finding similar users:', error);
    throw error;
  }
};

export default mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);
