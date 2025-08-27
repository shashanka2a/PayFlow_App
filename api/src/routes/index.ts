import { Router } from 'express';
import { ApiResponse } from '@/types';
import authRoutes from './auth';
import beneficiaryRoutes from './beneficiaries';
import transactionRoutes from './transactions';
import kycRoutes from './kyc';
import adminRoutes from './admin';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    message: 'PayFlow API is running',
  };
  res.status(200).json(response);
});

// API routes
router.use('/auth', authRoutes);
router.use('/beneficiaries', beneficiaryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/kyc', kycRoutes);
router.use('/admin', adminRoutes);

export default router;