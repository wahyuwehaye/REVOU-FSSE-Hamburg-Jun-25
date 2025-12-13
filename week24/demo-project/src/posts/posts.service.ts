import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(published?: boolean) {
    return this.prisma.post.findMany({
      where: published !== undefined ? { published } : {},
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Increment view count
    await this.prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return post;
  }

  async create(authorId: number, dto: CreatePostDto) {
    // Generate slug from title
    const slug = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return this.prisma.post.create({
      data: {
        ...dto,
        slug,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });
  }

  async update(id: number, dto: UpdatePostDto, currentUserId: number, currentUserRole: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Only admin or post author can update
    if (currentUserRole !== 'ADMIN' && post.authorId !== currentUserId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    // Update slug if title changed
    const updateData: any = { ...dto };
    if (dto.title) {
      updateData.slug = dto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    return this.prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });
  }

  async remove(id: number, currentUserId: number, currentUserRole: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Only admin or post author can delete
    if (currentUserRole !== 'ADMIN' && post.authorId !== currentUserId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: 'Post deleted successfully' };
  }

  async addTag(postId: number, tagId: number, currentUserId: number, currentUserRole: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    // Only admin or post author can add tags
    if (currentUserRole !== 'ADMIN' && post.authorId !== currentUserId) {
      throw new ForbiddenException('You can only modify your own posts');
    }

    return this.prisma.postTag.create({
      data: {
        postId,
        tagId,
      },
      include: {
        tag: true,
      },
    });
  }

  async removeTag(postId: number, tagId: number, currentUserId: number, currentUserRole: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    // Only admin or post author can remove tags
    if (currentUserRole !== 'ADMIN' && post.authorId !== currentUserId) {
      throw new ForbiddenException('You can only modify your own posts');
    }

    const postTag = await this.prisma.postTag.findFirst({
      where: {
        postId,
        tagId,
      },
    });

    if (!postTag) {
      throw new NotFoundException('Tag not found on this post');
    }

    await this.prisma.postTag.delete({
      where: {
        id: postTag.id,
      },
    });

    return { message: 'Tag removed from post successfully' };
  }
}
