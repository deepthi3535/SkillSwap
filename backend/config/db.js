import mongoose from 'mongoose';

let mongoMemoryInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri && !uri.includes('cluster0.mongodb.net')) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB Atlas] Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`[MongoDB Atlas] Connection Error: ${error.message}`);
    }
  }

  // If Atlas URI is placeholder or unavailable, fallback to MongoMemoryServer
  try {
    console.log('[MongoDB] Initializing MongoMemoryServer...');
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
