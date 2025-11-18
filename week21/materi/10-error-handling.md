# Error Handling in NestJS

## Built-in HTTP Exceptions

NestJS provides built-in HTTP exception classes:

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
```

## Common HTTP Exceptions

### 1. BadRequestException (400)

```typescript
@Post()
create(@Body() createUserDto: CreateUserDto) {
  if (!createUserDto.email) {
    throw new BadRequestException('Email is required');
  }
  return this.usersService.create(createUserDto);
}
```

### 2. UnauthorizedException (401)

```typescript
@Post('login')
login(@Body() loginDto: LoginDto) {
  const user = this.authService.validateUser(loginDto);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }
  return user;
}
```

### 3. NotFoundException (404)

```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  const user = this.usersService.findOne(id);
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return user;
}
```

### 4. ForbiddenException (403)

```typescript
@Delete(':id')
remove(@Param('id') id: string, @Request() req) {
  if (req.user.role !== 'admin') {
    throw new ForbiddenException('Only admins can delete users');
  }
  return this.usersService.remove(id);
}
```

### 5. ConflictException (409)

```typescript
@Post()
async create(@Body() createUserDto: CreateUserDto) {
  const existingUser = await this.usersService.findByEmail(createUserDto.email);
  if (existingUser) {
    throw new ConflictException('Email already exists');
  }
  return this.usersService.create(createUserDto);
}
```

## Exception with Custom Response

```typescript
throw new NotFoundException({
  statusCode: 404,
  message: 'User not found',
  error: 'Not Found',
  timestamp: new Date().toISOString(),
  path: '/users/123',
});
```

## Try-Catch Pattern

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  try {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Something went wrong');
  }
}
```

## Custom Exception Filters

### Create Custom Filter

```typescript
// filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```

### Apply Filter Globally

```typescript
// main.ts
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

### Apply Filter to Controller

```typescript
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  // ...
}
```

## Custom Exceptions

```typescript
// exceptions/user-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}

// Usage
throw new UserNotFoundException('123');
```

## Validation Error Handling

Validation errors are automatically handled by ValidationPipe:

```bash
# Request
POST /users
{
  "name": "Jo",
  "email": "invalid"
}

# Response
{
  "statusCode": 400,
  "message": [
    "name must be at least 3 characters",
    "email must be a valid email"
  ],
  "error": "Bad Request"
}
```

## Complete Service with Error Handling

```typescript
@Injectable()
export class UsersService {
  private users = [];

  async findAll() {
    try {
      return this.users;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = this.users.find((u) => u.email === createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      const newUser = {
        id: Date.now().toString(),
        ...createUserDto,
      };
      this.users.push(newUser);
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      this.users[index] = {
        ...this.users[index],
        ...updateUserDto,
      };
      return this.users[index];
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      this.users.splice(index, 1);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
```

## Best Practices

1. ✅ Use appropriate HTTP status codes
2. ✅ Provide meaningful error messages
3. ✅ Always validate user input
4. ✅ Use try-catch for database operations
5. ✅ Don't expose sensitive information in errors
6. ✅ Log errors for debugging
7. ✅ Create custom exceptions for domain-specific errors
8. ✅ Use exception filters for consistent error responses

## Testing Error Handling

```bash
# Test NotFoundException
curl http://localhost:3000/users/999

# Test ConflictException
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"existing@email.com"}'

# Test ValidationException
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jo"}'
```

## Next Steps

- Implement logging
- Add error monitoring
- Create domain-specific exceptions
- Add error analytics
