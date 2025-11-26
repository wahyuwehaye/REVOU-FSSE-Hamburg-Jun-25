import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(category: string): Promise<Post[]> {
    return await this.postsRepository.find({
      where: { category },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    
    Object.assign(post, updatePostDto);
    
    return await this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
  }

  async seedData(): Promise<{ message: string; count: number }> {
    const samplePosts = [
      {
        title: 'Getting Started with NestJS',
        content: 'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications.',
        category: 'Tutorial',
        author: 'John Doe',
        published: true,
      },
      {
        title: 'Understanding Middleware in NestJS',
        content: 'Middleware is a function which is called before the route handler. Learn how to implement custom middleware in NestJS.',
        category: 'Tutorial',
        author: 'Jane Smith',
        published: true,
      },
      {
        title: 'Best Practices for API Security',
        content: 'Security is crucial for any API. This post covers essential security practices including API key authentication and rate limiting.',
        category: 'Security',
        author: 'Bob Johnson',
        published: true,
      },
    ];

    const posts = this.postsRepository.create(samplePosts);
    await this.postsRepository.save(posts);

    return {
      message: 'Sample posts created successfully',
      count: posts.length,
    };
  }
}
