import { IsString, IsBoolean, IsInt, IsOptional, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
