import mongoose from 'mongoose';

const ReturnSchema = new mongoose.Schema({
  returnNumber: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  orderNumber: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    default: ''
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: ''
    }
  }],
  reason: {
    type: String,
    required: true,
    enum: ['damaged', 'wrong_item', 'not_as_described', 'changed_mind', 'defective', 'other']
  },
  description: {
    type: String,
    default: ''
  },
  refundAmount: {
    type: Number,
    required: true,
    min: 0
  },
  refundMethod: {
    type: String,
    required: true,
    enum: ['original', 'store_credit', 'exchange'],
    default: 'original'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'processed', 'completed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  trackingNumber: {
    type: String,
    default: ''
  },
  refundProcessed: {
    type: Boolean,
    default: false
  },
  refundProcessedDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ReturnSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
ReturnSchema.index({ returnNumber: 1 });
ReturnSchema.index({ customerEmail: 1 });
ReturnSchema.index({ orderId: 1 });
ReturnSchema.index({ status: 1 });
ReturnSchema.index({ createdAt: -1 });

const Return = mongoose.models.Return || mongoose.model('Return', ReturnSchema);

export default Return;
