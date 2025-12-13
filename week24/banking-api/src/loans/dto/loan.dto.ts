import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { LoanStatus } from '@prisma/client';

export class ApplyLoanDto {
  @IsString()
  loanType: string;

  @IsNumber()
  @Min(1000000)
  principal: number;

  @IsNumber()
  @Min(1)
  termMonths: number;

  @IsNumber()
  interestRate: number;
}

export class ApproveLoanDto {
  @IsNumber()
  @Min(0)
  approvedAmount?: number;

  @IsNumber()
  approvedInterestRate?: number;

  @IsEnum(LoanStatus)
  status: LoanStatus;
}

export class MakePaymentDto {
  @IsNumber()
  @Min(1)
  amount: number;
}
