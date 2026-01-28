import express from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
import sensorRoutes from "./src/routes/sensor.js";
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/sensor", sensorRoutes);

const USERS_FILE = './users.json';

// Helper đọc và ghi file user
const loadUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
const saveUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// Tạo JWT
function signToken(user) {
  return jwt.sign(
    { username: user.username, role: user.role, mustChangePassword: user.mustChangePassword },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRE }
  );
}

// Middleware xác thực JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Thiếu token' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
}

// ---- API ----

// Đăng nhập
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: 'Tài khoản không tồn tại' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Sai mật khẩu' });

  const token = signToken(user);
  res.json({ token, user: { username: user.username, role: user.role, mustChangePassword: user.mustChangePassword } });
});

// Lấy thông tin tài khoản hiện tại
app.get('/api/me', authMiddleware, (req, res) => {
  const users = loadUsers();
  const user = users.find((u) => u.username === req.user.username);
  res.json({ username: user.username, role: user.role, mustChangePassword: user.mustChangePassword });
});

// Đổi mật khẩu
app.post('/api/change-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.username === req.user.username);

  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) return res.status(400).json({ message: 'Sai mật khẩu hiện tại' });

  user.password = await bcrypt.hash(newPassword, 10);
  user.mustChangePassword = false;
  saveUsers(users);
  res.json({ ok: true });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 BK Farmers backend chạy tại http://localhost:${process.env.PORT}`);
});
