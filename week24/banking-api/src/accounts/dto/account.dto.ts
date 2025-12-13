import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { AccountType, AccountStatus } from '@prisma/client';

export class CreateAccountDto {
  @IsNumber()
  userId: number;

  @IsEnum(AccountType)
  accountType: AccountType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  initialBalance?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  overdraftLimit?: number;

  @IsOptional()
  @IsNumber()
  interestRate?: number;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @IsOptional()
  @IsNumber()
  overdraftLimit?: number;

  @IsOptional()
  @IsNumber()
  interestRate?: number;
}
