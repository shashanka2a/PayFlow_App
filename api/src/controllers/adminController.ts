import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '@/services/transactionService';
import { KYCService } from '@/services/kycService';
import { AuthenticatedRequest, ApiResponse, AdminStats } from '@/types';
import database from '@/utils/database';

const transactionService = new TransactionService();
const kycService = new KYCService();

export class AdminController {
  async getDashboardStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        userStats,
        transactionStats,
        kycStats,
      ] = await Promise.all([
        this.getUserStats(),
        transactionService.getTransactionStats(),
        this.getKYCStats(),
      ]);

      const stats: AdminStats = {
        totalUsers: userStats.totalUsers,
        totalTransactions: transactionStats.totalTransactions,
        totalVolume: transactionStats.totalVolume,
        successRate: transactionStats.successRate,
        pendingReviews: kycStats.pendingReviews,
        highRiskTransactions: transactionStats.highRiskTransactions,
      };

      const response: ApiResponse = {
        success: true,
        data: { stats },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;

      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        database.prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            kycStatus: true,
            accountNumber: true,
            createdAt: true,
            _count: {
              select: {
                transactions: true,
                beneficiaries: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        database.prisma.user.count({ where }),
      ]);

      const response: ApiResponse = {
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as string;
      const riskLevel = req.query.riskLevel as string;

      const where: any = {};
      if (status) where.status = status;
      if (riskLevel) where.riskLevel = riskLevel;

      const [transactions, total] = await Promise.all([
        database.prisma.transaction.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            beneficiary: {
              select: {
                id: true,
                name: true,
                bankName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        database.prisma.transaction.count({ where }),
      ]);

      const response: ApiResponse = {
        success: true,
        data: {
          transactions,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getPendingKYCReviews(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pendingReviews = await kycService.getPendingKYCReviews();

      const response: ApiResponse = {
        success: true,
        data: { pendingReviews },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateKYCStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      await database.prisma.user.update({
        where: { id: userId },
        data: { kycStatus: status },
      });

      // Create audit log
      await database.prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'KYC_STATUS_UPDATED',
          resource: 'USER',
          details: { targetUserId: userId, status },
        },
      });

      const response: ApiResponse = {
        success: true,
        message: 'KYC status updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const action = req.query.action as string;
      const userId = req.query.userId as string;

      const where: any = {};
      if (action) where.action = action;
      if (userId) where.userId = userId;

      const [logs, total] = await Promise.all([
        database.prisma.auditLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        database.prisma.auditLog.count({ where }),
      ]);

      const response: ApiResponse = {
        success: true,
        data: {
          logs,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async getUserStats(): Promise<{ totalUsers: number; activeUsers: number; newUsersThisMonth: number }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, activeUsers, newUsersThisMonth] = await Promise.all([
      database.prisma.user.count(),
      database.prisma.user.count({
        where: {
          transactions: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
        },
      }),
      database.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
    ]);

    return { totalUsers, activeUsers, newUsersThisMonth };
  }

  private async getKYCStats(): Promise<{ pendingReviews: number; approvedKYC: number; rejectedKYC: number }> {
    const [pendingReviews, approvedKYC, rejectedKYC] = await Promise.all([
      database.prisma.user.count({
        where: { kycStatus: { in: ['PENDING', 'UNDER_REVIEW'] } },
      }),
      database.prisma.user.count({
        where: { kycStatus: 'APPROVED' },
      }),
      database.prisma.user.count({
        where: { kycStatus: 'REJECTED' },
      }),
    ]);

    return { pendingReviews, approvedKYC, rejectedKYC };
  }
}