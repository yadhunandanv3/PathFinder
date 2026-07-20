import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/resourceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Visitor Endpoints
router.get('/', getResources);
router.get('/categories', getCategories);
router.get('/:id', getResourceById);

// Admin & SMM Resource Creation / Edit
router.post('/', protect, authorize('Admin', 'Social Media Manager'), createResource);
router.put('/:id', protect, authorize('Admin', 'Social Media Manager'), updateResource);

// Admin Only Resource Deletion
router.delete('/:id', protect, authorize('Admin'), deleteResource);

// Admin Only Category Management
router.post('/categories', protect, authorize('Admin'), createCategory);
router.delete('/categories/:id', protect, authorize('Admin'), deleteCategory);

export default router;
