import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@payflow.com' },
    update: {},
    create: {
      email: 'admin@payflow.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      accountNumber: 'PF000001',
      kycStatus: 'APPROVED',
    },
  });

  // Create test user
  const userPassword = await hashPassword('user123');
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'John Doe',
      password: userPassword,
      role: 'USER',
      accountNumber: 'PF000002',
      kycStatus: 'APPROVED',
      phoneNumber: '+1-555-0123',
      address: '123 Main St, New York, NY 10001',
    },
  });

  // Create beneficiaries for test user
  const beneficiary1 = await prisma.beneficiary.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      bankName: 'State Bank of India (SBI)',
      accountNumber: '12345678901234567890',
      ifscCode: 'SBIN0001234',
      country: 'IN',
      currency: 'INR',
      mobileNumber: '+91-9876543210',
      address: 'Mumbai, Maharashtra',
      userId: user.id,
    },
  });

  const beneficiary2 = await prisma.beneficiary.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      bankName: 'HDFC Bank',
      accountNumber: '98765432109876543210',
      ifscCode: 'HDFC0001234',
      country: 'IN',
      currency: 'INR',
      mobileNumber: '+91-9123456789',
      address: 'Delhi, India',
      userId: user.id,
    },
  });

  // Create sample transactions
  await prisma.transaction.createMany({
    data: [
      {
        reference: 'TXN001001',
        amount: 1000,
        currency: 'INR',
        exchangeRate: 83.25,
        fee: 5,
        status: 'COMPLETED',
        purpose: 'Family Support',
        riskLevel: 'NORMAL',
        userId: user.id,
        beneficiaryId: beneficiary1.id,
      },
      {
        reference: 'TXN001002',
        amount: 500,
        currency: 'INR',
        exchangeRate: 83.18,
        fee: 5,
        status: 'PROCESSING',
        purpose: 'Education Expenses',
        riskLevel: 'NORMAL',
        userId: user.id,
        beneficiaryId: beneficiary2.id,
      },
      {
        reference: 'TXN001003',
        amount: 15000,
        currency: 'INR',
        exchangeRate: 83.30,
        fee: 75,
        status: 'COMPLETED',
        purpose: 'Medical Treatment',
        riskLevel: 'HIGH',
        riskFlags: ['HIGH_AMOUNT'],
        userId: user.id,
        beneficiaryId: beneficiary1.id,
      },
    ],
  });

  // Create exchange rates
  await prisma.exchangeRate.upsert({
    where: {
      fromCurrency_toCurrency: {
        fromCurrency: 'USD',
        toCurrency: 'INR',
      },
    },
    update: {
      rate: 83.25,
    },
    create: {
      fromCurrency: 'USD',
      toCurrency: 'INR',
      rate: 83.25,
      source: 'SEED',
    },
  });

  // Create audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'USER_CREATED',
        resource: 'USER',
        details: { targetUserId: user.id },
      },
      {
        userId: user.id,
        action: 'BENEFICIARY_CREATED',
        resource: 'BENEFICIARY',
        details: { beneficiaryId: beneficiary1.id },
      },
      {
        userId: user.id,
        action: 'TRANSACTION_CREATED',
        resource: 'TRANSACTION',
        details: { amount: 1000, currency: 'INR' },
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user: admin@payflow.com / admin123');
  console.log('👤 Test user: user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });