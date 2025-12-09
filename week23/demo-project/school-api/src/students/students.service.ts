import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  /**
   * Create a new student
   */
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check if email already exists
    const existingStudent = await this.studentsRepository.findOne({
      where: { email: createStudentDto.email },
    });

    if (existingStudent) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    // Create student
    const student = this.studentsRepository.create({
      ...createStudentDto,
      password: hashedPassword,
    });

    return await this.studentsRepository.save(student);
  }

  /**
   * Find all students with pagination and search
   */
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const query = this.studentsRepository.createQueryBuilder('student');

    // Search by name or email
    if (search) {
      query.where(
        'student.name ILIKE :search OR student.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    // Pagination
    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('student.enrolledAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find one student by ID with enrollments
   */
  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['enrollments', 'enrollments.course'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  /**
   * Find student by email (for authentication)
   */
  async findByEmail(email: string): Promise<Student | null> {
    return await this.studentsRepository.findOne({
      where: { email },
    });
  }

  /**
   * Update student
   */
  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);

    // If password is being updated, hash it
    if (updateStudentDto.password) {
      updateStudentDto.password = await bcrypt.hash(updateStudentDto.password, 10);
    }

    Object.assign(student, updateStudentDto);
    return await this.studentsRepository.save(student);
  }

  /**
   * Delete student
   */
  async remove(id: number): Promise<void> {
    const student = await this.findOne(id);
    await this.studentsRepository.remove(student);
  }

  /**
   * Get student statistics
   */
  async getStatistics(id: number) {
    const student = await this.findOne(id);

    const stats = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoin('student.enrollments', 'enrollment')
      .leftJoin('enrollment.course', 'course')
      .select('COUNT(DISTINCT enrollment.id)', 'totalCourses')
      .addSelect('SUM(course.credits)', 'totalCredits')
      .addSelect(
        "COUNT(CASE WHEN enrollment.grade IS NOT NULL THEN 1 END)",
        'completedCourses',
      )
      .where('student.id = :id', { id })
      .getRawOne();

    // Calculate grade distribution
    const grades = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoin('student.enrollments', 'enrollment')
      .select('enrollment.grade', 'grade')
      .addSelect('COUNT(*)', 'count')
      .where('student.id = :id', { id })
      .andWhere('enrollment.grade IS NOT NULL')
      .groupBy('enrollment.grade')
      .getRawMany();

    const gradeDistribution = {};
    grades.forEach((g) => {
      gradeDistribution[g.grade] = parseInt(g.count);
    });

    return {
      totalCourses: parseInt(stats.totalCourses) || 0,
      completedCourses: parseInt(stats.completedCourses) || 0,
      inProgressCourses:
        parseInt(stats.totalCourses) - parseInt(stats.completedCourses) || 0,
      totalCredits: parseInt(stats.totalCredits) || 0,
      gradeDistribution,
    };
  }
}
