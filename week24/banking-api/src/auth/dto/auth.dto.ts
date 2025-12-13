import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsDateString, IsPhoneNumber, IsNumberString, Length } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  // Customer data (required for CUSTOMER role)
  @IsString()
  fullName: string;

  @IsPhoneNumber('ID')
  phoneNumber: string;

  @IsNumberString()
  @Length(16, 16)
  identityNumber: string; // KTP

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsString()
  occupation: string;

  @IsOptional()
  monthlyIncome?: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
