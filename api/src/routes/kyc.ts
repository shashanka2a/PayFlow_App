import { Router } from 'express';
import { KYCController } from '@/controllers/kycController';
import { authenticate } from '@/middleware/auth';
import { validateBody } from '@/middleware/validation';
import { kycVerificationSchema } from '@/utils/validation';
import { z } from 'zod';

const router = Router();
const kycController = new KYCController();

// Validation schemas
const uploadDocumentSchema = z.object({
  documentType: z.enum(['GOVERNMENT_ID', 'PROOF_OF_ADDRESS', 'BANK_STATEMENT', 'OTHER']),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().positive('File size must be positive'),
  mimeType: z.string().min(1, 'MIME type is required'),
});

// All routes require authentication
router.use(authenticate);

// Get KYC status
router.get('/status', kycController.getKYCStatus.bind(kycController));

// Submit KYC verification
router.post('/verify',
  validateBody(kycVerificationSchema),
  kycController.submitKYCVerification.bind(kycController)
);

// Process KYC verification (mock)
router.post('/process', kycController.processKYCVerification.bind(kycController));

// Upload KYC document
router.post('/documents',
  validateBody(uploadDocumentSchema),
  kycController.uploadKYCDocument.bind(kycController)
);

// Get KYC documents
router.get('/documents', kycController.getKYCDocuments.bind(kycController));

export default router;