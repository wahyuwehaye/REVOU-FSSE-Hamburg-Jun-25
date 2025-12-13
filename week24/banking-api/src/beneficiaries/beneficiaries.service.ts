import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBeneficiaryDto } from './dto/beneficiary.dto';
import { Role } from '@prisma/client';

@Injectable()
export class BeneficiariesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBeneficiaryDto, userId: number, userRole: Role) {
    const account = await this.prisma.account.findUnique({
      where: { id: dto.fromAccountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // CUSTOMER can only add beneficiaries to their own accounts
    if (userRole === Role.CUSTOMER && account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Check if beneficiary already exists
    const existing = await this.prisma.beneficiary.findFirst({
      where: {
        userId,
        fromAccountId: dto.fromAccountId,
        beneficiaryAccount: dto.beneficiaryAccount,
      },
    });

    if (existing) {
      throw new ConflictException('Beneficiary already added');
    }

    return this.prisma.beneficiary.create({
      data: {
        userId,
        fromAccountId: dto.fromAccountId,
        beneficiaryName: dto.beneficiaryName,
        beneficiaryBank: dto.beneficiaryBank,
        beneficiaryAccount: dto.beneficiaryAccount,
        nickname: dto.nickname,
      },
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountType: true,
          },
        },
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.beneficiary.findMany({
      where: { userId },
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, userRole: Role) {
    const beneficiary = await this.prisma.beneficiary.findUnique({
      where: { id },
      include: {
        fromAccount: true,
        user: true,
      },
    });

    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }

    // CUSTOMER can only view their own beneficiaries
    if (userRole === Role.CUSTOMER && beneficiary.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return beneficiary;
  }

  async remove(id: number, userId: number, userRole: Role) {
    const beneficiary = await this.prisma.beneficiary.findUnique({
      where: { id },
    });

    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }

    // CUSTOMER can only delete their own beneficiaries
    if (userRole === Role.CUSTOMER && beneficiary.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.beneficiary.delete({
      where: { id },
    });
  }
}
