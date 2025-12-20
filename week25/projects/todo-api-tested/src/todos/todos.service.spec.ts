import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';

describe('TodosService', () => {
  let service: TodosService;
  let mockRepository: jest.Mocked<any>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTodoDto = {
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
    };
    const userId = 1;

    it('should create a new todo', async () => {
      // ARRANGE
      const createdTodo = {
        id: 1,
        ...createTodoDto,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(createdTodo);
      mockRepository.save.mockResolvedValue(createdTodo);

      // ACT
      const result = await service.create(createTodoDto, userId);

      // ASSERT
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createTodoDto,
        userId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdTodo);
      expect(result.title).toBe(createTodoDto.title);
      expect(result.userId).toBe(userId);
    });

    it('should create todo with default completed status false', async () => {
      // ARRANGE
      const dto = { title: 'New Todo', description: 'Desc' };
      const created = { ...dto, userId, completed: false };
      mockRepository.create.mockReturnValue(created);
      mockRepository.save.mockResolvedValue(created);

      // ACT
      const result = await service.create(dto as any, userId);

      // ASSERT
      expect(result.completed).toBe(false);
    });
  });

  describe('findAll', () => {
    const userId = 1;

    it('should return array of todos for specific user', async () => {
      // ARRANGE
      const todos = [
        { id: 1, title: 'Todo 1', userId, completed: false },
        { id: 2, title: 'Todo 2', userId, completed: true },
      ];
      mockRepository.find.mockResolvedValue(todos);

      // ACT
      const result = await service.findAll(userId);

      // ASSERT
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(todos);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no todos', async () => {
      // ARRANGE
      mockRepository.find.mockResolvedValue([]);

      // ACT
      const result = await service.findAll(userId);

      // ASSERT
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should only return todos for specified user', async () => {
      // ARRANGE
      const user1Todos = [{ id: 1, title: 'User 1 Todo', userId: 1 }];
      mockRepository.find.mockResolvedValue(user1Todos);

      // ACT
      await service.findAll(1);

      // ASSERT
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    const userId = 1;
    const todoId = 1;

    it('should return a todo when found', async () => {
      // ARRANGE
      const todo = {
        id: todoId,
        title: 'Test Todo',
        userId,
        completed: false,
      };
      mockRepository.findOne.mockResolvedValue(todo);

      // ACT
      const result = await service.findOne(todoId, userId);

      // ASSERT
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: todoId, userId },
      });
      expect(result).toEqual(todo);
    });

    it('should throw NotFoundException when todo not found', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.findOne(999, userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(999, userId)).rejects.toThrow(
        'Todo with ID 999 not found',
      );
    });

    it('should throw NotFoundException when todo belongs to different user', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.findOne(todoId, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const userId = 1;
    const todoId = 1;
    const updateTodoDto = {
      title: 'Updated Title',
      completed: true,
    };

    it('should update a todo successfully', async () => {
      // ARRANGE
      const existingTodo = {
        id: todoId,
        title: 'Old Title',
        userId,
        completed: false,
      };
      const updatedTodo = { ...existingTodo, ...updateTodoDto };
      mockRepository.findOne.mockResolvedValue(existingTodo);
      mockRepository.save.mockResolvedValue(updatedTodo);

      // ACT
      const result = await service.update(todoId, updateTodoDto, userId);

      // ASSERT
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: todoId, userId },
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.title).toBe(updateTodoDto.title);
      expect(result.completed).toBe(updateTodoDto.completed);
    });

    it('should throw NotFoundException when todo not found', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.update(999, updateTodoDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should allow partial updates', async () => {
      // ARRANGE
      const existingTodo = {
        id: todoId,
        title: 'Original Title',
        description: 'Original Desc',
        userId,
        completed: false,
      };
      const partialUpdate = { completed: true };
      mockRepository.findOne.mockResolvedValue(existingTodo);
      mockRepository.save.mockResolvedValue({
        ...existingTodo,
        ...partialUpdate,
      });

      // ACT
      const result = await service.update(todoId, partialUpdate, userId);

      // ASSERT
      expect(result.title).toBe('Original Title');
      expect(result.completed).toBe(true);
    });
  });

  describe('remove', () => {
    const userId = 1;
    const todoId = 1;

    it('should delete todo successfully', async () => {
      // ARRANGE
      const todo = { id: todoId, title: 'Test Todo', userId };
      mockRepository.findOne.mockResolvedValue(todo);
      mockRepository.remove.mockResolvedValue(todo);

      // ACT
      await service.remove(todoId, userId);

      // ASSERT
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: todoId, userId },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(todo);
    });

    it('should throw NotFoundException when todo not found', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.remove(999, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });

    it('should not allow deleting other users todos', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.remove(todoId, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleComplete', () => {
    const userId = 1;
    const todoId = 1;

    it('should toggle todo from incomplete to complete', async () => {
      // ARRANGE
      const todo = {
        id: todoId,
        title: 'Test Todo',
        userId,
        completed: false,
      };
      mockRepository.findOne.mockResolvedValue(todo);
      mockRepository.save.mockResolvedValue({ ...todo, completed: true });

      // ACT
      const result = await service.toggleComplete(todoId, userId);

      // ASSERT
      expect(result.completed).toBe(true);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should toggle todo from complete to incomplete', async () => {
      // ARRANGE
      const todo = {
        id: todoId,
        title: 'Test Todo',
        userId,
        completed: true,
      };
      mockRepository.findOne.mockResolvedValue(todo);
      mockRepository.save.mockResolvedValue({ ...todo, completed: false });

      // ACT
      const result = await service.toggleComplete(todoId, userId);

      // ASSERT
      expect(result.completed).toBe(false);
    });

    it('should throw NotFoundException when todo not found', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.toggleComplete(999, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
