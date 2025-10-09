import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log('Register attempt for phone:', phone);
    if (!phone || !password) return res.status(400).json({ message: 'Missing phone or password' });
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'Phone already used' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ phone, passwordHash });
    await user.save();

    // sign token and return user so frontend can auto-login
    const token = jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.status(201).json({ token, user: { id: user._id, name: user.name, phone: user.phone } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
  const { identifier, password } = req.body; // identifier can be phone or email
  console.log('Login attempt for identifier:', identifier);
  if (!identifier || !password) return res.status(400).json({ message: 'Missing fields' });
  const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, phone: user.phone } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

import { verifyToken } from '../middlewares/auth.js';

router.get('/me', verifyToken, async (req, res) => {
  try {
    return res.json({ user: req.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Dev helper: reset password for a phone number (ONLY available in non-production)
if (process.env.NODE_ENV !== 'production') {
  router.post('/dev/reset-password', async (req, res) => {
    try {
      const { phone, password } = req.body;
      if (!phone || !password) return res.status(400).json({ message: 'Missing phone or password' });
      const user = await User.findOne({ phone });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
      await user.save();
      return res.json({ message: 'Password reset (dev)' });
    } catch (err) {
      console.error('dev reset error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // list users (dev only)
  router.get('/dev/users', async (req, res) => {
    try {
      const users = await User.find().select('phone createdAt');
      return res.json({ users });
    } catch (err) {
      console.error('dev users error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // delete user by phone (dev only)
  router.delete('/dev/users/:phone', async (req, res) => {
    try {
      const { phone } = req.params;
      const user = await User.findOneAndDelete({ phone });
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ message: 'User deleted', phone: user.phone });
    } catch (err) {
      console.error('dev delete error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
}

export default router;
