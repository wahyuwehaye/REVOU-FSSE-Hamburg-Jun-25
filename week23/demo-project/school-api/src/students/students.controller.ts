import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('students')
@UseInterceptors(ClassSerializerInterceptor) // Automatically exclude @Exclude() fields
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * Create a new student (Admin only - simplified for demo)
   */
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  /**
   * Get all students with pagination and search
   * Query params: page, limit, search
   */
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    return this.studentsService.findAll(
      parseInt(page),
      parseInt(limit),
      search,
    );
  }

  /**
   * Get student by ID with enrollments
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  /**
   * Get student statistics
   */
  @Get(':id/statistics')
  @UseGuards(JwtAuthGuard)
  getStatistics(@Param('id') id: string) {
    return this.studentsService.getStatistics(+id);
  }

  /**
   * Update student (Protected route)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  /**
   * Delete student (Admin only - simplified for demo)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
