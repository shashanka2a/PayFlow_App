import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Beneficiary validation schemas
export const createBeneficiarySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email().optional(),
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(10, 'Account number must be at least 10 digits').max(20),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
  country: z.string().default('IN'),
  currency: z.string().default('INR'),
  mobileNumber: z.string().optional(),
  address: z.string().optional(),
});

export const updateBeneficiarySchema = createBeneficiarySchema.partial();

// Transaction validation schemas
export const createTransactionSchema = z.object({
  beneficiaryId: z.string().cuid('Invalid beneficiary ID'),
  amount: z.number().positive('Amount must be positive').max(50000, 'Amount exceeds maximum limit'),
  purpose: z.string().optional(),
});

// KYC validation schemas
export const kycVerificationSchema = z.object({
  ssn: z.string().regex(/^\d{4}$/, 'SSN must be 4 digits'),
  dateOfBirth: z.string().datetime('Invalid date format'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
});

// Query parameter validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const transactionFiltersSchema = z.object({
  status: z.string().optional(),
  beneficiaryId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
});

// IFSC code validation utility
export const validateIFSC = (ifscCode: string): boolean => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifscCode);
};

// Indian mobile number validation
export const validateIndianMobile = (mobile: string): boolean => {
  const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return mobileRegex.test(mobile.replace(/\s/g, ''));
};

// Amount validation for USD-INR transfers
export const validateTransferAmount = (amount: number): { isValid: boolean; message?: string } => {
  if (amount < 1) {
    return { isValid: false, message: 'Minimum transfer amount is $1' };
  }
  if (amount > 50000) {
    return { isValid: false, message: 'Maximum transfer amount is $50,000' };
  }
  return { isValid: true };
};