import { Request, Response, NextFunction } from 'express';
import { BeneficiaryService } from '@/services/beneficiaryService';
import { AuthenticatedRequest, ApiResponse } from '@/types';
import { z } from 'zod';

const beneficiaryService = new BeneficiaryService();

export class BeneficiaryController {
  async createBeneficiary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const beneficiary = await beneficiaryService.createBeneficiary(req.user!.id, req.body);

      const response: ApiResponse = {
        success: true,
        data: { beneficiary },
        message: 'Beneficiary created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBeneficiaries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search } = req.query;
      
      let beneficiaries;
      if (search && typeof search === 'string') {
        beneficiaries = await beneficiaryService.searchBeneficiaries(req.user!.id, search);
      } else {
        beneficiaries = await beneficiaryService.getBeneficiaries(req.user!.id);
      }

      const response: ApiResponse = {
        success: true,
        data: { beneficiaries },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBeneficiaryById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const beneficiary = await beneficiaryService.getBeneficiaryById(req.user!.id, id);

      const response: ApiResponse = {
        success: true,
        data: { beneficiary },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateBeneficiary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const beneficiary = await beneficiaryService.updateBeneficiary(req.user!.id, id, req.body);

      const response: ApiResponse = {
        success: true,
        data: { beneficiary },
        message: 'Beneficiary updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteBeneficiary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await beneficiaryService.deleteBeneficiary(req.user!.id, id);

      const response: ApiResponse = {
        success: true,
        message: 'Beneficiary deleted successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

// Validation schemas for params
export const beneficiaryParamsSchema = z.object({
  id: z.string().cuid('Invalid beneficiary ID'),
});

export const beneficiaryQuerySchema = z.object({
  search: z.string().optional(),
});