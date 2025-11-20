# Chapter 20: Documenting Endpoints with Decorators

## 📚 Daftar Isi
- [Swagger/OpenAPI in NestJS](#swaggeropenapi-in-nestjs)
- [Setup Swagger](#setup-swagger)
- [Common Decorators](#common-decorators)
- [Advanced Documentation](#advanced-documentation)

---

## Swagger/OpenAPI in NestJS

**Swagger** adalah tool untuk membuat interactive API documentation yang di-generate otomatis dari code.

### Benefits:
- ✅ Auto-generated dari decorators
- ✅ Interactive UI untuk test API
- ✅ Always up-to-date dengan code
- ✅ Generate Postman collection
- ✅ Generate client SDKs

### What It Looks Like:

```
┌─────────────────────────────────────────────┐
│  API Documentation                           │
├─────────────────────────────────────────────┤
│  Users                                       │
│  ├─ POST /users     Create user       [Try] │
│  ├─ GET /users      Get all users     [Try] │
│  ├─ GET /users/:id  Get user by ID    [Try] │
│  └─ DELETE /users/:id Delete user     [Try] │
│                                              │
│  Products                                    │
│  ├─ POST /products  Create product    [Try] │
│  └─ GET /products   Get all products  [Try] │
└─────────────────────────────────────────────┘
```

Click [Try] button → Test endpoint directly in browser!

---

## Setup Swagger

### Step 1: Install Dependencies

```bash
npm install --save @nestjs/swagger swagger-ui-express
```

### Step 2: Configure in main.ts

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('Complete CRUD API with NestJS')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('products', 'Product management endpoints')
    .addBearerAuth() // If using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  
  console.log('API running on: http://localhost:3000');
  console.log('Swagger docs: http://localhost:3000/api/docs');
}

bootstrap();
```

### Step 3: Access Documentation

```
Start your app:
npm run start:dev

Open browser:
http://localhost:3000/api/docs

You'll see Swagger UI with all your endpoints!
```

---

## Common Decorators

### 1. @ApiTags()
Group endpoints by category.

```typescript
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users') // Shows in "Users" section
@Controller('users')
export class UsersController {
  // All methods here will be under "Users" tag
}
```

### 2. @ApiOperation()
Describe what the endpoint does.

```typescript
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  @Post()
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Creates a new user account with email and password. Email must be unique.'
  })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

### 3. @ApiResponse()
Document possible responses.

```typescript
import { ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  @Post()
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created',
    type: User // Shows User schema in response
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation failed'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email already exists'
  })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

### 4. @ApiProperty() in DTOs
Document DTO properties.

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'SecurePass123!',
    minLength: 8,
    required: true
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false
  })
  @IsString()
  name?: string;
}
```

### 5. @ApiParam()
Document path parameters.

```typescript
import { ApiParam } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 1,
    type: Number
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
```

### 6. @ApiQuery()
Document query parameters.

```typescript
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.usersService.findAll({ page, limit });
  }
}
```

### 7. @ApiBody()
Document request body.

```typescript
import { ApiBody } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  @Post()
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data',
    examples: {
      basic: {
        summary: 'Basic user',
        value: {
          email: 'john@example.com',
          password: 'SecurePass123!'
        }
      },
      complete: {
        summary: 'Complete profile',
        value: {
          email: 'john@example.com',
          password: 'SecurePass123!',
          name: 'John Doe',
          phone: '+6281234567890'
        }
      }
    }
  })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

### 8. @ApiBearerAuth()
Document authentication requirement.

```typescript
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('profile')
@ApiBearerAuth() // Requires Bearer token
export class ProfileController {
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
```

---

## Advanced Documentation

### Complete Example: Users Controller

```typescript
// users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create user',
    description: 'Create a new user account with email and password'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: User
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email already exists'
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number,
    description: 'Page number (default: 1)'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number,
    description: 'Items per page (default: 10)'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name or email'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users',
    type: [User]
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll({ page, limit, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: Number,
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    type: User
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Update user information (requires authentication)'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: Number
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated',
    type: User
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete user',
    description: 'Permanently delete user account (requires authentication)'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
```

### Documenting Entities

```typescript
// entities/user.entity.ts
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'User unique identifier',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false
  })
  name?: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
}
```

### Documenting Enums

```typescript
// dto/create-task.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete documentation'
  })
  title: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    enumName: 'TaskStatus',
    example: TaskStatus.TODO,
    default: TaskStatus.TODO
  })
  status: TaskStatus;
}
```

---

## Swagger Configuration Options

### Custom Theme & Styling

```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('My Awesome API')
  .setDescription('The best API ever created')
  .setVersion('2.0')
  .setTermsOfService('https://example.com/terms')
  .setContact(
    'API Support',
    'https://example.com/support',
    'support@example.com'
  )
  .setLicense(
    'MIT',
    'https://opensource.org/licenses/MIT'
  )
  .addServer('http://localhost:3000', 'Development')
  .addServer('https://api.example.com', 'Production')
  .addBearerAuth()
  .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' })
  .build();

const document = SwaggerModule.createDocument(app, config);

SwaggerModule.setup('api/docs', app, document, {
  customSiteTitle: 'My API Docs',
  customfavIcon: 'https://example.com/favicon.ico',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true, // Keep auth token after refresh
    docExpansion: 'none', // Collapse all by default
    filter: true, // Enable search
    showRequestDuration: true, // Show request time
  },
});
```

---

## Export Swagger JSON

### Generate OpenAPI JSON

```typescript
// After creating document
const document = SwaggerModule.createDocument(app, config);

// Write to file
import { writeFileSync } from 'fs';
writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
```

### Use in Postman

```
1. Generate swagger.json
2. Open Postman
3. Import → Link or JSON
4. Paste swagger.json content
5. ✅ All endpoints imported!
```

---

## Summary

✅ **@ApiTags()** - Group endpoints
✅ **@ApiOperation()** - Describe endpoint
✅ **@ApiResponse()** - Document responses
✅ **@ApiProperty()** - Document DTO fields
✅ **@ApiParam()** - Document path params
✅ **@ApiQuery()** - Document query params
✅ **@ApiBearerAuth()** - Require authentication

**Workflow:**
1. Add decorators to controllers/DTOs
2. Start app
3. Open http://localhost:3000/api/docs
4. ✅ Documentation auto-generated!

**Next:** API Documentation Best Practices! 🚀
