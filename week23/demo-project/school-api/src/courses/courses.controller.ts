import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * Create a new course (Admin only - simplified)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  /**
   * Get all courses with enrollment count
   */
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  /**
   * Get course by ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  /**
   * Get course with enrolled students
   */
  @Get(':id/students')
  findOneWithStudents(@Param('id') id: string) {
    return this.coursesService.findOneWithStudents(+id);
  }

  /**
   * Get course statistics
   */
  @Get(':id/statistics')
  getStatistics(@Param('id') id: string) {
    return this.coursesService.getStatistics(+id);
  }

  /**
   * Update course
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCourseDto: Partial<CreateCourseDto>) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  /**
   * Delete course
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
