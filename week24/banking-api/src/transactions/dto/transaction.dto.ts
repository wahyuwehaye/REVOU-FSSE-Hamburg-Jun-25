import { IsEnum, IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsString()
  fromAccountNumber: string;

  @IsOptional()
  @IsString()
  toAccountNumber?: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class DepositDto {
  @IsString()
  accountNumber: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class WithdrawDto {
  @IsString()
  accountNumber: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class TransferDto {
  @IsString()
  fromAccountNumber: string;

  @IsString()
  toAccountNumber: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class PaymentDto {
  @IsString()
  accountNumber: string;

  @IsString()
  paymentType: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
