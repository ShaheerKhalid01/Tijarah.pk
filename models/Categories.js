import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      type: String,
      default: '/images/placeholder.jpg',
    },
    icon: {
      type: String,
      default: '📁',
    },
    emoji: {
      type: String,
      default: '📁',
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    displayName: String,
    meta: mongoose.Schema.Types.Mixed,
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Indexes for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ active: 1 });
categorySchema.index({ featured: 1 });
categorySchema.index({ parentCategory: 1 });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);