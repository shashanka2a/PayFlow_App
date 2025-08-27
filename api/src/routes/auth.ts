import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';
import { validateBody } from '@/middleware/validation';
import { authRateLimit } from '@/middleware/security';
import { createUserSchema, loginSchema } from '@/utils/validation';
import { z } from 'zod';

const router = Router();
const authController = new AuthController();

// Validation schemas
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
});

// Public routes
router.post('/register', 
  authRateLimit,
  validateBody(createUserSchema),
  authController.register.bind(authController)
);

router.post('/login',
  authRateLimit,
  validateBody(loginSchema),
  authController.login.bind(authController)
);

// Protected routes
router.use(authenticate);

router.post('/logout', authController.logout.bind(authController));

router.get('/profile', authController.getProfile.bind(authController));

router.put('/profile',
  validateBody(updateProfileSchema),
  authController.updateProfile.bind(authController)
);

router.post('/change-password',
  validateBody(changePasswordSchema),
  authController.changePassword.bind(authController)
);

router.get('/refresh', authController.refreshToken.bind(authController));

export default router;