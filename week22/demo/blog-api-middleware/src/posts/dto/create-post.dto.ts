import { IsString, IsNotEmpty, MinLength, MaxLength, IsBoolean, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20, { message: 'Content must be at least 20 characters long' })
  content: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
