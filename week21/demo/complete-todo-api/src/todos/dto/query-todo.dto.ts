import { IsOptional, IsEnum, IsString, IsBoolean, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TodoPriority } from './create-todo.dto';

/**
 * Sort order enum
 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Query Todo DTO
 * 
 * DTO untuk filtering, sorting, pagination, dan search
 * Digunakan di query parameters
 * 
 * DTO for filtering, sorting, pagination, and search
 * Used in query parameters
 * 
 * Contoh / Example:
 * GET /todos?completed=false&priority=high&sortBy=createdAt&order=desc&page=1&limit=10&search=meeting
 */
export class QueryTodoDto {
  // Filtering
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  completed?: boolean;

  @IsOptional()
  @IsEnum(TodoPriority)
  priority?: TodoPriority;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsString()
  tags?: string; // Filter by tag: "work" or "urgent"

  // Sorting
  @IsOptional()
  @IsString()
  sortBy?: string; // Field to sort by: "title", "createdAt", "priority", etc.

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder; // "asc" or "desc"

  // Pagination
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number;

  // Search
  @IsOptional()
  @IsString()
  search?: string; // Search in title and description
}
