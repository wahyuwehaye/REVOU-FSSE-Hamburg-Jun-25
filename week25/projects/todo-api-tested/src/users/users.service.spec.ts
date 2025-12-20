import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';

// Mock bcrypt
jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
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
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    it('should create a new user with hashed password', async () => {
      // ARRANGE
      const hashedPassword = 'hashedPassword123';
      mockRepository.findOne.mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      const createdUser = {
        id: 1,
        ...createUserDto,
        password: hashedPassword,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      // ACT
      const result = await service.create(createUserDto);

      // ASSERT
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(result.password).toBe(hashedPassword);
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw ConflictException when user already exists', async () => {
      // ARRANGE
      const existingUser = { id: 1, email: createUserDto.email };
      mockRepository.findOne.mockResolvedValue(existingUser);

      // ACT & ASSERT
      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should create user with default USER role', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      const createdUser = { ...createUserDto, role: UserRole.USER };
      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      // ACT
      const result = await service.create(createUserDto);

      // ASSERT
      expect(result.role).toBe(UserRole.USER);
    });

    it('should create user with ADMIN role when specified', async () => {
      // ARRANGE
      const adminDto = { ...createUserDto, role: UserRole.ADMIN };
      mockRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      const createdUser = { ...adminDto, role: UserRole.ADMIN };
      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      // ACT
      const result = await service.create(adminDto);

      // ASSERT
      expect(result.role).toBe(UserRole.ADMIN);
    });
  });

  describe('findAll', () => {
    it('should return array of users without passwords', async () => {
      // ARRANGE
      const users = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User 1',
          role: UserRole.USER,
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User 2',
          role: UserRole.ADMIN,
        },
      ];
      mockRepository.find.mockResolvedValue(users);

      // ACT
      const result = await service.findAll();

      // ASSERT
      expect(mockRepository.find).toHaveBeenCalledWith({
        select: ['id', 'email', 'name', 'role', 'createdAt'],
      });
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      // ARRANGE
      mockRepository.find.mockResolvedValue([]);

      // ACT
      const result = await service.findAll();

      // ASSERT
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      // ARRANGE
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
      };
      mockRepository.findOne.mockResolvedValue(user);

      // ACT
      const result = await service.findOne(1);

      // ASSERT
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'User with ID 999 not found',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      // ARRANGE
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };
      mockRepository.findOne.mockResolvedValue(user);

      // ACT
      const result = await service.findByEmail('test@example.com');

      // ASSERT
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT
      const result = await service.findByEmail('nonexistent@example.com');

      // ASSERT
      expect(result).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      // ARRANGE
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // ACT
      const result = await service.validatePassword(
        'password123',
        'hashedPassword',
      );

      // ASSERT
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword',
      );
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      // ARRANGE
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // ACT
      const result = await service.validatePassword(
        'wrongPassword',
        'hashedPassword',
      );

      // ASSERT
      expect(result).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      // ARRANGE
      const user = { id: 1, email: 'test@example.com', name: 'Test User' };
      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.remove.mockResolvedValue(user);

      // ACT
      await service.remove(1);

      // ASSERT
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException when deleting non-existent user', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
