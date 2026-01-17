import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Delete all users with username = null
    const result = await usersCollection.deleteMany({ username: null });
    console.log(`✅ Deleted ${result.deletedCount} users with null username`);
    
    // Also delete users with usernameLower = null
    const result2 = await usersCollection.deleteMany({ usernameLower: null });
    console.log(`✅ Deleted ${result2.deletedCount} users with null usernameLower`);
    
    await mongoose.disconnect();
    console.log('Cleanup complete! 🎉');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

cleanup();
