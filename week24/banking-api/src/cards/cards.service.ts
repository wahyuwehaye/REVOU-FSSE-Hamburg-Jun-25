import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto, UpdateCardPinDto, ActivateCardDto } from './dto/card.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCardDto, userId: number, userRole: Role) {
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
      include: { user: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // CUSTOMER can only create cards for their own accounts
    if (userRole === Role.CUSTOMER && account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Check if account already has a card of this type
    const existingCard = await this.prisma.card.findFirst({
      where: {
        accountId: dto.accountId,
        cardType: dto.cardType,
        isActive: true,
      },
    });

    if (existingCard) {
      throw new BadRequestException(`Account already has an active ${dto.cardType} card`);
    }

    // Generate card number
    const cardNumber = await this.generateCardNumber(dto.cardType);
    const cvv = this.generateCVV();
    const expiryDate = this.generateExpiryDate();

    // Hash PIN and CVV
    const [hashedPin, hashedCvv] = await Promise.all([
      bcrypt.hash(dto.pin, 10),
      bcrypt.hash(cvv, 10),
    ]);

    return this.prisma.$transaction(async (tx) => {
      const card = await tx.card.create({
        data: {
          accountId: dto.accountId,
          cardNumber,
          cardType: dto.cardType,
          cvv: hashedCvv,
          pin: hashedPin,
          expiryDate,
          isActive: false, // Needs activation
          dailyLimit: dto.dailyLimit || 5000000,
        },
        include: {
          account: {
            select: {
              accountNumber: true,
              accountType: true,
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
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: account.userId,
          title: 'New Card Requested',
          message: `Your ${dto.cardType} card (${cardNumber}) has been requested. Visit our branch to activate it.`,
          type: 'INFO',
        },
      });

      // Return card with CVV (only time CVV is shown in plain text)
      return {
        ...card,
        cvvPlainText: cvv, // Only shown once during creation
        pinReminder: 'Please remember your PIN. It will not be shown again.',
      };
    });
  }

  async findAll(userId: number, userRole: Role) {
    const where: any = {};

    if (userRole === Role.CUSTOMER) {
      // Get customer's accounts
      const accounts = await this.prisma.account.findMany({
        where: { userId },
        select: { id: true },
      });

      where.accountId = { in: accounts.map(a => a.id) };
    }

    return this.prisma.card.findMany({
      where,
      include: {
        account: {
          select: {
            accountNumber: true,
            accountType: true,
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
    });
  }

  async findOne(id: number, userId: number, userRole: Role) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: {
        account: {
          include: {
            user: {
              select: {
                id: true,
                customer: true,
              },
            },
          },
        },
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    // CUSTOMER can only view their own cards
    if (userRole === Role.CUSTOMER && card.account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return card;
  }

  async activate(id: number, dto: ActivateCardDto, userId: number, userRole: Role) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: { account: true },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    // CUSTOMER can only activate their own cards
    if (userRole === Role.CUSTOMER && card.account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (card.isActive) {
      throw new BadRequestException('Card is already active');
    }

    // Verify PIN
    const pinMatch = await bcrypt.compare(dto.pin, card.pin);
    if (!pinMatch) {
      throw new BadRequestException('Invalid PIN');
    }

    return this.prisma.$transaction(async (tx) => {
      const activated = await tx.card.update({
        where: { id },
        data: { isActive: true },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: card.account.userId,
          title: 'Card Activated',
          message: `Your ${card.cardType} card ending in ${card.cardNumber.slice(-4)} has been activated.`,
          type: 'SUCCESS',
        },
      });

      return activated;
    });
  }

  async block(id: number, userId: number, userRole: Role) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: { account: true },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    // CUSTOMER can only block their own cards
    if (userRole === Role.CUSTOMER && card.account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.$transaction(async (tx) => {
      const blocked = await tx.card.update({
        where: { id },
        data: { isActive: false },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: card.account.userId,
          title: 'Card Blocked',
          message: `Your ${card.cardType} card ending in ${card.cardNumber.slice(-4)} has been blocked for security.`,
          type: 'WARNING',
        },
      });

      return blocked;
    });
  }

  async updatePin(id: number, dto: UpdateCardPinDto, userId: number, userRole: Role) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: { account: true },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    // CUSTOMER can only update PIN for their own cards
    if (userRole === Role.CUSTOMER && card.account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Verify old PIN
    const pinMatch = await bcrypt.compare(dto.oldPin, card.pin);
    if (!pinMatch) {
      throw new BadRequestException('Invalid old PIN');
    }

    // Hash new PIN
    const hashedNewPin = await bcrypt.hash(dto.newPin, 10);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.card.update({
        where: { id },
        data: { pin: hashedNewPin },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: card.account.userId,
          title: 'Card PIN Changed',
          message: `PIN for your ${card.cardType} card ending in ${card.cardNumber.slice(-4)} has been updated.`,
          type: 'INFO',
        },
      });

      return { message: 'PIN updated successfully' };
    });
  }

  async remove(id: number, userId: number, userRole: Role) {
    // Only MANAGER and ADMIN can delete cards
    const allowedRoles: Role[] = [Role.MANAGER, Role.ADMIN];
    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenException('Only managers can delete cards');
    }

    const card = await this.prisma.card.findUnique({
      where: { id },
      include: { account: true },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return this.prisma.card.delete({
      where: { id },
    });
  }

  private async generateCardNumber(cardType: string): Promise<string> {
    // VISA: 4xxx, Mastercard: 5xxx
    const prefix = cardType === 'DEBIT' ? '4' : '5';
    const randomNum = Math.floor(Math.random() * 10000000000000000).toString().padStart(15, '0');
    const cardNumber = prefix + randomNum;

    const existing = await this.prisma.card.findUnique({
      where: { cardNumber },
    });

    if (existing) {
      return this.generateCardNumber(cardType);
    }

    return cardNumber;
  }

  private generateCVV(): string {
    return Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  }

  private generateExpiryDate(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 5); // Valid for 5 years
    return date;
  }
}
