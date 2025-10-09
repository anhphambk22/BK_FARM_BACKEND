import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bkfarmers';

// Flag to know if we connected to in-memory MongoDB
export let isInMemory = false;

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'bkfarmers' });
    isInMemory = false;
    const conn = mongoose.connection;
    console.log(`MongoDB connected → host: ${conn.host}, db: ${conn.name}`);
    return;
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    // Fallback: try an in-memory MongoDB for local development
    if (process.env.DISABLE_INMEMORY_FALLBACK === 'true') {
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
