import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';

/**
 * Todos Controller
 * 
 * Menangani semua HTTP requests untuk todos
 * Handles all HTTP requests for todos
 * 
 * Base URL: /todos
 */
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  /**
   * CREATE - Membuat todo baru
   * POST /todos
   * Body: CreateTodoDto
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  /**
   * READ ALL - Mendapatkan semua todos dengan query parameters
   * GET /todos?completed=false&priority=high&sortBy=createdAt&order=desc&page=1&limit=10&search=meeting
   */
  @Get()
  findAll(@Query() query: QueryTodoDto) {
    return this.todosService.findAll(query);
  }

  /**
   * GET STATISTICS - Mendapatkan statistik todos
   * GET /todos/statistics
   * 
   * CATATAN: Harus diletakkan SEBELUM @Get(':id')
   * NOTE: Must be placed BEFORE @Get(':id')
   */
  @Get('statistics')
  getStatistics() {
    return this.todosService.getStatistics();
  }

  /**
   * READ ONE - Mendapatkan satu todo berdasarkan ID
   * GET /todos/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  /**
   * UPDATE (PATCH) - Update sebagian field todo
   * PATCH /todos/:id
   * Body: UpdateTodoDto (partial)
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(id, updateTodoDto);
  }

  /**
   * UPDATE (PUT) - Update seluruh todo
   * PUT /todos/:id
   * Body: UpdateTodoDto
   */
  @Put(':id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(id, updateTodoDto);
  }

  /**
   * DELETE - Hapus todo
   * DELETE /todos/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }

  /**
   * BULK DELETE - Hapus multiple todos
   * POST /todos/bulk-delete
   * Body: { ids: [1, 2, 3] }
   */
  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  bulkDelete(@Body('ids') ids: number[]) {
    return this.todosService.bulkDelete(ids);
  }

  /**
   * MARK AS COMPLETED - Tandai todo sebagai selesai
   * PATCH /todos/:id/complete
   */
  @Patch(':id/complete')
  markAsCompleted(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.markAsCompleted(id);
  }

  /**
   * MARK AS INCOMPLETE - Tandai todo sebagai belum selesai
   * PATCH /todos/:id/incomplete
   */
  @Patch(':id/incomplete')
  markAsIncomplete(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.markAsIncomplete(id);
  }
}
