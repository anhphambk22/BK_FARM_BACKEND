import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DEFAULT_LOCAL_URI = 'mongodb://localhost:27017/bkfarmers';
const DEFAULT_DB_NAME = process.env.MONGO_DBNAME || 'bkfarmers';
const CONNECT_OPTIONS = {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
};

// Flag to know if we connected to in-memory MongoDB
export let isInMemory = false;

export async function connectDB() {
  try {
    if (!MONGO_URI && IS_PRODUCTION) {
      throw new Error('MONGO_URI is missing in production');
    }
    const uri = MONGO_URI || DEFAULT_LOCAL_URI;
    const hasDbInUri = /mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(uri);
    const options = hasDbInUri ? CONNECT_OPTIONS : { ...CONNECT_OPTIONS, dbName: DEFAULT_DB_NAME };
    await mongoose.connect(uri, options);
    isInMemory = false;
    const conn = mongoose.connection;
    console.log(`MongoDB connected → host: ${conn.host}, db: ${conn.name}`);
    return;
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    // Fallback: try an in-memory MongoDB for local development
    if (process.env.DISABLE_INMEMORY_FALLBACK === 'true' || IS_PRODUCTION) {
      console.error('In-memory fallback disabled by DISABLE_INMEMORY_FALLBACK=true');
      throw err;
    }
    try {
      console.log('Falling back to in-memory MongoDB (development)');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri, { dbName: 'bkfarmers_inmem' });
      isInMemory = true;
      const conn = mongoose.connection;
      console.log(`Connected to in-memory MongoDB → host: ${conn.host}, db: ${conn.name}`);
      return;
    } catch (memErr) {
      console.error('In-memory MongoDB failed:', memErr);
      process.exit(1);
    }
  }
}
