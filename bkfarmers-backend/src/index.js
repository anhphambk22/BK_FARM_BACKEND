import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';
import { connectDB, isInMemory } from './config/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    dbReadyState: mongoose.connection.readyState,
    isInMemory,
  });
});

import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);

import aiRoutes from './routes/ai.js';
console.log('Mounting AI routes at /api/ai');
app.use('/api/ai', aiRoutes);
// Debug route to list all routes
app.get('/api/debug-routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push(middleware.route.path);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) routes.push(handler.route.path);
      });
    }
  });
  res.json(routes);
});


// --- Serve frontend build (all-in-one) ---
// Resolve root/dist path relative to this file (bkfarmers-backend/src)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');
const distDir = path.join(rootDir, 'dist');

if (fs.existsSync(distDir)) {
	// Serve static files
	app.use(express.static(distDir));
	// SPA fallback for non-API routes
	app.get(/^(?!\/api).*/, (req, res) => {
		res.sendFile(path.join(distDir, 'index.html'));
	});
} else {
	console.log('dist/ not found — frontend build not served by backend. Run "npm run build" at project root for all-in-one.');
}

const PORT = process.env.PORT || 5000;

// Start server after DB connects
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
