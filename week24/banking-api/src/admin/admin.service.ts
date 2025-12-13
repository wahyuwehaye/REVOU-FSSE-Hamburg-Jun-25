import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        customer: true,
        accounts: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
            balance: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllTransactions(limit = 100) {
    return this.prisma.transaction.findMany({
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            user: {
              select: {
                customer: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
        toAccount: {
          select: {
            accountNumber: true,
            user: {
              select: {
                customer: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getAuditLogs(limit = 100) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit || 50,
    });
  }

  async getStatistics() {
    const [
      totalUsers,
      totalCustomers,
      totalAccounts,
      totalTransactions,
      totalActiveLoans,
      totalCards,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.customer.count(),
      this.prisma.account.count(),
      this.prisma.transaction.count(),
      this.prisma.loan.count({
        where: {
          status: { in: ['ACTIVE', 'APPROVED'] },
        },
      }),
      this.prisma.card.count({ where: { isActive: true } }),
    ]);

    const totalBalance = await this.prisma.account.aggregate({
      _sum: { balance: true },
    });

    const transactionVolume = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    });

    return {
      users: {
        total: totalUsers,
        customers: totalCustomers,
      },
      accounts: {
        total: totalAccounts,
        totalBalance: totalBalance._sum.balance || 0,
      },
      transactions: {
        total: totalTransactions,
        last30Days: transactionVolume._sum.amount || 0,
      },
      loans: {
        active: totalActiveLoans,
      },
      cards: {
        active: totalCards,
      },
    };
  }

  async updateUserStatus(userId: number, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }

  async updateUserRole(userId: number, role: Role) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}
