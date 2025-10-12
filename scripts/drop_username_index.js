import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    const db = mongoose.connection.db;
    const col = db.collection('users');
    const indexes = await col.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));
    const target = 'usernameLower_1';
    if (indexes.some(i => i.name === target)) {
      await col.dropIndex(target);
      console.log(' Dropped index', target);
    } else {
      console.log('ℹ Index not found:', target);
    }
  } catch (err) {
    console.error(' Drop index error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
})();
