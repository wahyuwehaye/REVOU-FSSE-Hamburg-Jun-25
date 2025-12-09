import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, full_name, password, role = 'user', is_active = true } = createUserDto;

    const result = await this.dataSource.query(
      `INSERT INTO users (email, full_name, password, role, is_active) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [email, full_name, password, role, is_active],
    );

    return result[0];
  }

  async findAll(): Promise<User[]> {
    const users = await this.dataSource.query(
      `SELECT id, email, full_name, role, is_active, created_at, updated_at 
       FROM users 
       ORDER BY id ASC`,
    );

    return users;
  }

  async findOne(id: number): Promise<User> {
    const result = await this.dataSource.query(
      `SELECT id, email, full_name, role, is_active, created_at, updated_at 
       FROM users 
       WHERE id = $1`,
      [id],
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return result[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    await this.findOne(id);

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateUserDto.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(updateUserDto.email);
    }
    if (updateUserDto.full_name !== undefined) {
      fields.push(`full_name = $${paramIndex++}`);
      values.push(updateUserDto.full_name);
    }
    if (updateUserDto.password !== undefined) {
      fields.push(`password = $${paramIndex++}`);
      values.push(updateUserDto.password);
    }
    if (updateUserDto.role !== undefined) {
      fields.push(`role = $${paramIndex++}`);
      values.push(updateUserDto.role);
    }
    if (updateUserDto.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(updateUserDto.is_active);
    }

    if (fields.length === 0) {
      return this.findOne(id);
    }

    values.push(id);

    const result = await this.dataSource.query(
      `UPDATE users 
       SET ${fields.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      values,
    );

    return result[0];
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    await this.dataSource.query(`DELETE FROM users WHERE id = $1`, [id]);

    return { message: `User with ID ${id} has been deleted` };
  }
}
