import {
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { BorrowStatus } from '../entities/borrowing.entity';

export class CreateBorrowingDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @IsDateString()
  @IsNotEmpty()
  borrowDate: Date;

  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReturnBookDto {
  @IsDateString()
  @IsNotEmpty()
  returnDate: Date;

  @IsOptional()
  @IsNumber()
  lateFee?: number;

  @IsOptional()
  @IsEnum(BorrowStatus)
  status?: BorrowStatus;
}
