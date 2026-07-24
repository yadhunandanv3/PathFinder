import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import ApiResponse from './utils/apiResponse.js';

dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Security Header Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));

// Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Express Body Parsing Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving for uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads', (req, res) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: 'File not found on server storage. Ephemeral disk cleanups on redeployment may have removed it.',
    data: null,
  });
});

// Health Audit Route
app.get('/health', (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        status: 'UP',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
      },
      'Server health verified'
    )
  );
});

// Primary Production API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/upload', uploadRoutes);

// Fallback mounts for non-prefixed routes
app.use('/auth', authRoutes);
app.use('/content', contentRoutes);
app.use('/users', userRoutes);
app.use('/resources', resourceRoutes);
app.use('/upload', uploadRoutes);

// Centralized 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: 'API Route Not Found',
    data: null,
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Pathfinder RBAC Backend running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});
