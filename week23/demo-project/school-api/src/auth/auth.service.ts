import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentsService } from '../students/students.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private studentsService: StudentsService,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new student
   */
  async register(registerDto: RegisterDto) {
    const student = await this.studentsService.create(registerDto);
    
    // Generate token immediately after registration
    const payload = { email: student.email, sub: student.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        age: student.age,
      },
    };
  }

  /**
   * Login with email and password
   */
  async login(loginDto: LoginDto) {
    const student = await this.validateStudent(
      loginDto.email,
      loginDto.password,
    );

    const payload = { email: student.email, sub: student.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
    };
  }

  /**
   * Validate student credentials
   */
  async validateStudent(email: string, password: string): Promise<any> {
    const student = await this.studentsService.findByEmail(email);

    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return student;
  }

  /**
   * Get profile from token
   */
  async getProfile(userId: number) {
    return await this.studentsService.findOne(userId);
  }
}
