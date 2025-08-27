import { Router } from 'express';
import { AdminController } from '@/controllers/adminController';
import { authenticate, authorize } from '@/middleware/auth';
import { validateParams, validateBody } from '@/middleware/validation';
import { z } from 'zod';

const router = Router();
const adminController = new AdminController();

// Validation schemas
const userParamsSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
});

const updateKYCStatusSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']),
});

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['ADMIN']));

// Dashboard statistics
router.get('/stats', adminController.getDashboardStats.bind(adminController));

// User management
router.get('/users', adminController.getAllUsers.bind(adminController));

// Transaction management
router.get('/transactions', adminController.getAllTransactions.bind(adminController));

// KYC management
router.get('/kyc/pending', adminController.getPendingKYCReviews.bind(adminController));

router.patch('/kyc/:userId/status',
  validateParams(userParamsSchema),
  validateBody(updateKYCStatusSchema),
  adminController.updateKYCStatus.bind(adminController)
);

// Audit logs
router.get('/audit-logs', adminController.getAuditLogs.bind(adminController));

export default router;