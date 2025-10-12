import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, lowercase: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['user'] },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
