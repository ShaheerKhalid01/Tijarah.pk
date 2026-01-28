import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Complete User Model with All Methods
 * Includes: comparePassword, isAccountLocked, incLoginAttempts, resetLoginAttempts
 * 
 * Location: models/User.js
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: true, // ✅ CHANGED from false to true - NOW password IS returned
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    profileImage: {
      type: String,
      default: '/images/default-avatar.jpg',
    },
    preferences: {
      newsletter: {
        type: Boolean,
        default: false,
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * PRE-SAVE MIDDLEWARE
 * Hashes password before saving
 */
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * METHOD: comparePassword
 * Compares entered password with hashed password
 * 
 * Usage:
 * const isValid = await user.comparePassword('password123');
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

/**
 * METHOD: isAccountLocked
 * Checks if account is currently locked
 * 
 * Usage:
 * if (user.isAccountLocked()) { ... }
 */
userSchema.methods.isAccountLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

/**
 * METHOD: incLoginAttempts
 * Increments login attempts and locks account if needed
 * 
 * Usage:
 * await user.incLoginAttempts();
 */
userSchema.methods.incLoginAttempts = async function () {
  try {
    // Reset attempts if lock has expired
    if (this.lockUntil && this.lockUntil < Date.now()) {
      return this.updateOne({
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 },
      });
    }

    // Otherwise increment
    const updates = { $inc: { loginAttempts: 1 } };

    // Lock account after 5 attempts for 2 hours
    if (this.loginAttempts + 1 >= 5) {
      updates.$set = {
        lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
      };
    }

    return this.updateOne(updates);
  } catch (error) {
    console.error('Error incrementing login attempts:', error);
    throw error;
  }
};

/**
 * METHOD: resetLoginAttempts
 * Resets login attempts and unlocks account
 * 
 * Usage:
 * await user.resetLoginAttempts();
 */
userSchema.methods.resetLoginAttempts = async function () {
  try {
    return this.updateOne({
      $set: { loginAttempts: 0 },
      $unset: { lockUntil: 1 },
    });
  } catch (error) {
    console.error('Error resetting login attempts:', error);
    throw error;
  }
};

/**
 * INDEX: Improve query performance
 */
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ active: 1 });

/**
 * Export: Create or get existing User model
 */
export default mongoose.models.User || mongoose.model('User', userSchema);