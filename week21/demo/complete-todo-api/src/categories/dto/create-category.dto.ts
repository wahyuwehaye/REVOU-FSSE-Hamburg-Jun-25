import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

/**
 * Create Category DTO
 * 
 * Data Transfer Object untuk membuat kategori baru
 * Data Transfer Object for creating new categories
 */
export class CreateCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(200, { message: 'Description must not exceed 200 characters' })
  description?: string;

  @IsString({ message: 'Color must be a string' })
  @IsOptional()
  color?: string; // Hex color code: "#FF5733"
}
