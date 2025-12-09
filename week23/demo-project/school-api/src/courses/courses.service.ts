import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  /**
   * Create a new course
   */
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.coursesRepository.create(createCourseDto);
    return await this.coursesRepository.save(course);
  }

  /**
   * Find all courses with enrollment count
   */
  async findAll(): Promise<any[]> {
    return await this.coursesRepository
      .createQueryBuilder('course')
      .leftJoin('course.enrollments', 'enrollment')
      .select([
        'course.id',
        'course.title',
        'course.description',
        'course.credits',
        'course.instructor',
      ])
      .addSelect('COUNT(enrollment.id)', 'enrollmentCount')
      .groupBy('course.id')
      .getRawMany();
  }

  /**
   * Find one course by ID
   */
  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  /**
   * Get course with enrolled students
   */
  async findOneWithStudents(id: number) {
    const course = await this.coursesRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.enrollments', 'enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .where('course.id = :id', { id })
      .getOne();

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Transform data for cleaner response
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      credits: course.credits,
      instructor: course.instructor,
      students: course.enrollments.map((e) => ({
        id: e.student.id,
        name: e.student.name,
        email: e.student.email,
        grade: e.grade,
        enrolledAt: e.enrolledAt,
      })),
    };
  }

  /**
   * Get course statistics
   */
  async getStatistics(id: number) {
    await this.findOne(id); // Ensure course exists

    const stats = await this.coursesRepository
      .createQueryBuilder('course')
      .leftJoin('course.enrollments', 'enrollment')
      .select('COUNT(DISTINCT enrollment.studentId)', 'totalStudents')
      .addSelect(
        "COUNT(CASE WHEN enrollment.grade IS NOT NULL THEN 1 END)",
        'completedStudents',
      )
      .where('course.id = :id', { id })
      .getRawOne();

    // Grade distribution
    const grades = await this.coursesRepository
      .createQueryBuilder('course')
      .leftJoin('course.enrollments', 'enrollment')
      .select('enrollment.grade', 'grade')
      .addSelect('COUNT(*)', 'count')
      .where('course.id = :id', { id })
      .andWhere('enrollment.grade IS NOT NULL')
      .groupBy('enrollment.grade')
      .getRawMany();

    const gradeDistribution = {};
    grades.forEach((g) => {
      gradeDistribution[g.grade] = parseInt(g.count);
    });

    const totalStudents = parseInt(stats.totalStudents) || 0;
    const completedStudents = parseInt(stats.completedStudents) || 0;
    const passRate =
      totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;

    return {
      totalStudents,
      completedStudents,
      gradeDistribution,
      passRate: parseFloat(passRate.toFixed(2)),
    };
  }

  /**
   * Update course
   */
  async update(id: number, updateCourseDto: Partial<CreateCourseDto>): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return await this.coursesRepository.save(course);
  }

  /**
   * Delete course
   */
  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.coursesRepository.remove(course);
  }
}
