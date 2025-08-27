import { Router } from 'express';
import { TransactionController, transactionParamsSchema, updateTransactionStatusSchema } from '@/controllers/transactionController';
import { authenticate, requireKYC, authorize } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { transactionRateLimit } from '@/middleware/security';
import { createTransactionSchema, paginationSchema, transactionFiltersSchema } from '@/utils/validation';

const router = Router();
const transactionController = new TransactionController();

// All routes require authentication
router.use(authenticate);

// Get transaction statistics
router.get('/stats',
  transactionController.getTransactionStats.bind(transactionController)
);

// Get all transactions (with filters and pagination)
router.get('/',
  validateQuery(paginationSchema.merge(transactionFiltersSchema)),
  transactionController.getTransactions.bind(transactionController)
);

// Create new transaction
router.post('/',
  requireKYC,
  transactionRateLimit,
  validateBody(createTransactionSchema),
  transactionController.createTransaction.bind(transactionController)
);

// Get transaction by ID
router.get('/:id',
  validateParams(transactionParamsSchema),
  transactionController.getTransactionById.bind(transactionController)
);

// Update transaction status (admin only)
router.patch('/:id/status',
  authorize(['ADMIN']),
  validateParams(transactionParamsSchema),
  validateBody(updateTransactionStatusSchema),
  transactionController.updateTransactionStatus.bind(transactionController)
);

export default router;