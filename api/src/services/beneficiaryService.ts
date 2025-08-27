import { Beneficiary } from '@prisma/client';
import { CreateBeneficiaryData } from '@/types';
import { NotFoundError, ValidationError } from '@/utils/errors';
import { validateIFSC } from '@/utils/validation';
import database from '@/utils/database';
import logger from '@/utils/logger';

export class BeneficiaryService {
  async createBeneficiary(userId: string, beneficiaryData: CreateBeneficiaryData): Promise<Beneficiary> {
    try {
      // Validate IFSC code
      if (!validateIFSC(beneficiaryData.ifscCode)) {
        throw new ValidationError('Invalid IFSC code format');
      }

      // Create beneficiary
      const beneficiary = await database.prisma.beneficiary.create({
        data: {
          ...beneficiaryData,
          userId,
        },
      });

      logger.info(`Beneficiary created: ${beneficiary.name} for user: ${userId}`);

      return beneficiary;
    } catch (error) {
      logger.error('Create beneficiary error:', error);
      throw error;
    }
  }

  async getBeneficiaries(userId: string): Promise<Beneficiary[]> {
    try {
      const beneficiaries = await database.prisma.beneficiary.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return beneficiaries;
    } catch (error) {
      logger.error('Get beneficiaries error:', error);
      throw error;
    }
  }

  async getBeneficiaryById(userId: string, beneficiaryId: string): Promise<Beneficiary> {
    try {
      const beneficiary = await database.prisma.beneficiary.findFirst({
        where: {
          id: beneficiaryId,
          userId,
        },
      });

      if (!beneficiary) {
        throw new NotFoundError('Beneficiary not found');
      }

      return beneficiary;
    } catch (error) {
      logger.error('Get beneficiary error:', error);
      throw error;
    }
  }

  async updateBeneficiary(
    userId: string,
    beneficiaryId: string,
    updateData: Partial<CreateBeneficiaryData>
  ): Promise<Beneficiary> {
    try {
      // Validate IFSC code if provided
      if (updateData.ifscCode && !validateIFSC(updateData.ifscCode)) {
        throw new ValidationError('Invalid IFSC code format');
      }

      // Check if beneficiary exists and belongs to user
      const existingBeneficiary = await this.getBeneficiaryById(userId, beneficiaryId);

      // Update beneficiary
      const beneficiary = await database.prisma.beneficiary.update({
        where: { id: beneficiaryId },
        data: updateData,
      });

      logger.info(`Beneficiary updated: ${beneficiary.name} for user: ${userId}`);

      return beneficiary;
    } catch (error) {
      logger.error('Update beneficiary error:', error);
      throw error;
    }
  }

  async deleteBeneficiary(userId: string, beneficiaryId: string): Promise<void> {
    try {
      // Check if beneficiary exists and belongs to user
      await this.getBeneficiaryById(userId, beneficiaryId);

      // Check if beneficiary has any transactions
      const transactionCount = await database.prisma.transaction.count({
        where: { beneficiaryId },
      });

      if (transactionCount > 0) {
        throw new ValidationError('Cannot delete beneficiary with existing transactions');
      }

      // Delete beneficiary
      await database.prisma.beneficiary.delete({
        where: { id: beneficiaryId },
      });

      logger.info(`Beneficiary deleted: ${beneficiaryId} for user: ${userId}`);
    } catch (error) {
      logger.error('Delete beneficiary error:', error);
      throw error;
    }
  }

  async searchBeneficiaries(userId: string, searchTerm: string): Promise<Beneficiary[]> {
    try {
      const beneficiaries = await database.prisma.beneficiary.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { bankName: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      return beneficiaries;
    } catch (error) {
      logger.error('Search beneficiaries error:', error);
      throw error;
    }
  }
}