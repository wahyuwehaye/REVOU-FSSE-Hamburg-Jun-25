import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * Category Entity Interface
 */
export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  todoCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CategoriesService {
  private categories: Category[] = [];
  private currentId = 1;

  constructor() {
    // Seed initial categories
    this.seedData();
  }

  /**
   * Seed initial data
   */
  private seedData() {
    const sampleCategories = [
      {
        name: 'Work',
        description: 'Work-related tasks',
        color: '#3B82F6',
      },
      {
        name: 'Personal',
        description: 'Personal tasks and errands',
        color: '#10B981',
      },
      {
        name: 'Shopping',
        description: 'Shopping list items',
        color: '#F59E0B',
      },
      {
        name: 'Health',
        description: 'Health and fitness tasks',
        color: '#EF4444',
      },
    ];

    sampleCategories.forEach((cat) => this.create(cat as CreateCategoryDto));
  }

  /**
   * CREATE - Membuat kategori baru
   */
  create(createCategoryDto: CreateCategoryDto): Category {
    // Check if category name already exists
    const exists = this.categories.find(
      (cat) => cat.name.toLowerCase() === createCategoryDto.name.toLowerCase(),
    );

    if (exists) {
      throw new BadRequestException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }

    const category: Category = {
      id: this.currentId++,
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      color: createCategoryDto.color || this.generateRandomColor(),
      todoCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.categories.push(category);
    return category;
  }

  /**
   * READ ALL - Mendapatkan semua kategori
   */
  findAll(): Category[] {
    return this.categories;
  }

  /**
   * READ ONE - Mendapatkan satu kategori
   */
  findOne(id: number): Category {
    const category = this.categories.find((cat) => cat.id === id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * UPDATE - Update kategori
   */
  update(id: number, updateCategoryDto: UpdateCategoryDto): Category {
    const categoryIndex = this.categories.findIndex((cat) => cat.id === id);

    if (categoryIndex === -1) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if new name conflicts with existing category
    if (updateCategoryDto.name) {
      const nameExists = this.categories.find(
        (cat) =>
          cat.id !== id &&
          cat.name.toLowerCase() === updateCategoryDto.name!.toLowerCase(),
      );

      if (nameExists) {
        throw new BadRequestException(
          `Category with name "${updateCategoryDto.name}" already exists`,
        );
      }
    }

    const existingCategory = this.categories[categoryIndex];
    const updatedCategory: Category = {
      ...existingCategory,
      ...updateCategoryDto,
      updatedAt: new Date(),
    };

    this.categories[categoryIndex] = updatedCategory;
    return updatedCategory;
  }

  /**
   * DELETE - Hapus kategori
   */
  remove(id: number): { message: string } {
    const categoryIndex = this.categories.findIndex((cat) => cat.id === id);

    if (categoryIndex === -1) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const category = this.categories[categoryIndex];

    // Check if category has todos
    if (category.todoCount > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}" because it has ${category.todoCount} todo(s). Please remove or reassign the todos first.`,
      );
    }

    this.categories.splice(categoryIndex, 1);
    return {
      message: `Category "${category.name}" has been deleted successfully`,
    };
  }

  /**
   * UPDATE TODO COUNT - Update jumlah todos dalam kategori
   * This should be called by TodosService when todos are created/deleted
   */
  updateTodoCount(categoryId: number, count: number): void {
    const category = this.categories.find((cat) => cat.id === categoryId);
    if (category) {
      category.todoCount = count;
    }
  }

  /**
   * GENERATE RANDOM COLOR - Generate warna random untuk kategori
   */
  private generateRandomColor(): string {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Orange
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#14B8A6', // Teal
      '#F97316', // Orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * GET STATISTICS - Dapatkan statistik kategori
   */
  getStatistics() {
    const total = this.categories.length;
    const withTodos = this.categories.filter((cat) => cat.todoCount > 0).length;
    const empty = total - withTodos;
    const totalTodos = this.categories.reduce((sum, cat) => sum + cat.todoCount, 0);

    return {
      totalCategories: total,
      categoriesWithTodos: withTodos,
      emptyCategories: empty,
      totalTodos,
      averageTodosPerCategory:
        total > 0 ? (totalTodos / total).toFixed(2) : '0',
    };
  }
}
