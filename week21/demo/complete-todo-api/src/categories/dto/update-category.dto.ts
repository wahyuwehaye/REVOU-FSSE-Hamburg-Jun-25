import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

/**
 * Update Category DTO
 * 
 * Semua field menjadi optional
 * All fields become optional
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
