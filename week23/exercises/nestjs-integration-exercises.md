# 🔗 NestJS + TypeORM Integration Exercises

Practice building NestJS applications with PostgreSQL and TypeORM through 20 hands-on exercises.

## 🎯 Setup

```bash
# Create new NestJS project
nest new typeorm-exercises
cd typeorm-exercises

# Install dependencies
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config class-validator class-transformer
```

---

## 📖 Exercises

### Part 1: Basic Entity & Repository (1-5)

**Exercise 1:** Create a User entity with basic fields
<details>
<summary>Requirements</summary>

Create `User` entity with:
- id (auto-generated)
- email (unique)
- name
- createdAt

</details>

<details>
<summary>Solution</summary>

```typescript
// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
```
</details>

---

**Exercise 2:** Create UsersModule with TypeORM integration
<details>
<summary>Solution</summary>

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```
</details>

---

**Exercise 3:** Implement CRUD operations in UsersService
<details>
<summary>Solution</summary>

```typescript
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: { email: string; name: string }): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
```
</details>

---

**Exercise 4:** Add validation DTOs
<details>
<summary>Solution</summary>

```typescript
// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;
}

// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```
</details>

---

**Exercise 5:** Create REST endpoints
<details>
<summary>Solution</summary>

```typescript
// src/users/users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```
</details>

---

### Part 2: Relationships (6-10)

**Exercise 6:** Create Post entity with ManyToOne to User
<details>
<summary>Solution</summary>

```typescript
// src/posts/entities/post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @Column()
  authorId: number;

  @CreateDateColumn()
  createdAt: Date;
}

// Update User entity
@Entity('users')
export class User {
  // ... existing fields

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
```
</details>

---

**Exercise 7:** Query posts with author information
<details>
<summary>Solution</summary>

```typescript
// src/posts/posts.service.ts
async findAllWithAuthors(): Promise<Post[]> {
  return await this.postsRepository.find({
    relations: ['author'],
  });
}

// Or using QueryBuilder
async findAllWithAuthorsQB(): Promise<Post[]> {
  return await this.postsRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.author', 'author')
    .getMany();
}
```
</details>

---

**Exercise 8:** Create Tag entity with ManyToMany to Post
<details>
<summary>Solution</summary>

```typescript
// src/tags/entities/tag.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}

// Update Post entity
@Entity('posts')
export class Post {
  // ... existing fields

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({
    name: 'posts_tags',
    joinColumn: { name: 'postId' },
    inverseJoinColumn: { name: 'tagId' },
  })
  tags: Tag[];
}
```
</details>

---

**Exercise 9:** Add/remove tags from a post
<details>
<summary>Solution</summary>

```typescript
// src/posts/posts.service.ts
async addTag(postId: number, tagId: number): Promise<Post> {
  const post = await this.postsRepository.findOne({
    where: { id: postId },
    relations: ['tags'],
  });
  
  const tag = await this.tagsRepository.findOneBy({ id: tagId });
  
  if (!post.tags) {
    post.tags = [];
  }
  
  post.tags.push(tag);
  return await this.postsRepository.save(post);
}

async removeTag(postId: number, tagId: number): Promise<Post> {
  const post = await this.postsRepository.findOne({
    where: { id: postId },
    relations: ['tags'],
  });
  
  post.tags = post.tags.filter(tag => tag.id !== tagId);
  return await this.postsRepository.save(post);
}
```
</details>

---

**Exercise 10:** Create Profile with OneToOne to User
<details>
<summary>Solution</summary>

```typescript
// src/profiles/entities/profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;
}

// Update User entity
@Entity('users')
export class User {
  // ... existing fields

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
```
</details>

---

### Part 3: Advanced Queries (11-15)

**Exercise 11:** Find users with post count
<details>
<summary>Solution</summary>

```typescript
async getUsersWithPostCount() {
  return await this.usersRepository
    .createQueryBuilder('user')
    .leftJoin('user.posts', 'post')
    .select('user.id', 'id')
    .addSelect('user.name', 'name')
    .addSelect('COUNT(post.id)', 'postCount')
    .groupBy('user.id')
    .getRawMany();
}
```
</details>

---

**Exercise 12:** Search posts by title or content
<details>
<summary>Solution</summary>

```typescript
async searchPosts(query: string): Promise<Post[]> {
  return await this.postsRepository
    .createQueryBuilder('post')
    .where('post.title ILIKE :query', { query: `%${query}%` })
    .orWhere('post.content ILIKE :query', { query: `%${query}%` })
    .leftJoinAndSelect('post.author', 'author')
    .getMany();
}
```
</details>

---

**Exercise 13:** Paginate posts with metadata
<details>
<summary>Solution</summary>

```typescript
interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async paginatePosts(page: number = 1, limit: number = 10): Promise<PaginationResult<Post>> {
  const [data, total] = await this.postsRepository.findAndCount({
    relations: ['author'],
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```
</details>

---

**Exercise 14:** Find posts by multiple tags (AND condition)
<details>
<summary>Solution</summary>

```typescript
async findPostsByTags(tagIds: number[]): Promise<Post[]> {
  const qb = this.postsRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.tags', 'tag');

  tagIds.forEach((tagId, index) => {
    qb.andWhere(`EXISTS (
      SELECT 1 FROM posts_tags pt
      WHERE pt.postId = post.id AND pt.tagId = :tagId${index}
    )`, { [`tagId${index}`]: tagId });
  });

  return await qb.getMany();
}
```
</details>

---

**Exercise 15:** Get trending posts (most viewed last 7 days)
<details>
<summary>Solution</summary>

```typescript
// First add viewCount to Post entity
@Column({ default: 0 })
viewCount: number;

// Service method
async getTrendingPosts(limit: number = 10): Promise<Post[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return await this.postsRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.author', 'author')
    .where('post.createdAt >= :date', { date: sevenDaysAgo })
    .orderBy('post.viewCount', 'DESC')
    .limit(limit)
    .getMany();
}
```
</details>

---

### Part 4: Transactions & Migrations (16-20)

**Exercise 16:** Use transaction for creating user with profile
<details>
<summary>Solution</summary>

```typescript
async createUserWithProfile(
  createUserDto: CreateUserDto,
  profileData: { bio: string; avatar: string },
): Promise<User> {
  return await this.dataSource.transaction(async (manager) => {
    // Create user
    const user = manager.create(User, createUserDto);
    await manager.save(user);

    // Create profile
    const profile = manager.create(Profile, {
      ...profileData,
      userId: user.id,
    });
    await manager.save(profile);

    // Return user with profile
    return await manager.findOne(User, {
      where: { id: user.id },
      relations: ['profile'],
    });
  });
}
```
</details>

---

**Exercise 17:** Create migration for adding isPublished to Post
<details>
<summary>Solution</summary>

```bash
# Generate migration
npm run typeorm migration:generate -- -n AddIsPublishedToPost
```

```typescript
// migrations/1234567890-AddIsPublishedToPost.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsPublishedToPost1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "posts" 
      ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "posts" 
      DROP COLUMN "isPublished"
    `);
  }
}
```
</details>

---

**Exercise 18:** Create seeder for initial data
<details>
<summary>Solution</summary>

```typescript
// src/database/seeds/initial-seed.ts
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const postRepository = dataSource.getRepository(Post);

  // Create users
  const user1 = await userRepository.save({
    email: 'john@example.com',
    name: 'John Doe',
  });

  const user2 = await userRepository.save({
    email: 'jane@example.com',
    name: 'Jane Smith',
  });

  // Create posts
  await postRepository.save([
    {
      title: 'First Post',
      content: 'This is the first post',
      authorId: user1.id,
    },
    {
      title: 'Second Post',
      content: 'This is the second post',
      authorId: user2.id,
    },
  ]);

  console.log('Database seeded successfully!');
}
```
</details>

---

**Exercise 19:** Implement soft delete for User
<details>
<summary>Solution</summary>

```typescript
// Update User entity
import { DeleteDateColumn } from 'typeorm';

@Entity('users')
export class User {
  // ... existing fields

  @DeleteDateColumn()
  deletedAt?: Date;
}

// Service method
async softRemove(id: number): Promise<void> {
  await this.usersRepository.softDelete(id);
}

async restore(id: number): Promise<void> {
  await this.usersRepository.restore(id);
}

// Find including soft-deleted
async findAllIncludingDeleted(): Promise<User[]> {
  return await this.usersRepository.find({
    withDeleted: true,
  });
}
```
</details>

---

**Exercise 20:** Implement custom repository with complex query
<details>
<summary>Solution</summary>

```typescript
// src/posts/posts.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async getPostStatsByAuthor(authorId: number) {
    return await this.createQueryBuilder('post')
      .select('COUNT(post.id)', 'totalPosts')
      .addSelect('SUM(post.viewCount)', 'totalViews')
      .addSelect('AVG(post.viewCount)', 'avgViews')
      .where('post.authorId = :authorId', { authorId })
      .getRawOne();
  }

  async getTopAuthors(limit: number = 10) {
    return await this.createQueryBuilder('post')
      .select('user.id', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('COUNT(post.id)', 'postCount')
      .addSelect('SUM(post.viewCount)', 'totalViews')
      .leftJoin('post.author', 'user')
      .groupBy('user.id')
      .orderBy('postCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
```
</details>

---

## 🎓 Key Concepts Covered

- Entity creation with decorators
- Repository pattern
- DTOs with validation
- One-to-One, One-to-Many, Many-to-Many relationships
- QueryBuilder for complex queries
- Pagination
- Transactions
- Migrations
- Seeding
- Soft deletes
- Custom repositories

**Master these to build production-ready NestJS applications!**
