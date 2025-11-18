import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

/**
 * Priority enum for todo tasks
 */
export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Create Todo DTO
 * 
 * Data Transfer Object untuk membuat todo baru
 * Semua validasi dilakukan menggunakan class-validator decorators
 * 
 * Data Transfer Object for creating new todos
 * All validation is done using class-validator decorators
 */
export class CreateTodoDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsBoolean({ message: 'Completed must be a boolean value' })
  @IsOptional()
  completed?: boolean;

  @IsEnum(TodoPriority, {
    message: 'Priority must be one of: low, medium, high, urgent',
  })
  @IsOptional()
  priority?: TodoPriority;

  @IsNumber({}, { message: 'Category ID must be a number' })
  @IsOptional()
  @Min(1, { message: 'Category ID must be at least 1' })
  categoryId?: number;

  @IsString({ message: 'Tags must be a string' })
  @IsOptional()
  tags?: string; // Comma-separated tags: "work,urgent,meeting"
}
