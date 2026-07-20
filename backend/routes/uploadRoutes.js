import express from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Secure file upload route (Admin & Social Media Manager only)
router.post('/', protect, authorize('Admin', 'Social Media Manager'), upload.single('file'), uploadFile);

export default router;
