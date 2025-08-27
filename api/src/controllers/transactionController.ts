import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '@/services/transactionService';
import { AuthenticatedRequest, ApiResponse } from '@/types';
import { z } from 'zod';

const transactionService = new TransactionService();

export class TransactionController {
  async createTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const transaction = await transactionService.createTransaction(req.user!.id, req.body);

      const response: ApiResponse = {
        success: true,
        data: { transaction },
        message: 'Transaction created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        status: req.query.status as string,
        beneficiaryId: req.query.beneficiaryId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        minAmount: req.query.minAmount ? Number(req.query.minAmount) : undefined,
        maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : undefined,
      };

      const pagination = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const { transactions, total } = await transactionService.getTransactions(
        req.user!.id,
        filters,
        pagination
      );

      const response: ApiResponse = {
        success: true,
        data: {
          transactions,
          pagination: {
            ...pagination,
            total,
            totalPages: Math.ceil(total / pagination.limit),
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const transaction = await transactionService.getTransactionById(req.user!.id, id);

      const response: ApiResponse = {
        success: true,
        data: { transaction },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await transactionService.getTransactionStats(req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: { stats },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateTransactionStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const transaction = await transactionService.updateTransactionStatus(
        id,
        status,
        req.user!.id
      );

      const response: ApiResponse = {
        success: true,
        data: { transaction },
        message: 'Transaction status updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

// Validation schemas
export const transactionParamsSchema = z.object({
  id: z.string().cuid('Invalid transaction ID'),
});

export const updateTransactionStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']),
});