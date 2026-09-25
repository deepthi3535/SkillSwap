import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import { seedDB } from './seed/seedData.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & Health check endpoints
app.get(['/', '/api/health'], (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'SkillSwap API is running',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Express Global Error]:', err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Connect DB & start server
connectDB().then(async () => {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('[SkillSwap Server] Auto-seeding initial database...');
    await seedDB(false);
  }
  app.listen(PORT, () => {
    console.log(`[SkillSwap Server] Running on http://localhost:${PORT}`);
  });
});
