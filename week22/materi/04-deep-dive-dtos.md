# Chapter 4: Deep Dive into DTOs - Advanced Patterns

## 🚀 Introduction

Setelah memahami dasar-dasar DTO, sekarang kita akan mempelajari **advanced patterns** dan **best practices** yang sering digunakan di production applications.

## 📚 Nested DTOs

### Basic Nested DTO

```typescript
// address.dto.ts
export class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  @Length(5, 5)
  postalCode: string;

  @IsString()
  country: string;
}

// create-user.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @ValidateNested()  // ← Validate nested object
  @Type(() => AddressDto)  // ← Transform to AddressDto instance
  address: AddressDto;
}
```

### Test Nested Validation

```bash
# Valid request
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "Jakarta",
      "postalCode": "12345",
      "country": "Indonesia"
    }
  }'

# Invalid - postalCode must be 5 characters
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "Jakarta",
      "postalCode": "123",
      "country": "Indonesia"
    }
  }'

# Response: 400 Bad Request
{
  "message": ["address.postalCode must be longer than or equal to 5 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## 📦 Array DTOs

### Validate Array of Objects

```typescript
// create-order.dto.ts
export class OrderItemDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsInt()
  customerId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must have at least 1 item' })
  @ArrayMaxSize(100, { message: 'Maximum 100 items per order' })
  @ValidateNested({ each: true })  // ← Validate each item in array
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  shippingAddress: string;
}
```

### Test Array Validation

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "items": [
      {
        "productId": 101,
        "quantity": 2,
        "price": 50000
      },
      {
        "productId": 102,
        "quantity": 1,
        "price": 75000
      }
    ],
    "shippingAddress": "Jakarta"
  }'
```

## 🔄 DTO Inheritance & Composition

### PartialType - Make All Fields Optional

```typescript
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;
}

// All fields become optional
export class UpdateProductDto extends PartialType(CreateProductDto) {}

// Equivalent to:
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
```

### PickType - Select Specific Fields

```typescript
import { PickType } from '@nestjs/mapped-types';

export class UserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;
}

// Only pick name and email
export class LoginDto extends PickType(UserDto, ['email', 'password'] as const) {}

// Result:
// LoginDto {
//   email: string;
//   password: string;
// }
```

### OmitType - Exclude Specific Fields

```typescript
import { OmitType } from '@nestjs/mapped-types';

export class UserDto {
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

// Exclude id and password
export class UserResponseDto extends OmitType(UserDto, ['password'] as const) {}

// Result:
// UserResponseDto {
//   id: number;
//   name: string;
//   email: string;
// }
```

### IntersectionType - Combine Multiple DTOs

```typescript
import { IntersectionType } from '@nestjs/mapped-types';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class FilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;
}

// Combine both DTOs
export class QueryDto extends IntersectionType(PaginationDto, FilterDto) {}

// Result:
// QueryDto {
//   page?: number;
//   limit?: number;
//   search?: string;
//   status?: string;
// }
```

## 🎨 Custom Decorators

### Create Custom Validation Decorator

```typescript
// decorators/is-strong-password.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStrongPassword', async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  defaultMessage(): string {
    return 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

// Usage
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()  // ← Custom decorator
  password: string;
}
```

### Create Custom Transform Decorator

```typescript
// decorators/trim.decorator.ts
import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }) => {
    return typeof value === 'string' ? value.trim() : value;
  });
}

// Usage
export class CreatePostDto {
  @IsString()
  @Trim()  // ← Auto trim spaces
  title: string;

  @IsString()
  @Trim()
  content: string;
}

// Test
// Input:  { title: "  Hello World  ", content: "  Content  " }
// Output: { title: "Hello World", content: "Content" }
```

## 🔐 Conditional Validation

### ValidateIf - Conditional Validation

```typescript
import { ValidateIf, IsString, IsInt } from 'class-validator';

export class CreatePaymentDto {
  @IsEnum(['credit_card', 'bank_transfer', 'cash'])
  paymentMethod: string;

  // Only validate if paymentMethod is 'credit_card'
  @ValidateIf(o => o.paymentMethod === 'credit_card')
  @IsString()
  @Length(16, 16)
  cardNumber?: string;

  @ValidateIf(o => o.paymentMethod === 'credit_card')
  @IsString()
  @Length(3, 4)
  cvv?: string;

  // Only validate if paymentMethod is 'bank_transfer'
  @ValidateIf(o => o.paymentMethod === 'bank_transfer')
  @IsString()
  bankAccountNumber?: string;

  @IsNumber()
  amount: number;
}
```

### Test Conditional Validation

```bash
# Credit card payment - requires cardNumber and cvv
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "credit_card",
    "cardNumber": "1234567812345678",
    "cvv": "123",
    "amount": 100000
  }'

# Bank transfer - requires bankAccountNumber
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "bank_transfer",
    "bankAccountNumber": "1234567890",
    "amount": 100000
  }'

# Cash - doesn't require card or bank info
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "cash",
    "amount": 100000
  }'
```

## 🎯 Custom Validators

### Async Validation (Database Check)

```typescript
// validators/is-email-unique.validator.ts
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersService } from '../users/users.service';

@ValidatorConstraint({ name: 'IsEmailUnique', async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    return !user; // Return true if email doesn't exist (unique)
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Email already exists';
  }
}

// Custom decorator
export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint,
    });
  };
}

// Enable in module
@Module({
  providers: [IsEmailUniqueConstraint],
})
export class UsersModule {}

// Usage
export class CreateUserDto {
  @IsEmail()
  @IsEmailUnique()  // ← Check database
  email: string;
}
```

## 🔄 DTO Transformation

### Transform Input Data

```typescript
import { Transform } from 'class-transformer';
import { IsString, IsInt, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Transform(({ value }) => value.trim().toUpperCase())  // ← Auto uppercase
  sku: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value))  // ← String to number
  price: number;

  @IsArray()
  @Transform(({ value }) => {
    // Convert comma-separated string to array
    if (typeof value === 'string') {
      return value.split(',').map(tag => tag.trim());
    }
    return value;
  })
  tags: string[];
}

// Test
// Input:  { sku: "  prod-123  ", name: "  Laptop  ", price: "15000000", tags: "electronics, computer, laptop" }
// Output: { sku: "PROD-123", name: "Laptop", price: 15000000, tags: ["electronics", "computer", "laptop"] }
```

### Exclude Fields from Response

```typescript
import { Exclude, Expose } from 'class-transformer';

@Exclude()  // ← Exclude all by default
export class UserResponseDto {
  @Expose()  // ← Only expose these fields
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  // These fields won't be included in response
  password: string;
  resetToken: string;
  deletedAt: Date;
}

// Service
async findOne(id: number): Promise<UserResponseDto> {
  const user = await this.userRepository.findOne({ where: { id } });
  return plainToClass(UserResponseDto, user);
}

// Response will only have: id, name, email
```

## 📊 Pagination & Filtering DTO

### Complete Query DTO

```typescript
// query.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  get take(): number {
    return this.limit;
  }
}

export class FilterProductsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

// Controller
@Get()
async findAll(@Query() query: FilterProductsDto) {
  return this.productsService.findAll(query);
}

// Service
async findAll(query: FilterProductsDto) {
  const queryBuilder = this.productRepository
    .createQueryBuilder('product')
    .skip(query.skip)
    .take(query.take)
    .orderBy(`product.${query.sortBy}`, query.order);

  if (query.search) {
    queryBuilder.andWhere('product.name LIKE :search', {
      search: `%${query.search}%`,
    });
  }

  if (query.categoryId) {
    queryBuilder.andWhere('product.categoryId = :categoryId', {
      categoryId: query.categoryId,
    });
  }

  if (query.minPrice !== undefined) {
    queryBuilder.andWhere('product.price >= :minPrice', {
      minPrice: query.minPrice,
    });
  }

  if (query.maxPrice !== undefined) {
    queryBuilder.andWhere('product.price <= :maxPrice', {
      maxPrice: query.maxPrice,
    });
  }

  if (query.status) {
    queryBuilder.andWhere('product.status = :status', {
      status: query.status,
    });
  }

  const [data, total] = await queryBuilder.getManyAndCount();

  return {
    data,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}
```

### Test Query Parameters

```bash
# Basic pagination
GET /products?page=1&limit=10

# With search
GET /products?search=laptop&page=1&limit=10

# With filters
GET /products?categoryId=5&minPrice=1000000&maxPrice=5000000&page=1&limit=20

# With sorting
GET /products?sortBy=price&order=ASC&page=1&limit=10

# Combine all
GET /products?search=laptop&categoryId=5&minPrice=1000000&maxPrice=5000000&sortBy=price&order=ASC&page=1&limit=20
```

## 🎯 Response DTO Pattern

### Standardized Response Format

```typescript
// response.dto.ts
export class ApiResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
  }
}

// Usage in controller
@Get()
async findAll(@Query() query: FilterProductsDto): Promise<ApiResponseDto<Product[]>> {
  const result = await this.productsService.findAll(query);
  
  return new ApiResponseDto({
    success: true,
    message: 'Products retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
}

@Post()
async create(@Body() dto: CreateProductDto): Promise<ApiResponseDto<Product>> {
  const product = await this.productsService.create(dto);
  
  return new ApiResponseDto({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
}

// Error response
@Get(':id')
async findOne(@Param('id') id: string): Promise<ApiResponseDto<Product>> {
  try {
    const product = await this.productsService.findOne(+id);
    return new ApiResponseDto({
      success: true,
      message: 'Product found',
      data: product,
    });
  } catch (error) {
    return new ApiResponseDto({
      success: false,
      message: 'Product not found',
      errors: error.message,
    });
  }
}
```

## 💡 Best Practices Summary

### ✅ DO:

1. **Use nested DTOs** for complex objects
2. **Validate arrays** with `@ValidateNested({ each: true })`
3. **Use mapped types** (PartialType, PickType, OmitType) to avoid duplication
4. **Create custom decorators** for reusable validation
5. **Use Transform** decorators for data normalization
6. **Separate Response DTOs** to hide sensitive data
7. **Use pagination DTOs** for list endpoints
8. **Standardize response format** across all endpoints

### ❌ DON'T:

1. **Don't put business logic** in DTOs
2. **Don't use DTOs** as Entities
3. **Don't return Entities** directly to client
4. **Don't skip validation** for "internal" endpoints
5. **Don't use `any` type** in DTOs

## 🎓 Practice Exercises

1. Create nested DTO for Order with multiple OrderItems
2. Create custom validator untuk format Indonesian phone number
3. Create pagination + filter DTO untuk Users endpoint
4. Create response DTO yang hide sensitive fields
5. Implement conditional validation untuk different payment methods

---

**Next Chapter:** Validation Pipes - How validation works under the hood! 🔍
