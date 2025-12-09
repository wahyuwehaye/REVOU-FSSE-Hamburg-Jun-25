import { IsEmail, IsInt, IsString, Min, MinLength, Max } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsInt()
  @Min(16, { message: 'Age must be at least 16' })
  @Max(100, { message: 'Age must be less than 100' })
  age: number;
}
