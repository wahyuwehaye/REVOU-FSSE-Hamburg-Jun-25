# Testing Guards and Pipes - Security Testing

## �� Apa itu Guards dan Pipes?

**Analogi Sederhana:**
- **Guard** 🛡️ = Security guard di depan klub (cek ID, umur, dress code)
- **Pipe** 🚰 = Saringan air (buang kotoran, cuma lewatin yang bersih)

```
Request → Guard → Pipe → Controller → Service
          ↓       ↓
       (Cek ID)  (Validasi data)
```

---

## 🛡️ Authentication Guard Testing

### What is Authentication Guard?

Guard = Gatekeeper yang jawab: **"Apakah user ini boleh masuk?"**

**Guard Code:**
```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
```

**Test Code:**
```typescript
// jwt-auth.guard.spec.ts
describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should return user when authentication succeeds', () => {
      const mockUser = { id: 1, email: 'test@email.com' };
      
      const result = guard.handleRequest(null, mockUser, null);
      
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is null', () => {
      expect(() => guard.handleRequest(null, null, null)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when error occurs', () => {
      const error = new Error('Token expired');
      
      expect(() => guard.handleRequest(error, null, null)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
```

---

## 🔐 Authorization Guard Testing (Roles)

### RolesGuard Implementation

```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

**Test Code:**
```typescript
// roles.guard.spec.ts
describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const createMockContext = (user: any, roles: string[] = []) => {
    const mockRequest = { user };
    
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => ({}),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(roles);

    return context;
  };

  it('should allow access when no roles required', () => {
    const context = createMockContext({ id: 1 }, undefined);
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when user has required role', () => {
    const user = { id: 1, roles: ['admin', 'user'] };
    const context = createMockContext(user, ['admin']);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access when user lacks required role', () => {
    const user = { id: 1, roles: ['user'] };
    const context = createMockContext(user, ['admin']);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw UnauthorizedException when user not authenticated', () => {
    const context = createMockContext(null, ['admin']);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should allow access when user has ANY of the required roles', () => {
    const user = { id: 1, roles: ['moderator'] };
    const context = createMockContext(user, ['admin', 'moderator']);

    expect(guard.canActivate(context)).toBe(true);
  });
});
```

---

## 🚰 Validation Pipe Testing

### What is Validation Pipe?

Pipe = Filter yang validasi dan transform data **sebelum masuk controller**.

**DTO (Data Transfer Object):**
```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain uppercase and number',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
}
```

**Test Code:**
```typescript
// create-user.dto.spec.ts
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = plainToClass(CreateUserDto, {
      email: 'test@example.com',
      password: 'Password123',
      name: 'John Doe',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when email is invalid', async () => {
    const dto = plainToClass(CreateUserDto, {
      email: 'invalid-email',
      password: 'Password123',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail when email is empty', async () => {
    const dto = plainToClass(CreateUserDto, {
      email: '',
      password: 'Password123',
    });

    const errors = await validate(dto);
    expect(errors[0].property).toBe('email');
  });

  it('should fail when password is too short', async () => {
    const dto = plainToClass(CreateUserDto, {
      email: 'test@example.com',
      password: 'Pass1',
    });

    const errors = await validate(dto);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should fail when password has no uppercase letter', async () => {
    const dto = plainToClass(CreateUserDto, {
      email: 'test@example.com',
      password: 'password123',
    });

    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should fail when password has no number', async () => {
    const dto = plainToClass(CreateUserDto, {
      email: 'test@example.com',
      password: 'PasswordABC',
    });

    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should pass when optional name is not provided', async () => {
    const dto = plainToClass(CreateUserDto, {
      email: 'test@example.com',
      password: 'Password123',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
```

---

## 🧪 Custom Pipe Testing

### Custom Transform Pipe

```typescript
// trim.pipe.ts
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.trim();
    }
    
    if (typeof value === 'object') {
      Object.keys(value).forEach((key) => {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      });
    }
    
    return value;
  }
}
```

**Test Code:**
```typescript
// trim.pipe.spec.ts
describe('TrimPipe', () => {
  let pipe: TrimPipe;

  beforeEach(() => {
    pipe = new TrimPipe();
  });

  it('should trim string', () => {
    expect(pipe.transform('  hello  ')).toBe('hello');
    expect(pipe.transform('world  ')).toBe('world');
    expect(pipe.transform('  test')).toBe('test');
  });

  it('should trim object properties', () => {
    const input = {
      name: '  John  ',
      email: 'john@email.com  ',
    };

    const result = pipe.transform(input);

    expect(result.name).toBe('John');
    expect(result.email).toBe('john@email.com');
  });

  it('should return non-string values unchanged', () => {
    expect(pipe.transform(123)).toBe(123);
    expect(pipe.transform(true)).toBe(true);
    expect(pipe.transform(null)).toBe(null);
  });
});
```

---

## 🎯 Integration Testing with Guards and Pipes

```typescript
describe('UserController (with guards and pipes)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should reject invalid email', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'invalid-email',
        password: 'Password123',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('email must be an email');
      });
  });

  it('should reject weak password', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'test@example.com',
        password: 'weak',
      })
      .expect(400);
  });
});
```

---

## 📝 Summary

**Guards:**
- 🛡️ Control **access** to routes
- ✅ Test with different user roles
- ✅ Test authentication success/failure

**Pipes:**
- 🚰 **Validate** and **transform** data
- ✅ Test with valid/invalid data
- ✅ Test edge cases (empty, null, special chars)

**Security Testing:**
- ✅ Test unauthorized access
- ✅ Test insufficient permissions
- ✅ Test malformed data
- ✅ Test SQL injection attempts
- ✅ Test XSS attempts

---

## 🔗 Next Steps
- **Materi 07:** Database Testing Strategies
- **Materi 08:** Testing Async Operations
