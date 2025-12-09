import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  /**
   * Enroll in a course (authenticated student)
   */
  @Post()
  create(@Request() req, @Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(req.user.id, createEnrollmentDto);
  }

  /**
   * Get my enrollments
   */
  @Get('my-courses')
  findMyEnrollments(@Request() req) {
    return this.enrollmentsService.findByStudent(req.user.id);
  }

  /**
   * Get enrollment by ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(+id);
  }

  /**
   * Update grade (instructor only - simplified)
   */
  @Patch(':id/grade')
  updateGrade(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.enrollmentsService.updateGrade(+id, updateGradeDto);
  }

  /**
   * Drop a course
   */
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.enrollmentsService.remove(+id, req.user.id);
  }
}
