import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookStatus } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthorsService } from '../authors/authors.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private authorsService: AuthorsService,
    private categoriesService: CategoriesService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    // Verify author exists
    await this.authorsService.findOne(createBookDto.authorId);

    // Verify category exists
    await this.categoriesService.findOne(createBookDto.categoryId);

    // Check for duplicate ISBN
    const existing = await this.booksRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });

    if (existing) {
      throw new ConflictException('ISBN already exists');
    }

    // Set available copies equal to total copies if not provided
    if (!createBookDto.availableCopies) {
      createBookDto.availableCopies = createBookDto.totalCopies;
    }

    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  async findAll(filters?: {
    status?: BookStatus;
    categoryId?: string;
    authorId?: string;
  }): Promise<Book[]> {
    const query = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.category', 'category');

    if (filters?.status) {
      query.andWhere('book.status = :status', { status: filters.status });
    }

    if (filters?.categoryId) {
      query.andWhere('book.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters?.authorId) {
      query.andWhere('book.authorId = :authorId', {
        authorId: filters.authorId,
      });
    }

    return query.orderBy('book.title', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'borrowings'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async findByIsbn(isbn: string): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { isbn },
      relations: ['author', 'category'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    // If author is being updated, verify it exists
    if (updateBookDto.authorId && updateBookDto.authorId !== book.authorId) {
      await this.authorsService.findOne(updateBookDto.authorId);
    }

    // If category is being updated, verify it exists
    if (
      updateBookDto.categoryId &&
      updateBookDto.categoryId !== book.categoryId
    ) {
      await this.categoriesService.findOne(updateBookDto.categoryId);
    }

    // If ISBN is being updated, check for duplicates
    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existing = await this.booksRepository.findOne({
        where: { isbn: updateBookDto.isbn },
      });

      if (existing) {
        throw new ConflictException('ISBN already exists');
      }
    }

    Object.assign(book, updateBookDto);
    return this.booksRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
  }

  async updateAvailability(
    id: string,
    change: number,
  ): Promise<Book> {
    const book = await this.findOne(id);

    const newAvailable = book.availableCopies + change;

    if (newAvailable < 0) {
      throw new BadRequestException('Not enough copies available');
    }

    if (newAvailable > book.totalCopies) {
      throw new BadRequestException(
        'Available copies cannot exceed total copies',
      );
    }

    book.availableCopies = newAvailable;

    // Update status based on availability
    if (book.availableCopies === 0) {
      book.status = BookStatus.BORROWED;
    } else {
      book.status = BookStatus.AVAILABLE;
    }

    return this.booksRepository.save(book);
  }

  async getBookStats(id: string) {
    const book = await this.findOne(id);

    const totalBorrowings = await this.booksRepository
      .createQueryBuilder('book')
      .leftJoin('book.borrowings', 'borrowing')
      .where('book.id = :id', { id })
      .getCount();

    const activeBorrowings = await this.booksRepository
      .createQueryBuilder('book')
      .leftJoin('book.borrowings', 'borrowing')
      .where('book.id = :id', { id })
      .andWhere('borrowing.status = :status', { status: 'borrowed' })
      .getCount();

    return {
      book,
      statistics: {
        totalBorrowings,
        activeBorrowings,
        availableCopies: book.availableCopies,
        totalCopies: book.totalCopies,
      },
    };
  }
}
