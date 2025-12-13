import { PrismaClient, Role, AccountType, TransactionType, TransactionStatus, CardType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.loanPayment.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.beneficiary.deleteMany();
  await prisma.card.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users with different roles
  console.log('👤 Creating users...');
  
  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@bank.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // 2. Manager
  const manager = await prisma.user.create({
    data: {
      email: 'manager@bank.com',
      password: hashedPassword,
      role: Role.MANAGER,
    },
  });

  // 3. Teller
  const teller = await prisma.user.create({
    data: {
      email: 'teller@bank.com',
      password: hashedPassword,
      role: Role.TELLER,
    },
  });

  // 4-6. Customers
  const customer1 = await prisma.user.create({
    data: {
      email: 'john@email.com',
      password: hashedPassword,
      role: Role.CUSTOMER,
      customer: {
        create: {
          fullName: 'John Doe',
          phoneNumber: '08123456789',
          identityNumber: '3201234567890001',
          dateOfBirth: new Date('1990-05-15'),
          address: 'Jl. Sudirman No. 123',
          city: 'Jakarta',
          postalCode: '12190',
          occupation: 'Software Engineer',
          monthlyIncome: 15000000,
        },
      },
    },
    include: { customer: true },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'jane@email.com',
      password: hashedPassword,
      role: Role.CUSTOMER,
      customer: {
        create: {
          fullName: 'Jane Smith',
          phoneNumber: '08198765432',
          identityNumber: '3201234567890002',
          dateOfBirth: new Date('1992-08-20'),
          address: 'Jl. Gatot Subroto No. 456',
          city: 'Jakarta',
          postalCode: '12930',
          occupation: 'Marketing Manager',
          monthlyIncome: 12000000,
        },
      },
    },
    include: { customer: true },
  });

  const customer3 = await prisma.user.create({
    data: {
      email: 'bob@email.com',
      password: hashedPassword,
      role: Role.CUSTOMER,
      customer: {
        create: {
          fullName: 'Bob Wilson',
          phoneNumber: '08187654321',
          identityNumber: '3201234567890003',
          dateOfBirth: new Date('1988-03-10'),
          address: 'Jl. Thamrin No. 789',
          city: 'Jakarta',
          postalCode: '10350',
          occupation: 'Business Owner',
          monthlyIncome: 25000000,
        },
      },
    },
    include: { customer: true },
  });

  console.log('✅ Created users with customers');

  // Create Accounts
  console.log('🏦 Creating accounts...');

  // John's accounts
  const johnSavings = await prisma.account.create({
    data: {
      accountNumber: '1001234567',
      userId: customer1.id,
      accountType: AccountType.SAVINGS,
      balance: 5000000,
      interestRate: 2.5,
    },
  });

  const johnChecking = await prisma.account.create({
    data: {
      accountNumber: '2001234567',
      userId: customer1.id,
      accountType: AccountType.CHECKING,
      balance: 10000000,
      overdraftLimit: 5000000,
    },
  });

  // Jane's accounts
  const janeSavings = await prisma.account.create({
    data: {
      accountNumber: '1001234568',
      userId: customer2.id,
      accountType: AccountType.SAVINGS,
      balance: 8000000,
      interestRate: 2.5,
    },
  });

  const janeDeposit = await prisma.account.create({
    data: {
      accountNumber: '3001234568',
      userId: customer2.id,
      accountType: AccountType.DEPOSIT,
      balance: 50000000,
      interestRate: 5.0,
    },
  });

  // Bob's accounts
  const bobSavings = await prisma.account.create({
    data: {
      accountNumber: '1001234569',
      userId: customer3.id,
      accountType: AccountType.SAVINGS,
      balance: 15000000,
      interestRate: 2.5,
    },
  });

  const bobChecking = await prisma.account.create({
    data: {
      accountNumber: '2001234569',
      userId: customer3.id,
      accountType: AccountType.CHECKING,
      balance: 20000000,
      overdraftLimit: 10000000,
    },
  });

  console.log('✅ Created accounts');

  // Create Cards
  console.log('💳 Creating cards...');

  await prisma.card.createMany({
    data: [
      {
        accountId: johnSavings.id,
        cardNumber: '4111111111111111',
        cardType: CardType.DEBIT,
        cvv: await bcrypt.hash('123', 10),
        pin: await bcrypt.hash('123456', 10),
        expiryDate: new Date('2027-12-31'),
        dailyLimit: 5000000,
      },
      {
        accountId: janeSavings.id,
        cardNumber: '4222222222222222',
        cardType: CardType.DEBIT,
        cvv: await bcrypt.hash('456', 10),
        pin: await bcrypt.hash('654321', 10),
        expiryDate: new Date('2028-06-30'),
        dailyLimit: 5000000,
      },
      {
        accountId: bobChecking.id,
        cardNumber: '5333333333333333',
        cardType: CardType.CREDIT,
        cvv: await bcrypt.hash('789', 10),
        pin: await bcrypt.hash('111111', 10),
        expiryDate: new Date('2029-12-31'),
        dailyLimit: 10000000,
      },
    ],
  });

  console.log('✅ Created cards');

  // Create Transactions
  console.log('💸 Creating transactions...');

  await prisma.transaction.createMany({
    data: [
      // Deposits
      {
        transactionNumber: 'TRX-DEP-001',
        toAccountId: johnSavings.id,
        type: TransactionType.DEPOSIT,
        amount: 1000000,
        status: TransactionStatus.COMPLETED,
        description: 'Cash deposit at ATM',
        processedBy: teller.id,
        processedAt: new Date('2025-12-01'),
      },
      {
        transactionNumber: 'TRX-DEP-002',
        toAccountId: janeSavings.id,
        type: TransactionType.DEPOSIT,
        amount: 2000000,
        status: TransactionStatus.COMPLETED,
        description: 'Cash deposit at branch',
        processedBy: teller.id,
        processedAt: new Date('2025-12-02'),
      },
      // Transfers
      {
        transactionNumber: 'TRX-TRF-001',
        fromAccountId: johnChecking.id,
        toAccountId: janeSavings.id,
        type: TransactionType.TRANSFER,
        amount: 500000,
        fee: 2500,
        status: TransactionStatus.COMPLETED,
        description: 'Transfer to Jane',
        processedAt: new Date('2025-12-03'),
      },
      {
        transactionNumber: 'TRX-TRF-002',
        fromAccountId: bobChecking.id,
        toAccountId: johnSavings.id,
        type: TransactionType.TRANSFER,
        amount: 1000000,
        fee: 2500,
        status: TransactionStatus.COMPLETED,
        description: 'Payment for services',
        processedAt: new Date('2025-12-04'),
      },
      // Withdrawals
      {
        transactionNumber: 'TRX-WDR-001',
        fromAccountId: janeSavings.id,
        type: TransactionType.WITHDRAWAL,
        amount: 500000,
        status: TransactionStatus.COMPLETED,
        description: 'ATM withdrawal',
        processedAt: new Date('2025-12-05'),
      },
      // Payments
      {
        transactionNumber: 'TRX-PAY-001',
        fromAccountId: bobChecking.id,
        type: TransactionType.PAYMENT,
        amount: 1500000,
        fee: 1000,
        status: TransactionStatus.COMPLETED,
        description: 'Electricity bill payment',
        processedAt: new Date('2025-12-06'),
      },
    ],
  });

  console.log('✅ Created transactions');

  // Create Beneficiaries
  console.log('📋 Creating beneficiaries...');

  await prisma.beneficiary.createMany({
    data: [
      {
        userId: customer1.id,
        fromAccountId: johnChecking.id,
        beneficiaryName: 'Jane Smith',
        beneficiaryBank: 'Same Bank',
        beneficiaryAccount: janeSavings.accountNumber,
        nickname: 'Jane',
      },
      {
        userId: customer1.id,
        fromAccountId: johnChecking.id,
        beneficiaryName: 'Bob Wilson',
        beneficiaryBank: 'Same Bank',
        beneficiaryAccount: bobSavings.accountNumber,
        nickname: 'Bob',
      },
      {
        userId: customer2.id,
        fromAccountId: janeSavings.id,
        beneficiaryName: 'John Doe',
        beneficiaryBank: 'Same Bank',
        beneficiaryAccount: johnSavings.accountNumber,
        nickname: 'John',
      },
    ],
  });

  console.log('✅ Created beneficiaries');

  // Create Loans
  console.log('💰 Creating loans...');

  await prisma.loan.create({
    data: {
      loanNumber: 'LOAN-001',
      customerId: customer1.customer!.id,
      loanType: 'Personal Loan',
      principal: 10000000,
      interestRate: 12.0,
      termMonths: 12,
      monthlyPayment: 888488,
      remainingBalance: 10000000,
      status: 'APPROVED',
      approvedBy: manager.id,
      approvedAt: new Date('2025-11-01'),
      startDate: new Date('2025-11-01'),
      endDate: new Date('2026-11-01'),
      payments: {
        createMany: {
          data: Array.from({ length: 12 }, (_, i) => ({
            paymentNumber: i + 1,
            amount: 888488,
            principal: 833333,
            interest: 100000,
            remainingBalance: 10000000 - (833333 * (i + 1)),
            dueDate: new Date(new Date('2025-12-01').setMonth(new Date('2025-12-01').getMonth() + i)),
            isPaid: i === 0, // First payment is paid
            paidDate: i === 0 ? new Date('2025-12-01') : null,
          })),
        },
      },
    },
  });

  await prisma.loan.create({
    data: {
      loanNumber: 'LOAN-002',
      customerId: customer3.customer!.id,
      loanType: 'Car Loan',
      principal: 200000000,
      interestRate: 8.0,
      termMonths: 60,
      monthlyPayment: 4056689,
      remainingBalance: 200000000,
      status: 'ACTIVE',
      approvedBy: manager.id,
      approvedAt: new Date('2025-10-01'),
      startDate: new Date('2025-10-01'),
      endDate: new Date('2030-10-01'),
    },
  });

  console.log('✅ Created loans');

  // Create Notifications
  console.log('🔔 Creating notifications...');

  await prisma.notification.createMany({
    data: [
      {
        userId: customer1.id,
        title: 'Transfer Successful',
        message: 'Your transfer of Rp 500,000 to Jane Smith has been completed.',
        type: 'TRANSACTION',
      },
      {
        userId: customer1.id,
        title: 'Loan Payment Due',
        message: 'Your loan payment of Rp 888,488 is due on December 15, 2025.',
        type: 'LOAN',
      },
      {
        userId: customer2.id,
        title: 'Money Received',
        message: 'You have received Rp 500,000 from John Doe.',
        type: 'TRANSACTION',
        isRead: true,
      },
      {
        userId: customer3.id,
        title: 'Security Alert',
        message: 'A new device has logged into your account.',
        type: 'SECURITY',
      },
    ],
  });

  console.log('✅ Created notifications');

  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - Users: 6 (1 admin, 1 manager, 1 teller, 3 customers)');
  console.log('   - Customers: 3');
  console.log('   - Accounts: 6 (3 savings, 2 checking, 1 deposit)');
  console.log('   - Cards: 3 (2 debit, 1 credit)');
  console.log('   - Transactions: 6');
  console.log('   - Beneficiaries: 3');
  console.log('   - Loans: 2');
  console.log('   - Notifications: 4');
  console.log('');
  console.log('🔐 Test Credentials:');
  console.log('   Admin:    admin@bank.com / password123');
  console.log('   Manager:  manager@bank.com / password123');
  console.log('   Teller:   teller@bank.com / password123');
  console.log('   Customer: john@email.com / password123');
  console.log('   Customer: jane@email.com / password123');
  console.log('   Customer: bob@email.com / password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
