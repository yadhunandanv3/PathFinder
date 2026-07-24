import express from 'express';
import {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
} from '../controllers/contentController.js';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/resourceController.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Categories endpoints
router.get('/categories', getCategories);
router.post('/categories', authenticate, authorize('ADMIN'), createCategory);
router.delete('/categories/:id', authenticate, authorize('ADMIN'), deleteCategory);

// Public Visitor & Staff Content read endpoints
router.get('/', getAllContent);
router.get('/:id', getContentById);

// Staff Content creation & edition (ADMIN, SOCIAL_MEDIA_MANAGER)
router.post('/', authenticate, authorize('ADMIN', 'SOCIAL_MEDIA_MANAGER'), createContent);
router.put('/:id', authenticate, authorize('ADMIN', 'SOCIAL_MEDIA_MANAGER'), updateContent);

// ADMIN Only Content Deletion
router.delete('/:id', authenticate, authorize('ADMIN'), deleteContent);

export default router;
