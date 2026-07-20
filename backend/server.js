import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorMiddleware.js';
import ApiResponse from './utils/apiResponse.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environmental variables
dotenv.config();

const app = express();

// Base Middlewares - Deactivate CSP limiters in helmet so that Swagger UI styles load
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload directory
app.use('/uploads', express.static('uploads'));

// DB Connection
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Swagger Documentation Page
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json(new ApiResponse(200, {
    uptime: process.uptime(),
    timestamp: new Date(),
    mongoDbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  }, 'Server is healthy'));
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/upload', uploadRoutes);

// Fallback mounts for non-prefixed routes
app.use('/auth', authRoutes);
app.use('/resources', resourceRoutes);
app.use('/upload', uploadRoutes);

// Fallback for 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default app;
