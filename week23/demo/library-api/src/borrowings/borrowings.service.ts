import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrowing, BorrowStatus } from './entities/borrowing.entity';
import { CreateBorrowingDto, ReturnBookDto } from './dto/create-borrowing.dto';
import { UpdateBorrowingDto } from './dto/update-borrowing.dto';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BorrowingsService {
  constructor(
    @InjectRepository(Borrowing)
    private borrowingsRepository: Repository<Borrowing>,
    private booksService: BooksService,
    private usersService: UsersService,
  ) {}

  async create(createBorrowingDto: CreateBorrowingDto): Promise<Borrowing> {
    // Verify user exists
    await this.usersService.findOne(createBorrowingDto.userId);

    // Verify book exists and is available
    const book = await this.booksService.findOne(createBorrowingDto.bookId);

    if (book.availableCopies < 1) {
      throw new BadRequestException('Book is not available for borrowing');
    }

    // Create borrowing
    const borrowing = this.borrowingsRepository.create({
      ...createBorrowingDto,
      status: BorrowStatus.BORROWED,
    });

    const saved = await this.borrowingsRepository.save(borrowing);

    // Update book availability (decrease by 1)
    await this.booksService.updateAvailability(book.id, -1);

    return this.findOne(saved.id);
  }

  async findAll(filters?: {
    status?: BorrowStatus;
    userId?: string;
    bookId?: string;
  }): Promise<Borrowing[]> {
    const query = this.borrowingsRepository
      .createQueryBuilder('borrowing')
      .leftJoinAndSelect('borrowing.user', 'user')
      .leftJoinAndSelect('borrowing.book', 'book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.category', 'category');

    if (filters?.status) {
      query.andWhere('borrowing.status = :status', { status: filters.status });
    }

    if (filters?.userId) {
      query.andWhere('borrowing.userId = :userId', { userId: filters.userId });
    }

    if (filters?.bookId) {
      query.andWhere('borrowing.bookId = :bookId', { bookId: filters.bookId });
    }

    return query.orderBy('borrowing.borrowDate', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Borrowing> {
    const borrowing = await this.borrowingsRepository.findOne({
      where: { id },
      relations: ['user', 'book', 'book.author', 'book.category'],
    });

    if (!borrowing) {
      throw new NotFoundException(`Borrowing with ID ${id} not found`);
    }

    return borrowing;
  }

  async update(
    id: string,
    updateBorrowingDto: UpdateBorrowingDto,
  ): Promise<Borrowing> {
    const borrowing = await this.findOne(id);

    Object.assign(borrowing, updateBorrowingDto);
    return this.borrowingsRepository.save(borrowing);
  }

  async returnBook(id: string, returnBookDto: ReturnBookDto): Promise<Borrowing> {
    const borrowing = await this.findOne(id);

    if (borrowing.status === BorrowStatus.RETURNED) {
      throw new BadRequestException('Book has already been returned');
    }

    // Calculate late fee if return date is after due date
    const returnDate = new Date(returnBookDto.returnDate);
    const dueDate = new Date(borrowing.dueDate);

    let lateFee = returnBookDto.lateFee || 0;

    if (returnDate > dueDate && lateFee === 0) {
      const daysLate = Math.ceil(
        (returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      lateFee = daysLate * 5000; // Rp 5,000 per day late fee
    }

    // Update borrowing
    borrowing.returnDate = returnDate;
    borrowing.lateFee = lateFee;
    borrowing.status = returnDate > dueDate ? BorrowStatus.OVERDUE : BorrowStatus.RETURNED;

    const saved = await this.borrowingsRepository.save(borrowing);

    // Update book availability (increase by 1)
    await this.booksService.updateAvailability(borrowing.bookId, 1);

    return this.findOne(saved.id);
  }

  async remove(id: string): Promise<void> {
    const borrowing = await this.findOne(id);

    // If book wasn't returned, update availability
    if (borrowing.status === BorrowStatus.BORROWED) {
      await this.booksService.updateAvailability(borrowing.bookId, 1);
    }

    await this.borrowingsRepository.remove(borrowing);
  }

  async getOverdueBorrowings(): Promise<Borrowing[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.borrowingsRepository
      .createQueryBuilder('borrowing')
      .leftJoinAndSelect('borrowing.user', 'user')
      .leftJoinAndSelect('borrowing.book', 'book')
      .where('borrowing.status = :status', { status: BorrowStatus.BORROWED })
      .andWhere('borrowing.dueDate < :today', { today })
      .orderBy('borrowing.dueDate', 'ASC')
      .getMany();
  }
}
