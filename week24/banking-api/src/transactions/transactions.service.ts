import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDto, WithdrawDto, TransferDto, PaymentDto } from './dto/transaction.dto';
import { TransactionType, TransactionStatus, AccountStatus, Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionsService {
  private readonly TRANSFER_FEE = 2500;
  private readonly PAYMENT_FEE = 1000;
  private readonly DAILY_TRANSFER_LIMIT = parseFloat(process.env.DAILY_TRANSFER_LIMIT || '50000000');
  private readonly SINGLE_TRANSFER_LIMIT = parseFloat(process.env.SINGLE_TRANSFER_LIMIT || '10000000');

  constructor(private prisma: PrismaService) {}

  async deposit(dto: DepositDto, tellerId: number, tellerRole: Role) {
    // Only TELLER, MANAGER, and ADMIN can process deposits
    const allowedRoles: Role[] = [Role.TELLER, Role.MANAGER, Role.ADMIN];
    if (!allowedRoles.includes(tellerRole)) {
      throw new ForbiddenException('Only bank staff can process deposits');
    }

    const account = await this.prisma.account.findUnique({
      where: { accountNumber: dto.accountNumber },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.status !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Account is not active');
    }

    const transactionNumber = await this.generateTransactionNumber('DEP');

    return this.prisma.$transaction(async (tx) => {
      const balanceBefore = account.balance;
      const balanceAfter = new Decimal(account.balance).plus(dto.amount);

      // Update account balance
      await tx.account.update({
        where: { id: account.id },
        data: { balance: balanceAfter },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          transactionNumber,
          toAccountId: account.id,
          type: TransactionType.DEPOSIT,
          amount: dto.amount,
          fee: 0,
          description: dto.description || 'Cash Deposit',
          status: TransactionStatus.COMPLETED,
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          processedBy: tellerId,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: account.userId,
          title: 'Deposit Successful',
          message: `Rp ${dto.amount.toLocaleString('id-ID')} has been deposited to your account ${dto.accountNumber}`,
          type: 'SUCCESS',
        },
      });

      return transaction;
    });
  }

  async withdraw(dto: WithdrawDto, userId: number, userRole: Role) {
    const account = await this.prisma.account.findUnique({
      where: { accountNumber: dto.accountNumber },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // CUSTOMER can only withdraw from their own accounts
    if (userRole === Role.CUSTOMER && account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (account.status !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Account is not active');
    }

    const availableBalance = new Decimal(account.balance).plus(account.overdraftLimit || 0);
    if (availableBalance.lessThan(dto.amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    const transactionNumber = await this.generateTransactionNumber('WDR');

    return this.prisma.$transaction(async (tx) => {
      const balanceBefore = account.balance;
      const balanceAfter = new Decimal(account.balance).minus(dto.amount);

      // Update account balance
      await tx.account.update({
        where: { id: account.id },
        data: { balance: balanceAfter },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          transactionNumber,
          fromAccountId: account.id,
          type: TransactionType.WITHDRAWAL,
          amount: dto.amount,
          fee: 0,
          description: dto.description || 'ATM Withdrawal',
          status: TransactionStatus.COMPLETED,
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          processedBy: userId,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: account.userId,
          title: 'Withdrawal Successful',
          message: `Rp ${dto.amount.toLocaleString('id-ID')} has been withdrawn from your account ${dto.accountNumber}`,
          type: 'INFO',
        },
      });

      return transaction;
    });
  }

  async transfer(dto: TransferDto, userId: number, userRole: Role) {
    if (dto.fromAccountNumber === dto.toAccountNumber) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    // Check transfer limits
    if (dto.amount > this.SINGLE_TRANSFER_LIMIT) {
      throw new BadRequestException(`Transfer amount exceeds single transfer limit of Rp ${this.SINGLE_TRANSFER_LIMIT.toLocaleString('id-ID')}`);
    }

    const [fromAccount, toAccount] = await Promise.all([
      this.prisma.account.findUnique({ where: { accountNumber: dto.fromAccountNumber } }),
      this.prisma.account.findUnique({ where: { accountNumber: dto.toAccountNumber } }),
    ]);

    if (!fromAccount) {
      throw new NotFoundException('Source account not found');
    }

    if (!toAccount) {
      throw new NotFoundException('Destination account not found');
    }

    // CUSTOMER can only transfer from their own accounts
    if (userRole === Role.CUSTOMER && fromAccount.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (fromAccount.status !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Source account is not active');
    }

    if (toAccount.status !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Destination account is not active');
    }

    // Check daily limit for customers
    if (userRole === Role.CUSTOMER) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dailyTotal = await this.prisma.transaction.aggregate({
        where: {
          fromAccountId: fromAccount.id,
          type: TransactionType.TRANSFER,
          status: TransactionStatus.COMPLETED,
          createdAt: { gte: today },
        },
        _sum: { amount: true },
      });

      const totalTransferred = dailyTotal._sum.amount || 0;
      if (new Decimal(totalTransferred).plus(dto.amount).greaterThan(this.DAILY_TRANSFER_LIMIT)) {
        throw new BadRequestException(`Daily transfer limit of Rp ${this.DAILY_TRANSFER_LIMIT.toLocaleString('id-ID')} exceeded`);
      }
    }

    const totalAmount = new Decimal(dto.amount).plus(this.TRANSFER_FEE);
    const availableBalance = new Decimal(fromAccount.balance).plus(fromAccount.overdraftLimit || 0);

    if (availableBalance.lessThan(totalAmount.toNumber())) {
      throw new BadRequestException('Insufficient balance (including transfer fee)');
    }

    const transactionNumber = await this.generateTransactionNumber('TRF');

    return this.prisma.$transaction(async (tx) => {
      // Update from account
      const fromBalanceBefore = fromAccount.balance;
      const fromBalanceAfter = new Decimal(fromAccount.balance).minus(totalAmount.toNumber());

      await tx.account.update({
        where: { id: fromAccount.id },
        data: { balance: fromBalanceAfter },
      });

      // Update to account
      const toBalanceAfter = new Decimal(toAccount.balance).plus(dto.amount);

      await tx.account.update({
        where: { id: toAccount.id },
        data: { balance: toBalanceAfter },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          transactionNumber,
          fromAccountId: fromAccount.id,
          toAccountId: toAccount.id,
          type: TransactionType.TRANSFER,
          amount: dto.amount,
          fee: this.TRANSFER_FEE,
          description: dto.description || 'Transfer',
          status: TransactionStatus.COMPLETED,
          balanceBefore: fromBalanceBefore,
          balanceAfter: fromBalanceAfter,
          processedBy: userId,
        },
        include: {
          fromAccount: {
            select: {
              accountNumber: true,
              user: { select: { customer: { select: { fullName: true } } } },
            },
          },
          toAccount: {
            select: {
              accountNumber: true,
              user: { select: { customer: { select: { fullName: true } } } },
            },
          },
        },
      });

      // Create notifications
      await Promise.all([
        tx.notification.create({
          data: {
            userId: fromAccount.userId,
            title: 'Transfer Successful',
            message: `Rp ${dto.amount.toLocaleString('id-ID')} transferred to ${dto.toAccountNumber}. Fee: Rp ${this.TRANSFER_FEE.toLocaleString('id-ID')}`,
            type: 'SUCCESS',
          },
        }),
        tx.notification.create({
          data: {
            userId: toAccount.userId,
            title: 'Money Received',
            message: `Rp ${dto.amount.toLocaleString('id-ID')} received from ${dto.fromAccountNumber}`,
            type: 'SUCCESS',
          },
        }),
      ]);

      return transaction;
    });
  }

  async payment(dto: PaymentDto, userId: number, userRole: Role) {
    const account = await this.prisma.account.findUnique({
      where: { accountNumber: dto.accountNumber },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // CUSTOMER can only make payments from their own accounts
    if (userRole === Role.CUSTOMER && account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (account.status !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Account is not active');
    }

    const totalAmount = new Decimal(dto.amount).plus(this.PAYMENT_FEE);
    const availableBalance = new Decimal(account.balance).plus(account.overdraftLimit || 0);

    if (availableBalance.lessThan(totalAmount.toNumber())) {
      throw new BadRequestException('Insufficient balance (including payment fee)');
    }

    const transactionNumber = await this.generateTransactionNumber('PAY');

    return this.prisma.$transaction(async (tx) => {
      const balanceBefore = account.balance;
      const balanceAfter = new Decimal(account.balance).minus(totalAmount.toNumber());

      // Update account balance
      await tx.account.update({
        where: { id: account.id },
        data: { balance: balanceAfter },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          transactionNumber,
          fromAccountId: account.id,
          type: TransactionType.PAYMENT,
          amount: dto.amount,
          fee: this.PAYMENT_FEE,
          description: dto.description || `${dto.paymentType} Payment`,
          status: TransactionStatus.COMPLETED,
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          processedBy: userId,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: account.userId,
          title: 'Payment Successful',
          message: `${dto.paymentType} payment of Rp ${dto.amount.toLocaleString('id-ID')} completed. Fee: Rp ${this.PAYMENT_FEE.toLocaleString('id-ID')}`,
          type: 'SUCCESS',
        },
      });

      return transaction;
    });
  }

  async findAll(userId: number, userRole: Role, accountNumber?: string) {
    const where: any = {};

    if (accountNumber) {
      const account = await this.prisma.account.findUnique({
        where: { accountNumber },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      // CUSTOMER can only view transactions from their own accounts
      if (userRole === Role.CUSTOMER && account.userId !== userId) {
        throw new ForbiddenException('Access denied');
      }

      where.OR = [
        { fromAccountId: account.id },
        { toAccountId: account.id },
      ];
    } else if (userRole === Role.CUSTOMER) {
      // Get all customer accounts
      const accounts = await this.prisma.account.findMany({
        where: { userId },
        select: { id: true },
      });

      const accountIds = accounts.map(a => a.id);

      where.OR = [
        { fromAccountId: { in: accountIds } },
        { toAccountId: { in: accountIds } },
      ];
    }

    return this.prisma.transaction.findMany({
      where,
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountType: true,
          },
        },
        toAccount: {
          select: {
            accountNumber: true,
            accountType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findOne(id: number, userId: number, userRole: Role) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        fromAccount: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                customer: true,
              },
            },
          },
        },
        toAccount: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                customer: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // CUSTOMER can only view their own transactions
    if (userRole === Role.CUSTOMER) {
      const isOwner = 
        (transaction.fromAccount && transaction.fromAccount.userId === userId) ||
        (transaction.toAccount && transaction.toAccount.userId === userId);

      if (!isOwner) {
        throw new ForbiddenException('Access denied');
      }
    }

    return transaction;
  }

  private async generateTransactionNumber(prefix: string): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const transactionNumber = `TRX-${prefix}-${date}-${randomNum}`;

    const existing = await this.prisma.transaction.findUnique({
      where: { transactionNumber },
    });

    if (existing) {
      return this.generateTransactionNumber(prefix);
    }

    return transactionNumber;
  }
}
