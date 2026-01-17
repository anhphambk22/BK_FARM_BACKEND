import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bkfarmers';
const phone = process.argv[2];
const newPassword = process.argv[3];

if (!phone || !newPassword) {
  console.error('Usage: node reset_pw.js <phone> <newPassword>');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'bkfarmers' });
    console.log('DB connected');
    const user = await User.findOne({ phone });
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();
    console.log('Password updated for', user.phone);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
