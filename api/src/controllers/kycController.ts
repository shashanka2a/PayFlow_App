import { Request, Response, NextFunction } from 'express';
import { KYCService } from '@/services/kycService';
import { AuthenticatedRequest, ApiResponse } from '@/types';

const kycService = new KYCService();

export class KYCController {
  async submitKYCVerification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await kycService.submitKYCVerification(req.user!.id, req.body);

      const response: ApiResponse = {
        success: true,
        message: 'KYC verification submitted successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async processKYCVerification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await kycService.processKYCVerification(req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: `KYC verification ${result.approved ? 'approved' : 'rejected'}`,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getKYCStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const kycStatus = await kycService.getKYCStatus(req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: kycStatus,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async uploadKYCDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real implementation, this would handle file upload
      const { documentType, fileName, fileSize, mimeType } = req.body;
      const filePath = `/uploads/kyc/${req.user!.id}/${fileName}`;

      await kycService.uploadKYCDocument(
        req.user!.id,
        documentType,
        fileName,
        filePath,
        fileSize,
        mimeType
      );

      const response: ApiResponse = {
        success: true,
        message: 'KYC document uploaded successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getKYCDocuments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const documents = await kycService.getKYCDocuments(req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: { documents },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}