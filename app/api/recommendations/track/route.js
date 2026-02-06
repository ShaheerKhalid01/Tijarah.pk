import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Recommendation from '@/models/Recommendation';
import Product from '@/models/Product';

/**
 * POST /api/recommendations/track
 * Simple endpoint to track user interactions
 * Lightweight version for real-time tracking
 */
export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { userId, productId, interactionType, metadata } = await request.json();

    if (!userId || !productId || !interactionType) {
      return NextResponse.json(
        { error: 'userId, productId, and interactionType are required' },
        { status: 400 }
      );
    }

    // Quick validation
    const product = await Product.findById(productId, { _id: 1 });
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Track interaction asynchronously for better performance
    Recommendation.updateInteraction(userId, productId, interactionType, { metadata })
      .catch(error => console.error('Async tracking error:', error));

    return NextResponse.json({
      success: true,
      tracked: true,
    });

  } catch (error) {
    console.error('Error in track endpoint:', error);
    return NextResponse.json(
      { error: 'Tracking failed' },
      { status: 500 }
    );
  }
}
