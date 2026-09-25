import mongoose from 'mongoose';

let mongoMemoryInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      console.log('[MongoDB Atlas] Connecting to MongoDB Atlas cluster...');
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB Atlas] Successfully Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`[MongoDB Atlas Error]: ${error.message}`);
    }
  }

  // Fallback to MongoMemoryServer if internet or Atlas is offline
  try {
    console.log('[MongoDB] Initializing local MongoMemoryServer fallback...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryInstance = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryInstance.getUri();
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Database] Connected via MongoMemoryServer: ${conn.connection.host}`);
    return conn;
  } catch (fallbackError) {
    console.error('[MongoDB Error] Database connection failed:', fallbackError.message);
    process.exit(1);
  }
};

export default connectDB;
