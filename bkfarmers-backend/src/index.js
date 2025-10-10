import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);

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
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
