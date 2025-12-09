import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, status = 'pending', priority = 'medium', user_id } = createTaskDto;

    const result = await this.dataSource.query(
      `INSERT INTO tasks (title, description, status, priority, user_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [title, description, status, priority, user_id],
    );

    return result[0];
  }

  async findAll(filters?: { search?: string; status?: string; priority?: string; user_id?: number }): Promise<Task[]> {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters?.search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.priority) {
      query += ` AND priority = $${paramIndex}`;
      params.push(filters.priority);
      paramIndex++;
    }

    if (filters?.user_id) {
      query += ` AND user_id = $${paramIndex}`;
      params.push(filters.user_id);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    return await this.dataSource.query(query, params);
  }

  async findOne(id: number): Promise<Task> {
    const result = await this.dataSource.query(
      `SELECT t.*, 
              u.id as user_id, u.email as user_email, u.full_name as user_name
       FROM tasks t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = $1`,
      [id],
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const task = result[0];
    return {
      ...task,
      user: {
        id: task.user_id,
        email: task.user_email,
        full_name: task.user_name,
      },
    };
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id);

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateTaskDto.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updateTaskDto.title);
    }
    if (updateTaskDto.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(updateTaskDto.description);
    }
    if (updateTaskDto.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updateTaskDto.status);
    }
    if (updateTaskDto.priority !== undefined) {
      fields.push(`priority = $${paramIndex++}`);
      values.push(updateTaskDto.priority);
    }
    if (updateTaskDto.user_id !== undefined) {
      fields.push(`user_id = $${paramIndex++}`);
      values.push(updateTaskDto.user_id);
    }

    if (fields.length === 0) {
      return this.findOne(id);
    }

    values.push(id);

    const result = await this.dataSource.query(
      `UPDATE tasks 
       SET ${fields.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      values,
    );

    return result[0];
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    await this.dataSource.query(`DELETE FROM tasks WHERE id = $1`, [id]);

    return { message: `Task with ID ${id} has been deleted` };
  }

  async getStatistics(): Promise<any> {
    const result = await this.dataSource.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority,
        SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) as medium_priority,
        SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) as low_priority
      FROM tasks
    `);

    const stats = result[0];

    return {
      total: parseInt(stats.total),
      pending: parseInt(stats.pending),
      in_progress: parseInt(stats.in_progress),
      completed: parseInt(stats.completed),
      by_priority: {
        high: parseInt(stats.high_priority),
        medium: parseInt(stats.medium_priority),
        low: parseInt(stats.low_priority),
      },
    };
  }
}
