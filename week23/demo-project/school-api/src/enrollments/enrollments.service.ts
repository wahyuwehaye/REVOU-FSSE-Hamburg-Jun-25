import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
    private coursesService: CoursesService,
    private dataSource: DataSource,
  ) {}

  /**
   * Enroll a student in a course (with transaction)
   */
  async create(
    studentId: number,
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<Enrollment> {
    return await this.dataSource.transaction(async (manager) => {
      // Verify course exists
      await this.coursesService.findOne(createEnrollmentDto.courseId);

      // Check if already enrolled
      const existingEnrollment = await manager.findOne(Enrollment, {
        where: {
          studentId,
          courseId: createEnrollmentDto.courseId,
        },
      });

      if (existingEnrollment) {
        throw new BadRequestException('Already enrolled in this course');
      }

      // Check enrollment limit (max 5 courses)
      const enrollmentCount = await manager.count(Enrollment, {
        where: { studentId },
      });

      if (enrollmentCount >= 5) {
        throw new BadRequestException('Cannot enroll in more than 5 courses');
      }

      // Create enrollment
      const enrollment = manager.create(Enrollment, {
        studentId,
        courseId: createEnrollmentDto.courseId,
      });

      return await manager.save(enrollment);
    });
  }

  /**
   * Get all enrollments for a student
   */
  async findByStudent(studentId: number): Promise<Enrollment[]> {
    return await this.enrollmentsRepository.find({
      where: { studentId },
      relations: ['course'],
      order: { enrolledAt: 'DESC' },
    });
  }

  /**
   * Get one enrollment by ID
   */
  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: { id },
      relations: ['student', 'course'],
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return enrollment;
  }

  /**
   * Update grade for an enrollment
   */
  async updateGrade(
    id: number,
    updateGradeDto: UpdateGradeDto,
  ): Promise<Enrollment> {
    const enrollment = await this.findOne(id);

    enrollment.grade = updateGradeDto.grade;
    return await this.enrollmentsRepository.save(enrollment);
  }

  /**
   * Drop a course (delete enrollment)
   */
  async remove(id: number, studentId: number): Promise<void> {
    const enrollment = await this.findOne(id);

    // Verify student owns this enrollment
    if (enrollment.studentId !== studentId) {
      throw new ForbiddenException('Cannot drop another student\'s enrollment');
    }

    // Don't allow dropping if grade is assigned
    if (enrollment.grade) {
      throw new BadRequestException('Cannot drop a completed course');
    }

    await this.enrollmentsRepository.remove(enrollment);
  }
}
