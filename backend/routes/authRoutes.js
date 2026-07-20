import express from 'express';
import { register, login } from '../controllers/authController.js';
import validateRequest from '../middleware/validationMiddleware.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { protect } from '../middleware/authMiddleware.js';
import ApiResponse from '../utils/apiResponse.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Helper route to verify active credentials
router.get('/me', protect, (req, res) => {
  res.status(200).json(new ApiResponse(200, {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  }, 'User profile retrieved'));
});

export default router;
