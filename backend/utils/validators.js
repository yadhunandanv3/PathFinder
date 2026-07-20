import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').trim(),
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'SOCIAL_MEDIA_MANAGER', 'Admin', 'Social Media Manager', 'Visitor']).optional(),
  adminSecretKey: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});
