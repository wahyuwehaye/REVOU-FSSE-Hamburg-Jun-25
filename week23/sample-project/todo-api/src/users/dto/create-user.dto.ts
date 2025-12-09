import { IsEmail, IsString, IsNotEmpty, IsOptional, IsBoolean, IsIn, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
