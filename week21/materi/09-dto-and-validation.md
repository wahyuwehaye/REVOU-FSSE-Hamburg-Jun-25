# DTO (Data Transfer Objects) & Input Validation

## What is DTO?

DTO is a pattern for defining the shape of data being transferred between layers.

## Why Use DTOs?

1. **Type Safety** - Define expected data structure
2. **Validation** - Validate incoming data
3. **Documentation** - Clear API contracts
4. **Transformation** - Transform data before processing

## Setting Up Validation

### Install Dependencies

```bash
npm install class-validator class-transformer
```

### Enable Global Validation

Edit `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Remove unknown properties
    forbidNonWhitelisted: true, // Throw error for unknown properties
    transform: true,            // Auto-transform to DTO instance
  }));
  
  await app.listen(3000);
}
bootstrap();
```

## Creating DTOs with Validation

### Basic DTO

```typescript
// dto/create-user.dto.ts
import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;
}
```

### Update DTO

```typescript
// dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
// All fields become optional
```

## Common Validation Decorators

### String Validators

```typescript
import { IsString, IsNotEmpty, MinLength, MaxLength, Matches, IsEmail, IsUrl } from 'class-validator';

@IsString()
@IsNotEmpty()
@MinLength(3)
@MaxLength(50)
name: string;

@IsEmail()
email: string;

@IsUrl()
website: string;

@Matches(/^[A-Za-z0-9]+$/, { message: 'Username can only contain letters and numbers' })
username: string;
```

### Number Validators

```typescript
import { IsNumber, IsInt, Min, Max, IsPositive } from 'class-validator';

@IsNumber()
@Min(0)
@Max(1000000)
price: number;

@IsInt()
@IsPositive()
quantity: number;
```

### Boolean Validators

```typescript
import { IsBoolean } from 'class-validator';

@IsBoolean()
isActive: boolean;
```

### Date Validators

```typescript
import { IsDate, MinDate, MaxDate } from 'class-validator';
import { Type } from 'class-transformer';

@IsDate()
@Type(() => Date)
@MinDate(new Date())
birthDate: Date;
```

### Array Validators

```typescript
import { IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

@IsArray()
@ArrayMinSize(1)
@ArrayMaxSize(10)
tags: string[];
```

### Enum Validators

```typescript
import { IsEnum } from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@IsEnum(UserRole)
role: UserRole;
```

### Nested Object Validation

```typescript
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  zipCode: string;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```

## Complete Example

### Create Product DTO

```typescript
// products/dto/create-product.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  Min,
  MaxLength,
  IsEnum,
} from 'class-validator';

enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  FOOD = 'food',
  BOOKS = 'books',
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be positive' })
  @Min(0.01, { message: 'Price must be at least 0.01' })
  price: number;

  @IsEnum(ProductCategory, {
    message: 'Category must be one of: electronics, clothing, food, books',
  })
  category: ProductCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  stock: number;
}
```

### Controller

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    // DTO is automatically validated
    return createProductDto;
  }
}
```

## Testing Validation

### Valid Request

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 15000000,
    "category": "electronics",
    "stock": 10
  }'
```

**Response:** 201 Created

### Invalid Request (Missing Required Field)

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "price": 15000000
  }'
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "Product name is required",
    "Category must be one of: electronics, clothing, food, books",
    "stock must be a positive number",
    "stock must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request"
}
```

### Invalid Request (Wrong Type)

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": "invalid",
    "category": "electronics",
    "stock": 10
  }'
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "price must be a positive number",
    "price must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request"
}
```

## Custom Validation

### Custom Validator

```typescript
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return strongPasswordRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password must contain uppercase, lowercase, number, and special character';
        },
      },
    });
  };
}

// Usage
export class CreateUserDto {
  @IsString()
  @IsStrongPassword()
  password: string;
}
```

## Validation Groups

```typescript
export class UpdateUserDto {
  @IsOptional({ groups: ['update'] })
  @IsNotEmpty({ groups: ['create'] })
  name?: string;
}

// In controller
@Put(':id')
update(
  @Body(new ValidationPipe({ groups: ['update'] }))
  updateUserDto: UpdateUserDto,
) {
  return this.usersService.update(updateUserDto);
}
```

## Best Practices

1. ✅ Always validate user input
2. ✅ Use descriptive error messages
3. ✅ Use `@IsOptional()` for optional fields
4. ✅ Use `PartialType` for update DTOs
5. ✅ Enable `whitelist` to remove extra properties
6. ✅ Use `transform: true` for automatic type conversion
7. ✅ Create separate DTOs for create and update
8. ✅ Use enums for limited value sets

## Next Steps

- Learn about error handling
- Implement custom validation decorators
- Add transformation pipes
- Create response DTOs
