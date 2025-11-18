import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TodosService } from '../todos/todos.service';

/**
 * Categories Controller
 * 
 * Menangani semua HTTP requests untuk categories
 * Handles all HTTP requests for categories
 * 
 * Base URL: /categories
 */
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(forwardRef(() => TodosService))
    private readonly todosService: TodosService,
  ) {}

  /**
   * CREATE - Membuat kategori baru
   * POST /categories
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * READ ALL - Mendapatkan semua kategori
   * GET /categories
   */
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * GET STATISTICS - Mendapatkan statistik kategori
   * GET /categories/statistics
   */
  @Get('statistics')
  getStatistics() {
    return this.categoriesService.getStatistics();
  }

  /**
   * READ ONE - Mendapatkan satu kategori
   * GET /categories/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  /**
   * GET TODOS BY CATEGORY - Mendapatkan semua todos dalam kategori
   * GET /categories/:id/todos
   * 
   * Contoh nested resource / Example of nested resource
   */
  @Get(':id/todos')
  getTodosByCategory(@Param('id', ParseIntPipe) id: number) {
    // Verify category exists
    this.categoriesService.findOne(id);
    
    // Get todos for this category
    const todos = this.todosService.findByCategory(id);
    
    return {
      categoryId: id,
      totalTodos: todos.length,
      todos,
    };
  }

  /**
   * UPDATE - Update kategori
   * PATCH /categories/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * DELETE - Hapus kategori
   * DELETE /categories/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
