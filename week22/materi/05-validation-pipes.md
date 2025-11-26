# Chapter 5: Validation Pipes - Mekanisme Validasi NestJS

## 🎯 Apa itu Pipes?

**Pipes** adalah class yang mengimplementasikan interface `PipeTransform`. Pipes memiliki **dua use case** utama:

1. **Transformation** - Transform input data ke format yang diinginkan
2. **Validation** - Validasi input data, throw exception jika invalid

## 📊 Flow Validasi dengan Pipes

```
HTTP REQUEST
    ↓
[Raw JSON]
    ↓
┌─────────────────────┐
│     PIPES           │
│  • Parse           │
│  • Transform       │
│  • Validate        │
└──────────┬──────────┘
           │
    ✅ Valid? → Continue
    ❌ Invalid? → Throw Exception
           │
           ↓
┌─────────────────────┐
│   CONTROLLER        │
│   Method Handler    │
└─────────────────────┘
```

## 🔧 Built-in Pipes

NestJS menyediakan 9 built-in pipes:

### 1. ValidationPipe

Validasi berdasarkan DTO decorators

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
}
```

### 2. ParseIntPipe

Transform string ke integer

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // id is guaranteed to be a number
  console.log(typeof id); // "number"
  return this.usersService.findOne(id);
}

// Test
// GET /users/123   ✅ Works
// GET /users/abc   ❌ 400 Bad Request: "Validation failed (numeric string is expected)"
```

### 3. ParseBoolPipe

Transform string ke boolean

```typescript
@Get()
findAll(@Query('active', ParseBoolPipe) active: boolean) {
  console.log(typeof active); // "boolean"
  return this.usersService.findAll(active);
}

// Test
// GET /users?active=true   → active = true (boolean)
// GET /users?active=false  → active = false (boolean)
// GET /users?active=yes    ❌ 400 Bad Request
```

### 4. ParseArrayPipe

Transform string ke array

```typescript
@Get()
findByIds(
  @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
  ids: number[],
) {
  console.log(ids); // [1, 2, 3]
  return this.usersService.findByIds(ids);
}

// Test
// GET /users?ids=1,2,3  → [1, 2, 3]
```

### 5. ParseUUIDPipe

Validasi UUID format

```typescript
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  // id is guaranteed to be valid UUID
  return this.usersService.findOne(id);
}

// Test
// GET /users/123e4567-e89b-12d3-a456-426614174000  ✅ Works
// GET /users/invalid-uuid  ❌ 400 Bad Request
```

### 6. ParseEnumPipe

Validasi enum value

```typescript
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Get()
findByStatus(
  @Query('status', new ParseEnumPipe(Status))
  status: Status,
) {
  return this.usersService.findByStatus(status);
}

// Test
// GET /users?status=active    ✅ Works
// GET /users?status=invalid   ❌ 400 Bad Request
```

### 7. ParseFloatPipe

Transform string ke float

```typescript
@Get()
findByPrice(@Query('price', ParseFloatPipe) price: number) {
  console.log(typeof price); // "number"
  console.log(price); // 99.99
  return this.productsService.findByPrice(price);
}

// Test
// GET /products?price=99.99  → 99.99 (number)
```

### 8. ParseFilePipe

Validasi file upload

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1000000 }), // 1MB
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return file;
}
```

### 9. DefaultValuePipe

Set default value jika parameter kosong

```typescript
@Get()
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {
  return this.usersService.findAll(page, limit);
}

// Test
// GET /users                → page=1, limit=10 (defaults)
// GET /users?page=2         → page=2, limit=10
// GET /users?page=2&limit=20 → page=2, limit=20
```

## 🌍 Pipe Scopes

### 1. Parameter-scoped Pipes

Apply untuk satu parameter saja

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
```

### 2. Method-scoped Pipes

Apply untuk seluruh method

```typescript
@Post()
@UsePipes(new ValidationPipe({ transform: true }))
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

### 3. Controller-scoped Pipes

Apply untuk seluruh controller

```typescript
@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  @Post()
  create(@Body() dto: CreateUserDto) { }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) { }
}
```

### 4. Global Pipes

Apply untuk seluruh aplikasi

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  await app.listen(3000);
}
```

## ⚙️ ValidationPipe Options

### Whitelist

Buang properties yang tidak ada di DTO

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,  // Remove non-whitelisted properties
}));

// DTO
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

// Request: { name: "John", email: "john@example.com", hacker: "data" }
// Result:  { name: "John", email: "john@example.com" }  ← "hacker" removed!
```

### Forbid Non-Whitelisted

Throw error jika ada extra properties

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,  // Throw error for extra properties
}));

// Request: { name: "John", email: "john@example.com", hacker: "data" }
// Response: 400 Bad Request - "property hacker should not exist"
```

### Transform

Auto-transform types

```typescript
app.useGlobalPipes(new ValidationPipe({
  transform: true,  // Auto-transform to DTO class instance
}));

// DTO
export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;
}

// Without transform:
// Request: { name: "Laptop", price: "15000000" }
// Result:  { name: "Laptop", price: "15000000" }  ← Still string!

// With transform:
// Request: { name: "Laptop", price: "15000000" }
// Result:  { name: "Laptop", price: 15000000 }  ← Converted to number!
```

### Disable Error Messages

```typescript
app.useGlobalPipes(new ValidationPipe({
  disableErrorMessages: true,  // Don't expose validation errors (production)
}));

// Development: Show detailed errors ✅
// Production: Hide details for security ✅
```

### Skip Missing Properties

```typescript
app.useGlobalPipes(new ValidationPipe({
  skipMissingProperties: true,  // Skip validation for undefined properties
}));
```

### Enable Debug Messages

```typescript
app.useGlobalPipes(new ValidationPipe({
  enableDebugMessages: true,  // Show debug info in console
}));
```

## 🎨 Custom Pipes

### Simple Transform Pipe

```typescript
// pipes/uppercase.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class UppercasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.toUpperCase();
    }
    return value;
  }
}

// Usage
@Get(':name')
findByName(@Param('name', UppercasePipe) name: string) {
  console.log(name); // "JOHN" (uppercased)
  return this.usersService.findByName(name);
}

// Test
// GET /users/john  → name = "JOHN"
```

### Validation Pipe with Exception

```typescript
// pipes/parse-positive-int.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed: not a number');
    }
    
    if (val <= 0) {
      throw new BadRequestException('Validation failed: must be positive');
    }
    
    return val;
  }
}

// Usage
@Get(':id')
findOne(@Param('id', ParsePositiveIntPipe) id: number) {
  return this.usersService.findOne(id);
}

// Test
// GET /users/5     ✅ Works
// GET /users/0     ❌ 400: "must be positive"
// GET /users/-5    ❌ 400: "must be positive"
// GET /users/abc   ❌ 400: "not a number"
```

### Async Validation Pipe

```typescript
// pipes/user-exists.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const userId = parseInt(value, 10);
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    return userId;
  }
}

// Usage
@Get(':id')
findOne(@Param('id', UserExistsPipe) id: number) {
  // At this point, user is guaranteed to exist ✅
  return this.usersService.findOne(id);
}
```

## 🔗 Chaining Pipes

Multiple pipes dapat di-chain

```typescript
@Get(':id')
findOne(
  @Param('id', ParseIntPipe, UserExistsPipe)  // ← Chain pipes
  id: number,
) {
  return this.usersService.findOne(id);
}

// Flow:
// 1. ParseIntPipe: "123" → 123
// 2. UserExistsPipe: Check if user exists
// 3. If all pass, continue to handler
```

## 🧪 Testing Pipes

```typescript
// uppercase.pipe.spec.ts
import { UppercasePipe } from './uppercase.pipe';

describe('UppercasePipe', () => {
  let pipe: UppercasePipe;

  beforeEach(() => {
    pipe = new UppercasePipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform string to uppercase', () => {
    const result = pipe.transform('hello', { type: 'param' });
    expect(result).toBe('HELLO');
  });

  it('should return non-string values unchanged', () => {
    expect(pipe.transform(123, { type: 'param' })).toBe(123);
    expect(pipe.transform(null, { type: 'param' })).toBe(null);
  });
});
```

## 💡 Best Practices

### ✅ DO:

```typescript
// 1. Use ValidationPipe globally
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));

// 2. Use specific pipes for parameters
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { }

// 3. Create reusable custom pipes
@Injectable()
export class TrimPipe implements PipeTransform { }
```

### ❌ DON'T:

```typescript
// 1. Don't skip validation
@Post()
create(@Body() body: any) { }  // ❌ No validation!

// 2. Don't put business logic in pipes
@Injectable()
export class CalculateTaxPipe implements PipeTransform {
  transform(value: any) {
    // ❌ Business logic should be in service!
    return value * 1.1;
  }
}

// 3. Don't ignore type safety
@Get(':id')
findOne(@Param('id') id: string) {  // ❌ Should use ParseIntPipe
  const numId = +id;  // Manual conversion
}
```

## 📊 Summary

| Pipe Type | Purpose | Example |
|-----------|---------|---------|
| ValidationPipe | DTO validation | `@Body() dto: CreateUserDto` |
| ParseIntPipe | String → Number | `@Param('id', ParseIntPipe)` |
| ParseBoolPipe | String → Boolean | `@Query('active', ParseBoolPipe)` |
| ParseArrayPipe | String → Array | `@Query('ids', ParseArrayPipe)` |
| ParseUUIDPipe | Validate UUID | `@Param('id', ParseUUIDPipe)` |
| ParseEnumPipe | Validate Enum | `@Query('status', ParseEnumPipe)` |
| Custom Pipe | Custom logic | `@Param('name', UppercasePipe)` |

---

**Next Chapter:** Custom Pipes - Advanced transformation patterns! 🎨
