import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBeneficiaryDto {
  @IsNumber()
  fromAccountId: number;

  @IsString()
  beneficiaryName: string;

  @IsString()
  beneficiaryBank: string;

  @IsString()
  beneficiaryAccount: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}
