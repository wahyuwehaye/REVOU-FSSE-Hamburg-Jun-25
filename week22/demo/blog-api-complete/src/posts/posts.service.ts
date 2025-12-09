import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Post, PostStatus } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CategoriesService } from '../categories/categories.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private categoriesService: CategoriesService,
    private tagsService: TagsService,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    // Generate slug
    const slug = await this.generateUniqueSlug(createPostDto.title);

    // Get category
    const category = await this.categoriesService.findOne(createPostDto.categoryId);

    // Get tags if provided
    let tags = [];
    if (createPostDto.tagIds && createPostDto.tagIds.length > 0) {
      tags = await this.tagsService.findByIds(createPostDto.tagIds);
      if (tags.length !== createPostDto.tagIds.length) {
        throw new BadRequestException('Some tags were not found');
      }
    }

    // Create post
    const post = this.postsRepository.create({
      title: createPostDto.title,
      slug,
      content: createPostDto.content,
      excerpt: createPostDto.excerpt,
      featuredImage: createPostDto.featuredImage,
      status: createPostDto.status || PostStatus.DRAFT,
      author: { id: authorId } as any,
      category,
      tags,
      publishedAt: createPostDto.status === PostStatus.PUBLISHED ? new Date() : null,
    });

    return await this.postsRepository.save(post);
  }

  async findAll(filters?: { status?: PostStatus; categoryId?: string; tagId?: string }): Promise<Post[]> {
    const query = this.postsRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.comments', 'comments')
      .orderBy('post.createdAt', 'DESC');

    if (filters?.status) {
      query.andWhere('post.status = :status', { status: filters.status });
    }

    if (filters?.categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId: filters.categoryId });
    }

    if (filters?.tagId) {
      query.andWhere('tags.id = :tagId', { tagId: filters.tagId });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'tags', 'comments', 'comments.user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { slug },
      relations: ['author', 'category', 'tags', 'comments', 'comments.user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    // Increment view count
    post.viewCount += 1;
    await this.postsRepository.save(post);

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    // Update slug if title changed
    if (updatePostDto.title && updatePostDto.title !== post.title) {
      post.slug = await this.generateUniqueSlug(updatePostDto.title);
    }

    // Update category if changed
    if (updatePostDto.categoryId && updatePostDto.categoryId !== post.category.id) {
      post.category = await this.categoriesService.findOne(updatePostDto.categoryId);
    }

    // Update tags if provided
    if (updatePostDto.tagIds) {
      const tags = await this.tagsService.findByIds(updatePostDto.tagIds);
      if (tags.length !== updatePostDto.tagIds.length) {
        throw new BadRequestException('Some tags were not found');
      }
      post.tags = tags;
    }

    // Update published date if status changed to published
    if (updatePostDto.status === PostStatus.PUBLISHED && post.status !== PostStatus.PUBLISHED) {
      post.publishedAt = new Date();
    }

    // Update other fields
    Object.assign(post, {
      title: updatePostDto.title,
      content: updatePostDto.content,
      excerpt: updatePostDto.excerpt,
      featuredImage: updatePostDto.featuredImage,
      status: updatePostDto.status,
    });

    return await this.postsRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
  }

  async getPostsByAuthor(authorId: string): Promise<Post[]> {
    return await this.postsRepository.find({
      where: { author: { id: authorId } },
      relations: ['author', 'category', 'tags'],
      order: { createdAt: 'DESC' },
    });
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    let slug = slugify(title, { lower: true, strict: true });
    let counter = 1;

    while (await this.postsRepository.findOne({ where: { slug } })) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
      counter++;
    }

    return slug;
  }
}
