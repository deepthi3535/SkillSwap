import mongoose from 'mongoose';

const connectDB = async () => {
  const rawUri = process.env.MONGO_URI;

  if (!rawUri || typeof rawUri !== 'string' || !rawUri.trim()) {
    const errorMsg =
      '[MongoDB Atlas Error] MONGO_URI environment variable is missing or empty. ' +
      'Please set MONGO_URI in your environment settings (e.g., Render Dashboard -> Environment Variables).';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Remove any accidental leading/trailing whitespace or surrounding quotes
  const uri = rawUri.trim().replace(/^['"]|['"]$/g, '');

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    const errorMsg =
      '[MongoDB Atlas Error] Invalid scheme: MONGO_URI must start with "mongodb://" or "mongodb+srv://". ' +
      'Please verify the connection string entered in your Render Environment Variables.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    console.log('[MongoDB Atlas] Connecting to MongoDB Atlas cluster...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB Atlas] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Atlas Error] Connection failed: ${error.message}`);
    throw error;
  }
};

export default connectDB;
