import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    return profile;
  }

  async create(userId: number, dto: CreateProfileDto) {
    return this.prisma.profile.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async update(userId: number, dto: UpdateProfileDto, currentUserId: number, currentUserRole: string) {
    // Only admin or the user themselves can update profile
    if (currentUserRole !== 'ADMIN' && currentUserId !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    return this.prisma.profile.update({
      where: { userId },
      data: dto,
    });
  }

  async remove(userId: number, currentUserId: number, currentUserRole: string) {
    // Only admin or the user themselves can delete profile
    if (currentUserRole !== 'ADMIN' && currentUserId !== userId) {
      throw new ForbiddenException('You can only delete your own profile');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    await this.prisma.profile.delete({
      where: { userId },
    });

    return { message: 'Profile deleted successfully' };
  }
}
