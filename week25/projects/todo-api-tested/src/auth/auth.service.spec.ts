import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      validatePassword: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const createUserDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    it('should register a new user and return auth response', async () => {
      // ARRANGE
      const createdUser = {
        id: 1,
        ...createUserDto,
        role: UserRole.USER,
        todos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersService.create.mockResolvedValue(createdUser as any);
      jwtService.sign.mockReturnValue('jwt-token-123');

      // ACT
      const result = await service.register(createUserDto);

      // ASSERT
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: createdUser.email,
        sub: createdUser.id,
        role: createdUser.role,
      });
      expect(result).toEqual({
        access_token: 'jwt-token-123',
        user: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          role: createdUser.role,
        },
      });
    });

    it('should propagate errors from users service', async () => {
      // ARRANGE
      usersService.create.mockRejectedValue(new Error('User already exists'));

      // ACT & ASSERT
      await expect(service.register(createUserDto)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user with valid credentials', async () => {
      // ARRANGE
      const user = {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
        password: 'hashedPassword',
        role: UserRole.USER,
      };

      usersService.findByEmail.mockResolvedValue(user as any);
      usersService.validatePassword.mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token-123');

      // ACT
      const result = await service.login(loginDto);

      // ASSERT
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(usersService.validatePassword).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(result).toEqual({
        access_token: 'jwt-token-123',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      // ARRANGE
      usersService.findByEmail.mockResolvedValue(null as any);

      // ACT & ASSERT
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      // ARRANGE
      const user = {
        id: 1,
        email: loginDto.email,
        password: 'hashedPassword',
      };

      usersService.findByEmail.mockResolvedValue(user as any);
      usersService.validatePassword.mockResolvedValue(false);

      // ACT & ASSERT
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('validateUser', () => {
    it('should return user without password for valid credentials', async () => {
      // ARRANGE
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        role: UserRole.USER,
      };

      usersService.findByEmail.mockResolvedValue(user as any);
      usersService.validatePassword.mockResolvedValue(true);

      // ACT
      const result = await service.validateUser(user.email, 'password123');

      // ASSERT
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      expect(result.password).toBeUndefined();
    });

    it('should return null when user not found', async () => {
      // ARRANGE
      usersService.findByEmail.mockResolvedValue(null as any);

      // ACT
      const result = await service.validateUser(
        'nonexistent@example.com',
        'password',
      );

      // ASSERT
      expect(result).toBeNull();
      expect(usersService.validatePassword).not.toHaveBeenCalled();
    });

    it('should return null for invalid password', async () => {
      // ARRANGE
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      usersService.findByEmail.mockResolvedValue(user as any);
      usersService.validatePassword.mockResolvedValue(false);

      // ACT
      const result = await service.validateUser(user.email, 'wrongPassword');

      // ASSERT
      expect(result).toBeNull();
    });
  });
});
