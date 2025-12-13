import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';
import { AccountStatus, AccountType, Role } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAccountDto, creatorId: number, creatorRole: Role) {
    // Only TELLER, MANAGER, and ADMIN can create accounts
    const allowedRoles: Role[] = [Role.TELLER, Role.MANAGER, Role.ADMIN];
    if (!allowedRoles.includes(creatorRole)) {
      throw new ForbiddenException('Only bank staff can create accounts');
    }

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate unique account number
    const accountNumber = await this.generateAccountNumber(dto.accountType);

    const account = await this.prisma.$transaction(async (tx) => {
      const newAccount = await tx.account.create({
        data: {
          accountNumber,
          userId: dto.userId,
          accountType: dto.accountType,
          balance: dto.initialBalance || 0,
          currency: dto.currency || 'IDR',
          status: AccountStatus.ACTIVE,
          overdraftLimit: dto.overdraftLimit || 0,
          interestRate: dto.interestRate || 0,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              customer: true,
            },
          },
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: dto.userId,
          title: 'New Account Created',
          message: `Your ${dto.accountType} account (${accountNumber}) has been created successfully.`,
          type: 'INFO',
        },
      });
      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: creatorId,
          action: 'CREATE_ACCOUNT',
          entity: 'Account',
          entityId: newAccount.id,
          changes: JSON.stringify({ accountNumber, accountType: dto.accountType }),
        },
      });

      return newAccount;
    });

    return account;
  }

  async findAll(userId: number, userRole: Role) {
    // CUSTOMER can only see their own accounts
    if (userRole === Role.CUSTOMER) {
      return this.prisma.account.findMany({
        where: { userId },
        include: {
          _count: {
            select: {
              transactionsFrom: true,
              transactionsTo: true,
            },
          },
        },
      });
    }

    // Staff can see all accounts
    return this.prisma.account.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            customer: true,
          },
        },
        _count: {
          select: {
            transactionsFrom: true,
            transactionsTo: true,
          },
        },
      },
    });
  }

  async findOne(id: number, userId: number, userRole: Role) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            customer: true,
          },
        },
        cards: true,
        _count: {
          select: {
            transactionsFrom: true,
            transactionsTo: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // CUSTOMER can only view their own accounts
    if (userRole === Role.CUSTOMER && account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return account;
  }

  async getBalance(accountNumber: string, userId: number, userRole: Role) {
    const account = await this.prisma.account.findUnique({
      where: { accountNumber },
      select: {
        id: true,
        accountNumber: true,
        accountType: true,
        balance: true,
        currency: true,
        status: true,
        userId: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // CUSTOMER can only check their own balance
    if (userRole === Role.CUSTOMER && account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return account;
  }

  async update(id: number, dto: UpdateAccountDto, updaterId: number, updaterRole: Role) {
    // Only MANAGER and ADMIN can update accounts
    const allowedRoles: Role[] = [Role.MANAGER, Role.ADMIN];
    if (!allowedRoles.includes(updaterRole)) {
      throw new ForbiddenException('Only managers can update accounts');
    }

    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.account.update({
        where: { id },
        data: dto,
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: updaterId,
          action: 'UPDATE_ACCOUNT',
          entity: 'Account',
          entityId: id,
          changes: JSON.stringify(dto),
        },
      });

      return updated;
    });
  }

  async remove(id: number, deleterId: number, deleterRole: Role) {
    // Only MANAGER and ADMIN can delete accounts
    const allowedRoles: Role[] = [Role.MANAGER, Role.ADMIN];
    if (!allowedRoles.includes(deleterRole)) {
      throw new ForbiddenException('Only managers can close accounts');
    }

    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance.toNumber() > 0) {
      throw new BadRequestException('Cannot close account with non-zero balance');
    }

    return this.prisma.$transaction(async (tx) => {
      // Soft delete by setting status to CLOSED
      const closed = await tx.account.update({
        where: { id },
        data: { status: AccountStatus.CLOSED },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: deleterId,
          action: 'CLOSE_ACCOUNT',
          entity: 'Account',
          entityId: id,
          changes: JSON.stringify({ status: 'CLOSED' }),
        },
      });

      return closed;
    });
  }

  private async generateAccountNumber(accountType: AccountType): Promise<string> {
    const prefix = accountType === 'SAVINGS' ? '1' : accountType === 'CHECKING' ? '2' : '3';
    const randomNum = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const accountNumber = prefix + randomNum;

    // Check if exists
    const existing = await this.prisma.account.findUnique({
      where: { accountNumber },
    });

    if (existing) {
      return this.generateAccountNumber(accountType);
    }

    return accountNumber;
  }
}
