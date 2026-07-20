import express from 'express';
import {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
} from '../controllers/contentController.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Public Visitor & Staff read endpoints
router.get('/', getAllContent);
router.get('/:id', getContentById);

// Staff Content creation & edition (ADMIN, SOCIAL_MEDIA_MANAGER)
router.post('/', authenticate, authorize('ADMIN', 'SOCIAL_MEDIA_MANAGER'), createContent);
router.put('/:id', authenticate, authorize('ADMIN', 'SOCIAL_MEDIA_MANAGER'), updateContent);

// ADMIN Only Content Deletion
router.delete('/:id', authenticate, authorize('ADMIN'), deleteContent);

export default router;
