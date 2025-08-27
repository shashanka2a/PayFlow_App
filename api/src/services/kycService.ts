import { KYCStatus, DocumentStatus } from '@prisma/client';
import { KYCVerificationData } from '@/types';
import { NotFoundError, ValidationError } from '@/utils/errors';
import database from '@/utils/database';
import logger from '@/utils/logger';

export class KYCService {
  async submitKYCVerification(userId: string, kycData: KYCVerificationData): Promise<void> {
    try {
      // Update user KYC status and data
      await database.prisma.user.update({
        where: { id: userId },
        data: {
          kycStatus: 'UNDER_REVIEW',
          kycData: kycData as any,
        },
      });

      // Create audit log
      await database.prisma.auditLog.create({
        data: {
          userId,
          action: 'KYC_SUBMITTED',
          resource: 'USER',
          details: { kycData },
        },
      });

      logger.info(`KYC verification submitted for user: ${userId}`);
    } catch (error) {
      logger.error('Submit KYC verification error:', error);
      throw error;
    }
  }

  async processKYCVerification(userId: string): Promise<{ status: KYCStatus; approved: boolean }> {
    try {
      // Mock KYC verification process (90% approval rate)
      const isApproved = Math.random() > 0.1;
      const status: KYCStatus = isApproved ? 'APPROVED' : 'REJECTED';

      // Update user KYC status
      await database.prisma.user.update({
        where: { id: userId },
        data: { kycStatus: status },
      });

      // Create audit log
      await database.prisma.auditLog.create({
        data: {
          userId,
          action: 'KYC_PROCESSED',
          resource: 'USER',
          details: { status, approved: isApproved },
        },
      });

      logger.info(`KYC verification processed for user: ${userId}, status: ${status}`);

      return { status, approved: isApproved };
    } catch (error) {
      logger.error('Process KYC verification error:', error);
      throw error;
    }
  }

  async getKYCStatus(userId: string): Promise<{ status: KYCStatus; kycData?: any }> {
    try {
      const user = await database.prisma.user.findUnique({
        where: { id: userId },
        select: {
          kycStatus: true,
          kycData: true,
        },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return {
        status: user.kycStatus,
        kycData: user.kycData,
      };
    } catch (error) {
      logger.error('Get KYC status error:', error);
      throw error;
    }
  }

  async uploadKYCDocument(
    userId: string,
    documentType: string,
    fileName: string,
    filePath: string,
    fileSize: number,
    mimeType: string
  ): Promise<void> {
    try {
      // Validate document type
      const validTypes = ['GOVERNMENT_ID', 'PROOF_OF_ADDRESS', 'BANK_STATEMENT', 'OTHER'];
      if (!validTypes.includes(documentType)) {
        throw new ValidationError('Invalid document type');
      }

      // Create KYC document record
      await database.prisma.kYCDocument.create({
        data: {
          userId,
          type: documentType as any,
          fileName,
          filePath,
          fileSize,
          mimeType,
          status: 'PENDING',
        },
      });

      // Create audit log
      await database.prisma.auditLog.create({
        data: {
          userId,
          action: 'KYC_DOCUMENT_UPLOADED',
          resource: 'KYC_DOCUMENT',
          details: { documentType, fileName, fileSize },
        },
      });

      logger.info(`KYC document uploaded for user: ${userId}, type: ${documentType}`);
    } catch (error) {
      logger.error('Upload KYC document error:', error);
      throw error;
    }
  }

  async getKYCDocuments(userId: string): Promise<any[]> {
    try {
      const documents = await database.prisma.kYCDocument.findMany({
        where: { userId },
        select: {
          id: true,
          type: true,
          fileName: true,
          fileSize: true,
          mimeType: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return documents;
    } catch (error) {
      logger.error('Get KYC documents error:', error);
      throw error;
    }
  }

  async updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
    adminUserId: string
  ): Promise<void> {
    try {
      const document = await database.prisma.kYCDocument.update({
        where: { id: documentId },
        data: { status },
        include: { user: true },
      });

      // Create audit log
      await database.prisma.auditLog.create({
        data: {
          userId: adminUserId,
          action: 'KYC_DOCUMENT_STATUS_UPDATED',
          resource: 'KYC_DOCUMENT',
          details: { documentId, status, userId: document.userId },
        },
      });

      logger.info(`KYC document status updated: ${documentId} to ${status} by admin: ${adminUserId}`);
    } catch (error) {
      logger.error('Update document status error:', error);
      throw error;
    }
  }

  async getPendingKYCReviews(): Promise<any[]> {
    try {
      const pendingUsers = await database.prisma.user.findMany({
        where: {
          kycStatus: { in: ['PENDING', 'UNDER_REVIEW'] },
        },
        select: {
          id: true,
          name: true,
          email: true,
          kycStatus: true,
          kycData: true,
          createdAt: true,
          kycDocuments: {
            select: {
              id: true,
              type: true,
              fileName: true,
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      return pendingUsers;
    } catch (error) {
      logger.error('Get pending KYC reviews error:', error);
      throw error;
    }
  }
}