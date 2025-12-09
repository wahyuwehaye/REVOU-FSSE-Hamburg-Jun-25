# 📘 Library Management API - Implementation Guide

Complete step-by-step guide to build this project from scratch.

## 🎯 Part 1: Project Setup (15 mins)

### Step 1: Create NestJS Project

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create new project
nest new library-management-api

# Navigate to project
cd library-management-api
```

### Step 2: Install Dependencies

```bash
# TypeORM and PostgreSQL
npm install @nestjs/typeorm typeorm pg

# Config module
npm install @nestjs/config

# Validation
npm install class-validator class-transformer

# Development dependencies
npm install -D @types/node ts-node tsconfig-paths
```

### Step 3: Setup Environment

Create `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=library_db
NODE_ENV=development
PORT=3000
```

### Step 4: Create Database

```bash
# Using psql
psql -U postgres

# In psql console
CREATE DATABASE library_db;
\q
```

---

## 🏗️ Part 2: Entities (30 mins)

### Author Entity

```typescript
// src/authors/author.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from '../books/book.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @ManyToMany(() => Book, (book) => book.authors)
  books: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Book Entity

```typescript
// src/books/book.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Author } from '../authors/author.entity';
import { Borrowing } from '../borrowings/borrowing.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 13, unique: true })
  @Index()
  isbn: string;

  @Column({ length: 255 })
  @Index()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  publishedYear: number;

  @Column({ type: 'int', default: 1 })
  totalCopies: number;

  @Column({ type: 'int', default: 1 })
  availableCopies: number;

  @ManyToMany(() => Author, (author) => author.books, { cascade: true })
  @JoinTable({
    name: 'books_authors',
    joinColumn: { name: 'bookId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'authorId', referencedColumnName: 'id' },
  })
  authors: Author[];

  @OneToMany(() => Borrowing, (borrowing) => borrowing.book)
  borrowings: Borrowing[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Member Entity

```typescript
// src/members/member.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Borrowing } from '../borrowings/borrowing.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  @Index()
  email: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 50, default: 'basic' })
  membershipType: string;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Borrowing, (borrowing) => borrowing.member)
  borrowings: Borrowing[];
}
```

### Borrowing Entity

```typescript
// src/borrowings/borrowing.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Book } from '../books/book.entity';
import { Member } from '../members/member.entity';

@Entity('borrowings')
export class Borrowing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  bookId: number;

  @Column()
  @Index()
  memberId: number;

  @ManyToOne(() => Book, (book) => book.borrowings)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => Member, (member) => member.borrowings)
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @CreateDateColumn()
  borrowedAt: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt: Date;

  @Column({ length: 50, default: 'borrowed' })
  @Index()
  status: string; // 'borrowed', 'returned', 'overdue'

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fineAmount: number;
}
```

---

## 🎨 Part 3: DTOs (20 mins)

### Book DTOs

```typescript
// src/books/dto/create-book.dto.ts
import { IsString, IsISBN, IsInt, Min, IsArray, IsOptional, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsISBN()
  isbn: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  publishedYear?: number;

  @IsInt()
  @Min(1)
  totalCopies: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  availableCopies?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  authorIds?: number[];
}
```

```typescript
// src/books/dto/update-book.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
```

```typescript
// src/books/dto/query-book.dto.ts
import { IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryBookDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  publishedYear?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  available?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
```

---

## 🔧 Part 4: Services (45 mins)

### Books Service

```typescript
// src/books/books.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, MoreThan } from 'typeorm';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    // Check if ISBN already exists
    const existingBook = await this.booksRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });

    if (existingBook) {
      throw new ConflictException('Book with this ISBN already exists');
    }

    // Find authors if provided
    let authors = [];
    if (createBookDto.authorIds && createBookDto.authorIds.length > 0) {
      authors = await this.authorsRepository.findByIds(createBookDto.authorIds);
    }

    // Set availableCopies to totalCopies if not provided
    if (!createBookDto.availableCopies) {
      createBookDto.availableCopies = createBookDto.totalCopies;
    }

    const book = this.booksRepository.create({
      ...createBookDto,
      authors,
    });

    return await this.booksRepository.save(book);
  }

  async findAll(query: QueryBookDto) {
    const { search, publishedYear, available, page = 1, limit = 10 } = query;

    const queryBuilder = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author');

    // Search by title or description
    if (search) {
      queryBuilder.where(
        'book.title ILIKE :search OR book.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    // Filter by published year
    if (publishedYear) {
      queryBuilder.andWhere('book.publishedYear = :year', { year: publishedYear });
    }

    // Filter available books only
    if (available) {
      queryBuilder.andWhere('book.availableCopies > 0');
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by title
    queryBuilder.orderBy('book.title', 'ASC');

    const [books, total] = await queryBuilder.getManyAndCount();

    return {
      data: books,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['authors'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async findByIsbn(isbn: string): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { isbn },
      relations: ['authors'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    // Update authors if provided
    if (updateBookDto.authorIds) {
      book.authors = await this.authorsRepository.findByIds(updateBookDto.authorIds);
      delete updateBookDto.authorIds;
    }

    Object.assign(book, updateBookDto);
    return await this.booksRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
  }

  async decrementAvailableCopies(id: number): Promise<void> {
    await this.booksRepository.decrement({ id }, 'availableCopies', 1);
  }

  async incrementAvailableCopies(id: number): Promise<void> {
    await this.booksRepository.increment({ id }, 'availableCopies', 1);
  }
}
```

### Borrowings Service

```typescript
// src/borrowings/borrowings.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, IsNull } from 'typeorm';
import { Borrowing } from './borrowing.entity';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';

@Injectable()
export class BorrowingsService {
  constructor(
    @InjectRepository(Borrowing)
    private borrowingsRepository: Repository<Borrowing>,
    private booksService: BooksService,
    private membersService: MembersService,
  ) {}

  async create(createBorrowingDto: CreateBorrowingDto): Promise<Borrowing> {
    const { bookId, memberId, dueDate } = createBorrowingDto;

    // Check if book exists and is available
    const book = await this.booksService.findOne(bookId);
    if (book.availableCopies <= 0) {
      throw new BadRequestException('Book is not available for borrowing');
    }

    // Check if member exists and is active
    const member = await this.membersService.findOne(memberId);
    if (!member.isActive) {
      throw new BadRequestException('Member account is not active');
    }

    // Create borrowing
    const borrowing = this.borrowingsRepository.create({
      bookId,
      memberId,
      dueDate: new Date(dueDate),
      status: 'borrowed',
    });

    const savedBorrowing = await this.borrowingsRepository.save(borrowing);

    // Decrement available copies
    await this.booksService.decrementAvailableCopies(bookId);

    return this.findOne(savedBorrowing.id);
  }

  async findAll() {
    return await this.borrowingsRepository.find({
      relations: ['book', 'member'],
      order: { borrowedAt: 'DESC' },
    });
  }

  async findActive() {
    return await this.borrowingsRepository.find({
      where: { status: 'borrowed', returnedAt: IsNull() },
      relations: ['book', 'member'],
    });
  }

  async findOverdue() {
    const now = new Date();
    const overdue = await this.borrowingsRepository.find({
      where: {
        dueDate: LessThan(now),
        returnedAt: IsNull(),
      },
      relations: ['book', 'member'],
    });

    // Calculate fine for each
    return overdue.map((borrowing) => {
      const daysOverdue = Math.floor(
        (now.getTime() - new Date(borrowing.dueDate).getTime()) / (1000 * 60 * 60 * 24),
      );
      const finePerDay = 1.0; // $1 per day
      const fineAmount = daysOverdue * finePerDay;

      return {
        ...borrowing,
        daysOverdue,
        fineAmount,
      };
    });
  }

  async findOne(id: number): Promise<Borrowing> {
    const borrowing = await this.borrowingsRepository.findOne({
      where: { id },
      relations: ['book', 'book.authors', 'member'],
    });

    if (!borrowing) {
      throw new NotFoundException(`Borrowing with ID ${id} not found`);
    }

    return borrowing;
  }

  async returnBook(id: number): Promise<Borrowing> {
    const borrowing = await this.findOne(id);

    if (borrowing.returnedAt) {
      throw new BadRequestException('Book has already been returned');
    }

    // Calculate fine if overdue
    const now = new Date();
    const dueDate = new Date(borrowing.dueDate);
    
    if (now > dueDate) {
      const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      const finePerDay = 1.0;
      borrowing.fineAmount = daysOverdue * finePerDay;
      borrowing.status = 'returned_late';
    } else {
      borrowing.status = 'returned';
    }

    borrowing.returnedAt = now;
    await this.borrowingsRepository.save(borrowing);

    // Increment available copies
    await this.booksService.incrementAvailableCopies(borrowing.bookId);

    return this.findOne(id);
  }
}
```

---

## 🎮 Part 5: Controllers (30 mins)

### Books Controller

```typescript
// src/books/books.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(@Query() query: QueryBookDto) {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Get('isbn/:isbn')
  findByIsbn(@Param('isbn') isbn: string) {
    return this.booksService.findByIsbn(isbn);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
```

---

## 🔌 Part 6: Modules (15 mins)

### Books Module

```typescript
// src/books/books.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
```

### App Module

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { BorrowingsModule } from './borrowings/borrowings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthorsModule,
    BooksModule,
    MembersModule,
    BorrowingsModule,
  ],
})
export class AppModule {}
```

---

## 🌱 Part 7: Seeding (20 mins)

Create seed files in `src/seeds/`:

```typescript
// src/seeds/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { seedAuthors } from './authors.seed';
import { seedBooks } from './books.seed';
import { seedMembers } from './members.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('🌱 Seeding database...');

  await seedAuthors(app);
  await seedBooks(app);
  await seedMembers(app);

  console.log('✅ Seeding complete!');

  await app.close();
}

bootstrap();
```

---

## ✅ Testing (30 mins)

Test all endpoints with curl or Postman following the examples in README.md.

---

## 🎯 Summary

**Total Time:** ~3.5 hours

**What You've Built:**
- Complete CRUD for 4 entities
- Complex relationships (Many-to-Many, One-to-Many)
- Advanced queries (search, filter, pagination)
- Business logic (book availability, fine calculation)
- Data validation with DTOs
- Database seeding

**Skills Learned:**
- NestJS architecture
- TypeORM relationships
- PostgreSQL integration
- RESTful API design
- Error handling

---

**Congratulations! 🎉 You've built a production-ready API!**
