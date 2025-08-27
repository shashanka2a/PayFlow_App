import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/auth';
import { AuthenticationError, AuthorizationError } from '@/utils/errors';
import { AuthenticatedRequest } from '@/types';
import database from '@/utils/database';
import logger from '@/utils/logger';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const payload = verifyToken(token);
    
    // Fetch user from database
    const user = await database.prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      next(new AuthenticationError('Invalid token'));
    }
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError('Insufficient permissions'));
    }

    next();
  };
};

export const requireKYC = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(new AuthenticationError('User not authenticated'));
  }

  if (req.user.kycStatus !== 'APPROVED') {
    return next(new AuthorizationError('KYC verification required'));
  }

  next();
};

const extractToken = (req: Request): string | null => {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
};