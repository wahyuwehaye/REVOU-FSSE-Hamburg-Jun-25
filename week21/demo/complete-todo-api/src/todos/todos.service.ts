import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTodoDto, TodoPriority } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';

/**
 * Todo Entity Interface
 */
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  categoryId?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private currentId = 1;

  constructor() {
    // Seed some initial data
    this.seedData();
  }

  /**
   * Seed initial data for demonstration
   */
  private seedData() {
    const sampleTodos = [
      {
        title: 'Complete NestJS Tutorial',
        description: 'Learn all NestJS concepts for Week 21',
        completed: false,
        priority: TodoPriority.HIGH,
        categoryId: 1,
        tags: 'learning,nestjs',
      },
      {
        title: 'Build REST API',
        description: 'Create a complete REST API with CRUD operations',
        completed: false,
        priority: TodoPriority.URGENT,
        categoryId: 1,
        tags: 'project,api',
      },
      {
        title: 'Write Unit Tests',
        description: 'Add unit tests for all services',
        completed: false,
        priority: TodoPriority.MEDIUM,
        categoryId: 1,
        tags: 'testing',
      },
      {
        title: 'Review Pull Requests',
        description: 'Review PRs from team members',
        completed: true,
        priority: TodoPriority.LOW,
        categoryId: 2,
        tags: 'review,teamwork',
      },
      {
        title: 'Prepare Meeting Agenda',
        description: 'Prepare agenda for weekly team meeting',
        completed: true,
        priority: TodoPriority.MEDIUM,
        categoryId: 2,
        tags: 'meeting,planning',
      },
    ];

    sampleTodos.forEach((todo) => this.create(todo as CreateTodoDto));
  }

  /**
   * CREATE - Membuat todo baru / Create new todo
   */
  create(createTodoDto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: this.currentId++,
      title: createTodoDto.title,
      description: createTodoDto.description,
      completed: createTodoDto.completed ?? false,
      priority: createTodoDto.priority ?? TodoPriority.MEDIUM,
      categoryId: createTodoDto.categoryId,
      tags: createTodoDto.tags ? createTodoDto.tags.split(',').map(t => t.trim()) : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todos.push(todo);
    return todo;
  }

  /**
   * READ ALL - Mendapatkan semua todos dengan filtering, sorting, pagination
   * Get all todos with filtering, sorting, pagination
   */
  findAll(query: QueryTodoDto) {
    let filtered = [...this.todos];

    // 1. FILTERING
    if (query.completed !== undefined) {
      filtered = filtered.filter((todo) => todo.completed === query.completed);
    }

    if (query.priority) {
      filtered = filtered.filter((todo) => todo.priority === query.priority);
    }

    if (query.categoryId) {
      filtered = filtered.filter((todo) => todo.categoryId === query.categoryId);
    }

    if (query.tags) {
      filtered = filtered.filter((todo) =>
        todo.tags.some((tag) => tag.toLowerCase().includes(query.tags!.toLowerCase())),
      );
    }

    // 2. SEARCH
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description?.toLowerCase().includes(searchLower),
      );
    }

    // 3. SORTING
    if (query.sortBy) {
      const sortField = query.sortBy as keyof Todo;
      const order = query.order === 'desc' ? -1 : 1;

      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === undefined || bValue === undefined) return 0;

        if (aValue < bValue) return -1 * order;
        if (aValue > bValue) return 1 * order;
        return 0;
      });
    }

    // 4. PAGINATION
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedTodos = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedTodos,
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
        hasNextPage: endIndex < filtered.length,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * READ ONE - Mendapatkan satu todo berdasarkan ID / Get one todo by ID
   */
  findOne(id: number): Todo {
    const todo = this.todos.find((t) => t.id === id);

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  /**
   * UPDATE - Update todo / Update todo
   */
  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const todoIndex = this.todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    const existingTodo = this.todos[todoIndex];

    // Update tags if provided
    let updatedTags = existingTodo.tags;
    if (updateTodoDto.tags !== undefined) {
      updatedTags = updateTodoDto.tags
        ? updateTodoDto.tags.split(',').map(t => t.trim())
        : [];
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      ...updateTodoDto,
      tags: updatedTags,
      updatedAt: new Date(),
    };

    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  /**
   * DELETE - Hapus todo / Delete todo
   */
  remove(id: number): { message: string } {
    const todoIndex = this.todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    this.todos.splice(todoIndex, 1);
    return { message: `Todo with ID ${id} has been deleted successfully` };
  }

  /**
   * BULK DELETE - Hapus multiple todos / Delete multiple todos
   */
  bulkDelete(ids: number[]): { message: string; deletedCount: number } {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('No IDs provided for deletion');
    }

    let deletedCount = 0;
    ids.forEach((id) => {
      const index = this.todos.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.todos.splice(index, 1);
        deletedCount++;
      }
    });

    return {
      message: `Successfully deleted ${deletedCount} todo(s)`,
      deletedCount,
    };
  }

  /**
   * MARK AS COMPLETED - Tandai todo sebagai selesai / Mark todo as completed
   */
  markAsCompleted(id: number): Todo {
    return this.update(id, { completed: true });
  }

  /**
   * MARK AS INCOMPLETE - Tandai todo sebagai belum selesai / Mark todo as incomplete
   */
  markAsIncomplete(id: number): Todo {
    return this.update(id, { completed: false });
  }

  /**
   * GET TODOS BY CATEGORY - Dapatkan todos berdasarkan kategori
   */
  findByCategory(categoryId: number): Todo[] {
    return this.todos.filter((todo) => todo.categoryId === categoryId);
  }

  /**
   * GET STATISTICS - Dapatkan statistik todos
   */
  getStatistics() {
    const total = this.todos.length;
    const completed = this.todos.filter((t) => t.completed).length;
    const pending = total - completed;

    const byPriority = {
      low: this.todos.filter((t) => t.priority === TodoPriority.LOW).length,
      medium: this.todos.filter((t) => t.priority === TodoPriority.MEDIUM).length,
      high: this.todos.filter((t) => t.priority === TodoPriority.HIGH).length,
      urgent: this.todos.filter((t) => t.priority === TodoPriority.URGENT).length,
    };

    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) + '%' : '0%',
      byPriority,
    };
  }
}
