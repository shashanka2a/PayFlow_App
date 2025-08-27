import { User } from '@prisma/client';
import { hashPassword, comparePassword, generateToken, generateAccountNumber } from '@/utils/auth';
import { CreateUserData, LoginData, JWTPayload } from '@/types';
import { ConflictError, AuthenticationError, NotFoundError } from '@/utils/errors';
import database from '@/utils/database';
import logger from '@/utils/logger';

export class AuthService {
  async register(userData: CreateUserData): Promise<{ user: Omit<User, 'password'>; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await database.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Generate account number
      const accountNumber = generateAccountNumber();

      // Create user
      const user = await database.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          accountNumber,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          accountNumber: true,
          kycStatus: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Generate JWT token
      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const token = generateToken(tokenPayload);

      logger.info(`User registered successfully: ${user.email}`);

      return { user, token };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(loginData: LoginData): Promise<{ user: Omit<User, 'password'>; token: string }> {
    try {
      // Find user by email
      const user = await database.prisma.user.findUnique({
        where: { email: loginData.email },
      });

      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await comparePassword(loginData.password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Generate JWT token
      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const token = generateToken(tokenPayload);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      logger.info(`User logged in successfully: ${user.email}`);

      return { user: userWithoutPassword, token };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await database.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          accountNumber: true,
          kycStatus: true,
          phoneNumber: true,
          address: true,
          dateOfBirth: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    updateData: Partial<Pick<User, 'name' | 'phoneNumber' | 'address' | 'dateOfBirth'>>
  ): Promise<Omit<User, 'password'>> {
    try {
      const user = await database.prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          accountNumber: true,
          kycStatus: true,
          phoneNumber: true,
          address: true,
          dateOfBirth: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      logger.info(`User profile updated: ${user.email}`);

      return user;
    } catch (error) {
      logger.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Get user with password
      const user = await database.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new AuthenticationError('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await database.prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      logger.info(`Password changed for user: ${user.email}`);
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }
}