import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import { CreateBorrowingDto, ReturnBookDto } from './dto/create-borrowing.dto';
import { UpdateBorrowingDto } from './dto/update-borrowing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BorrowStatus } from './entities/borrowing.entity';

@Controller('borrowings')
export class BorrowingsController {
  constructor(private readonly borrowingsService: BorrowingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBorrowingDto: CreateBorrowingDto) {
    return this.borrowingsService.create(createBorrowingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('status') status?: BorrowStatus,
    @Query('userId') userId?: string,
    @Query('bookId') bookId?: string,
  ) {
    return this.borrowingsService.findAll({ status, userId, bookId });
  }

  @Get('overdue')
  @UseGuards(JwtAuthGuard)
  getOverdueBorrowings() {
    return this.borrowingsService.getOverdueBorrowings();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.borrowingsService.findOne(id);
  }

  @Post(':id/return')
  @UseGuards(JwtAuthGuard)
  returnBook(@Param('id') id: string, @Body() returnBookDto: ReturnBookDto) {
    return this.borrowingsService.returnBook(id, returnBookDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateBorrowingDto: UpdateBorrowingDto,
  ) {
    return this.borrowingsService.update(id, updateBorrowingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.borrowingsService.remove(id);
  }
}
