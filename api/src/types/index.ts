import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateBeneficiaryData {
  name: string;
  email?: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  country: string;
  currency: string;
  mobileNumber?: string;
  address?: string;
}

export interface CreateTransactionData {
  beneficiaryId: string;
  amount: number;
  purpose?: string;
}

export interface FXRateResponse {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: string;
}

export interface KYCVerificationData {
  ssn: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionFilters {
  status?: string;
  beneficiaryId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  pendingReviews: number;
  highRiskTransactions: number;
}