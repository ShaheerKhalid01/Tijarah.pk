import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Order Info
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    // Customer Info
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: false,
    },
    
    // Shipping Address
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    
    // Order Items
    items: [
      {
        productId: String,  // ← CHANGED from ObjectId to String
        productName: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    
    // Pricing
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    
    // Payment Info
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'credit_card', 'digital_wallet'],
      default: 'cash_on_delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    
    // Order Status
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    
    // Tracking
    trackingNumber: String,
    shippedDate: Date,
    deliveredDate: Date,
    
    // Notes
    notes: String,
    
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);