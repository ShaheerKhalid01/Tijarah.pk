import mongoose from 'mongoose';

/**
 * Global mongoose connection cache
 * Prevents creating multiple connections in serverless environments
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes connection to MongoDB database
 * Uses connection caching for performance in serverless functions
 * @returns {Promise<mongoose.Connection>} MongoDB connection object
 */
export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local. ' +
      'Example: mongodb+srv://username:password@cluster.mongodb.net/database-name'
    );
  }

  // Return cached connection if already established
  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  // Wait for connection promise if in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    console.log('Creating new database connection...');

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('Database connected successfully');
      return mongooseInstance;
    }).catch((error) => {
      console.error('Database connection error:', error);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('Failed to connect to database:', error.message);
    throw error;
  }

  return cached.conn;
}

/**
 * Disconnects from MongoDB database
 * Useful for cleanup in tests or when shutting down
 * @returns {Promise<void>}
 */
export async function disconnectFromDatabase() {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('Database disconnected');
  }
}

/**
 * Gets the current database connection
 * Returns cached connection if available
 * @returns {mongoose.Connection|null}
 */
export function getConnection() {
  return cached.conn;
}

/**
 * Checks if database is connected
 * @returns {boolean}
 */
export function isConnected() {
  return cached.conn !== null;
}

// Default export
export default connectToDatabase;