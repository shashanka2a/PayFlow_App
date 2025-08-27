import { Router } from 'express';
import { BeneficiaryController, beneficiaryParamsSchema, beneficiaryQuerySchema } from '@/controllers/beneficiaryController';
import { authenticate, requireKYC } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { createBeneficiarySchema, updateBeneficiarySchema } from '@/utils/validation';

const router = Router();
const beneficiaryController = new BeneficiaryController();

// All routes require authentication
router.use(authenticate);

// Get all beneficiaries (with optional search)
router.get('/',
  validateQuery(beneficiaryQuerySchema),
  beneficiaryController.getBeneficiaries.bind(beneficiaryController)
);

// Create new beneficiary
router.post('/',
  requireKYC,
  validateBody(createBeneficiarySchema),
  beneficiaryController.createBeneficiary.bind(beneficiaryController)
);

// Get beneficiary by ID
router.get('/:id',
  validateParams(beneficiaryParamsSchema),
  beneficiaryController.getBeneficiaryById.bind(beneficiaryController)
);

// Update beneficiary
router.put('/:id',
  validateParams(beneficiaryParamsSchema),
  validateBody(updateBeneficiarySchema),
  beneficiaryController.updateBeneficiary.bind(beneficiaryController)
);

// Delete beneficiary
router.delete('/:id',
  validateParams(beneficiaryParamsSchema),
  beneficiaryController.deleteBeneficiary.bind(beneficiaryController)
);

export default router;