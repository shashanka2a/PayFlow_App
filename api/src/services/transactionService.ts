import { Transaction, RiskLevel, TransactionStatus } from '@prisma/client';
import { CreateTransactionData, TransactionFilters, PaginationParams } from '@/types';
import { NotFoundError, ValidationError } from '@/utils/errors';
import { validateTransferAmount } from '@/utils/validation';
import database from '@/utils/database';
import logger from '@/utils/logger';

export class TransactionService {
  async createTransaction(userId: string, transactionData: CreateTransactionData): Promise<Transaction> {
    try {
      // Validate transfer amount
      const amountValidation = validateTransferAmount(transactionData.amount);
      if (!amountValidation.isValid) {
        throw new ValidationError(amountValidation.message!);
      }

      // Verify beneficiary belongs to user
      const beneficiary = await database.prisma.beneficiary.findFirst({
        where: {
          id: transactionData.beneficiaryId,
          userId,
        },
      });

      if (!beneficiary) {
        throw new NotFoundError('Beneficiary not found');
      }

      // Get current USD to INR exchange rate
      const exchangeRate = await this.getCurrentExchangeRate('USD', 'INR');

      // Calculate fee (0.5% minimum $5)
      const fee = Math.max(5, transactionData.amount * 0.005);

      // Generate transaction reference
      const reference = this.generateTransactionReference();

      // Assess risk level
      const riskLevel = this.assessRiskLevel(transactionData.amount, exchangeRate);
      const riskFlags = this.generateRiskFlags(transactionData.amount, exchangeRate);

      // Create transaction
      const transaction = await database.prisma.transaction.create({
        data: {
          reference,
          amount: transactionData.amount,
          currency: beneficiary.currency,
          exchangeRate,
          fee,
          purpose: transactionData.purpose,
          riskLevel,
          riskFlags,
          status: riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? 'PENDING' : 'PROCESSING',
          userId,
          beneficiaryId: transactionData.beneficiaryId,
        },
        include: {
          beneficiary: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Transaction created: ${transaction.reference} for user: ${userId}`);

      return transaction;
    } catch (error) {
      logger.error('Create transaction error:', error);
      throw error;
    }
  }

  async getTransactions(
    userId: string,
    filters: TransactionFilters,
    pagination: PaginationParams
  ): Promise<{ transactions: Transaction[]; total: number }> {
    try {
      const where: any = { userId };

      // Apply filters
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.beneficiaryId) {
        where.beneficiaryId = filters.beneficiaryId;
      }
      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
          where.createdAt.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.createdAt.lte = new Date(filters.endDate);
        }
      }
      if (filters.minAmount || filters.maxAmount) {
        where.amount = {};
        if (filters.minAmount) {
          where.amount.gte = filters.minAmount;
        }
        if (filters.maxAmount) {
          where.amount.lte = filters.maxAmount;
        }
      }

      // Get total count
      const total = await database.prisma.transaction.count({ where });

      // Get transactions with pagination
      const transactions = await database.prisma.transaction.findMany({
        where,
        include: {
          beneficiary: true,
        },
        orderBy: {
          [pagination.sortBy || 'createdAt']: pagination.sortOrder,
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      });

      return { transactions, total };
    } catch (error) {
      logger.error('Get transactions error:', error);
      throw error;
    }
  }

  async getTransactionById(userId: string, transactionId: string): Promise<Transaction> {
    try {
      const transaction = await database.prisma.transaction.findFirst({
        where: {
          id: transactionId,
          userId,
        },
        include: {
          beneficiary: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!transaction) {
        throw new NotFoundError('Transaction not found');
      }

      return transaction;
    } catch (error) {
      logger.error('Get transaction error:', error);
      throw error;
    }
  }

  async updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
    adminUserId?: string
  ): Promise<Transaction> {
    try {
      const transaction = await database.prisma.transaction.update({
        where: { id: transactionId },
        data: { status },
        include: {
          beneficiary: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Transaction status updated: ${transaction.reference} to ${status} by ${adminUserId || 'system'}`);

      return transaction;
    } catch (error) {
      logger.error('Update transaction status error:', error);
      throw error;
    }
  }

  async getTransactionStats(userId?: string): Promise<any> {
    try {
      const where = userId ? { userId } : {};

      const [
        totalTransactions,
        completedTransactions,
        totalVolume,
        pendingTransactions,
        highRiskTransactions,
      ] = await Promise.all([
        database.prisma.transaction.count({ where }),
        database.prisma.transaction.count({ where: { ...where, status: 'COMPLETED' } }),
        database.prisma.transaction.aggregate({
          where: { ...where, status: 'COMPLETED' },
          _sum: { amount: true },
        }),
        database.prisma.transaction.count({
          where: { ...where, status: { in: ['PENDING', 'PROCESSING'] } },
        }),
        database.prisma.transaction.count({
          where: { ...where, riskLevel: { in: ['HIGH', 'CRITICAL'] } },
        }),
      ]);

      const successRate = totalTransactions > 0 
        ? (completedTransactions / totalTransactions) * 100 
        : 0;

      return {
        totalTransactions,
        completedTransactions,
        totalVolume: totalVolume._sum.amount || 0,
        pendingTransactions,
        highRiskTransactions,
        successRate: Math.round(successRate * 100) / 100,
      };
    } catch (error) {
      logger.error('Get transaction stats error:', error);
      throw error;
    }
  }

  private async getCurrentExchangeRate(from: string, to: string): Promise<number> {
    try {
      // Try to get cached rate from database
      const cachedRate = await database.prisma.exchangeRate.findUnique({
        where: {
          fromCurrency_toCurrency: {
            fromCurrency: from,
            toCurrency: to,
          },
        },
      });

      // If cached rate is less than 15 minutes old, use it
      if (cachedRate && Date.now() - cachedRate.updatedAt.getTime() < 15 * 60 * 1000) {
        return cachedRate.rate;
      }

      // Otherwise, fetch new rate (mock implementation)
      const newRate = this.fetchExchangeRateFromAPI(from, to);

      // Update cache
      await database.prisma.exchangeRate.upsert({
        where: {
          fromCurrency_toCurrency: {
            fromCurrency: from,
            toCurrency: to,
          },
        },
        update: {
          rate: newRate,
          updatedAt: new Date(),
        },
        create: {
          fromCurrency: from,
          toCurrency: to,
          rate: newRate,
        },
      });

      return newRate;
    } catch (error) {
      logger.error('Get exchange rate error:', error);
      // Fallback to default rate
      return 83.25;
    }
  }

  private fetchExchangeRateFromAPI(from: string, to: string): number {
    // Mock implementation - in production, this would call a real FX API
    if (from === 'USD' && to === 'INR') {
      // Simulate slight fluctuation around 83.25
      return 83.25 + (Math.random() - 0.5) * 0.5;
    }
    return 1;
  }

  private assessRiskLevel(amount: number, exchangeRate: number): RiskLevel {
    const usdEquivalent = amount;
    
    if (usdEquivalent >= 50000) return 'CRITICAL';
    if (usdEquivalent >= 10000) return 'HIGH';
    if (usdEquivalent >= 5000) return 'NORMAL';
    return 'LOW';
  }

  private generateRiskFlags(amount: number, exchangeRate: number): string[] {
    const flags: string[] = [];
    const usdEquivalent = amount;

    if (usdEquivalent >= 10000) {
      flags.push('HIGH_AMOUNT');
    }
    if (usdEquivalent >= 50000) {
      flags.push('CRITICAL_AMOUNT');
    }

    return flags;
  }

  private generateTransactionReference(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TXN${timestamp.slice(-6)}${random}`;
  }
}