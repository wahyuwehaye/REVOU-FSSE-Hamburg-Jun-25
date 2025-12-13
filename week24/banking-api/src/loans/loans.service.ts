import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyLoanDto, ApproveLoanDto, MakePaymentDto } from './dto/loan.dto';
import { LoanStatus, Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async apply(dto: ApplyLoanDto, userId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new BadRequestException('Customer profile not found');
    }

    // Generate loan number
    const loanNumber = await this.generateLoanNumber();

    // Calculate monthly payment (simple interest)
    const totalInterest = (dto.principal * dto.interestRate * dto.termMonths) / (100 * 12);
    const totalAmount = dto.principal + totalInterest;
    const monthlyPayment = totalAmount / dto.termMonths;

    return this.prisma.$transaction(async (tx) => {
      const loan = await tx.loan.create({
        data: {
          loanNumber,
          customerId: customer.id,
          loanType: dto.loanType,
          principal: dto.principal,
          interestRate: dto.interestRate,
          termMonths: dto.termMonths,
          monthlyPayment,
          remainingBalance: totalAmount,
          status: LoanStatus.PENDING,
        },
        include: {
          customer: {
            include: {
              user: true,
            },
          },
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId,
          title: 'Loan Application Submitted',
          message: `Your ${dto.loanType} loan application (${loanNumber}) for Rp ${dto.principal.toLocaleString('id-ID')} is under review.`,
          type: 'INFO',
        },
      });

      return loan;
    });
  }

  async findAll(userId: number, userRole: Role) {
    if (userRole === Role.CUSTOMER) {
      const customer = await this.prisma.customer.findUnique({
        where: { userId },
      });

      if (!customer) {
        return [];
      }

      return this.prisma.loan.findMany({
        where: { customerId: customer.id },
        include: {
          customer: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          _count: {
            select: {
              payments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Staff can see all loans
    return this.prisma.loan.findMany({
      include: {
        customer: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            payments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, userRole: Role) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        payments: {
          orderBy: { paymentNumber: 'asc' },
        },
      },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    // CUSTOMER can only view their own loans
    if (userRole === Role.CUSTOMER && loan.customer.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return loan;
  }

  async approve(id: number, dto: ApproveLoanDto, approverId: number, approverRole: Role) {
    // Only MANAGER and ADMIN can approve loans
    const allowedRoles: Role[] = [Role.MANAGER, Role.ADMIN];
    if (!allowedRoles.includes(approverRole)) {
      throw new ForbiddenException('Only managers can approve loans');
    }

    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestException('Loan is not pending approval');
    }

    return this.prisma.$transaction(async (tx) => {
      const approvedAmount = dto.approvedAmount || loan.principal.toNumber();
      const approvedRate = dto.approvedInterestRate || loan.interestRate.toNumber();

      // Recalculate if amounts changed
      const totalInterest = (approvedAmount * approvedRate * loan.termMonths) / (100 * 12);
      const totalAmount = approvedAmount + totalInterest;
      const monthlyPayment = totalAmount / loan.termMonths;

      const updated = await tx.loan.update({
        where: { id },
        data: {
          principal: approvedAmount,
          interestRate: approvedRate,
          monthlyPayment,
          remainingBalance: totalAmount,
          status: dto.status,
          approvedBy: approverId,
          approvedAt: new Date(),
        },
      });

      // If approved, create payment schedule
      if (dto.status === LoanStatus.APPROVED || dto.status === LoanStatus.ACTIVE) {
        const payments = [];
        const startDate = new Date();
        
        for (let i = 1; i <= loan.termMonths; i++) {
          const dueDate = new Date(startDate);
          dueDate.setMonth(dueDate.getMonth() + i);

          payments.push({
            loanId: loan.id,
            paymentNumber: i,
            amount: monthlyPayment,
            principal: approvedAmount / loan.termMonths,
            interest: totalInterest / loan.termMonths,
            remainingBalance: totalAmount - (monthlyPayment * i),
            dueDate,
            isPaid: false,
          });
        }

        await tx.loanPayment.createMany({
          data: payments,
        });
      }

      // Create notification
      const statusMessage = dto.status === LoanStatus.APPROVED || dto.status === LoanStatus.ACTIVE
        ? `Your loan has been approved! Amount: Rp ${approvedAmount.toLocaleString('id-ID')}`
        : 'Your loan application has been declined.';

      await tx.notification.create({
        data: {
          userId: loan.customer.userId,
          title: dto.status === LoanStatus.APPROVED ? 'Loan Approved' : 'Loan Status Update',
          message: statusMessage,
          type: dto.status === LoanStatus.APPROVED ? 'SUCCESS' : 'WARNING',
        },
      });

      return updated;
    });
  }

  async makePayment(id: number, dto: MakePaymentDto, userId: number, userRole: Role) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        payments: {
          where: { isPaid: false },
          orderBy: { paymentNumber: 'asc' },
          take: 1,
        },
      },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    // CUSTOMER can only make payments for their own loans
    if (userRole === Role.CUSTOMER && loan.customer.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (loan.status !== LoanStatus.ACTIVE) {
      throw new BadRequestException('Loan is not active');
    }

    if (loan.payments.length === 0) {
      throw new BadRequestException('All payments completed or no payment schedule found');
    }

    const nextPayment = loan.payments[0];

    if (dto.amount < nextPayment.amount.toNumber()) {
      throw new BadRequestException(`Minimum payment amount is Rp ${nextPayment.amount.toNumber().toLocaleString()}`);
    }

    return this.prisma.$transaction(async (tx) => {
      // Mark payment as paid
      await tx.loanPayment.update({
        where: { id: nextPayment.id },
        data: {
          isPaid: true,
          paidDate: new Date(),
        },
      });

      // Update loan remaining balance
      const newBalance = new Decimal(loan.remainingBalance).minus(dto.amount);
      const isFullyPaid = newBalance.lessThanOrEqualTo(0);

      await tx.loan.update({
        where: { id },
        data: {
          remainingBalance: isFullyPaid ? 0 : newBalance.toNumber(),
          status: isFullyPaid ? LoanStatus.PAID_OFF : LoanStatus.ACTIVE,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: loan.customer.userId,
          title: isFullyPaid ? 'Loan Paid Off!' : 'Loan Payment Received',
          message: isFullyPaid
            ? `Congratulations! Your loan ${loan.loanNumber} has been fully paid off.`
            : `Payment of Rp ${dto.amount.toLocaleString('id-ID')} received for loan ${loan.loanNumber}. Remaining: Rp ${newBalance.toNumber().toLocaleString('id-ID')}`,
          type: isFullyPaid ? 'SUCCESS' : 'INFO',
        },
      });

      return {
        message: 'Payment successful',
        paymentAmount: dto.amount,
        remainingBalance: isFullyPaid ? 0 : newBalance.toNumber(),
        isFullyPaid,
      };
    });
  }

  async getPaymentSchedule(id: number, userId: number, userRole: Role) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    // CUSTOMER can only view their own loan schedules
    if (userRole === Role.CUSTOMER && loan.customer.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const payments = await this.prisma.loanPayment.findMany({
      where: { loanId: id },
      orderBy: { paymentNumber: 'asc' },
    });

    return {
      loan: {
        loanNumber: loan.loanNumber,
        loanType: loan.loanType,
        principal: loan.principal,
        interestRate: loan.interestRate,
        termMonths: loan.termMonths,
        monthlyPayment: loan.monthlyPayment,
        remainingBalance: loan.remainingBalance,
        status: loan.status,
      },
      payments,
    };
  }

  private async generateLoanNumber(): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const loanNumber = `LOAN-${date}-${randomNum}`;

    const existing = await this.prisma.loan.findUnique({
      where: { loanNumber },
    });

    if (existing) {
      return this.generateLoanNumber();
    }

    return loanNumber;
  }
}
