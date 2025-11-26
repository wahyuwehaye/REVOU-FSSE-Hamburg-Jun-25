import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // All fields from CreateUserDto are now optional
  // We can override or add new fields here if needed

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password?: string; // Password is optional in updates
}
