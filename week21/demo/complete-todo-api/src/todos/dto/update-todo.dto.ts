import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';

/**
 * Update Todo DTO
 * 
 * Menggunakan PartialType untuk membuat semua field menjadi optional
 * Mewarisi semua validasi dari CreateTodoDto
 * 
 * Uses PartialType to make all fields optional
 * Inherits all validation from CreateTodoDto
 * 
 * Contoh / Example:
 * {
 *   "title": "Updated title",        // Optional
 *   "completed": true                 // Optional
 * }
 */
export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
