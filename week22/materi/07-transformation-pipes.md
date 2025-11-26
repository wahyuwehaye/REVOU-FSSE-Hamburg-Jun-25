# Chapter 7: Transformation Pipes - Data Transformation Patterns

## 🎯 Apa itu Transformation Pipes?

**Transformation Pipes** adalah pipes yang fokus pada **mengubah format data** dari satu bentuk ke bentuk lain, tanpa necessarily melakukan validasi.

## 🔄 Common Transformation Patterns

### 1. Type Conversion

```typescript
// pipes/to-number.pipe.ts
@Injectable()
export class ToNumberPipe implements PipeTransform {
  transform(value: any): number {
    return Number(value);
  }
}

// pipes/to-boolean.pipe.ts
@Injectable()
export class ToBooleanPipe implements PipeTransform {
  transform(value: any): boolean {
    if (value === 'true' || value === '1' || value === 1) return true;
    if (value === 'false' || value === '0' || value === 0) return false;
    return Boolean(value);
  }
}
```

### 2. String Transformation

```typescript
// pipes/string-transform.pipe.ts
@Injectable()
export class UppercasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toUpperCase();
  }
}

@Injectable()
export class LowercasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase();
  }
}

@Injectable()
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}

@Injectable()
export class TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
```

### 3. Array Transformation

```typescript
// pipes/array-transform.pipe.ts
@Injectable()
export class SplitPipe implements PipeTransform {
  constructor(private readonly separator: string = ',') {}

  transform(value: string): string[] {
    return value.split(this.separator).map(item => item.trim());
  }
}

@Injectable()
export class UniqueArrayPipe implements PipeTransform {
  transform(value: any[]): any[] {
    return [...new Set(value)];
  }
}

@Injectable()
export class SortArrayPipe implements PipeTransform {
  transform(value: any[], order: 'asc' | 'desc' = 'asc'): any[] {
    const sorted = [...value].sort();
    return order === 'desc' ? sorted.reverse() : sorted;
  }
}
```

### 4. Object Transformation

```typescript
// pipes/object-transform.pipe.ts
@Injectable()
export class PickFieldsPipe implements PipeTransform {
  constructor(private readonly fields: string[]) {}

  transform(value: any): any {
    const result = {};
    this.fields.forEach(field => {
      if (field in value) {
        result[field] = value[field];
      }
    });
    return result;
  }
}

@Injectable()
export class OmitFieldsPipe implements PipeTransform {
  constructor(private readonly fields: string[]) {}

  transform(value: any): any {
    const result = { ...value };
    this.fields.forEach(field => {
      delete result[field];
    });
    return result;
  }
}
```

### 5. Date Transformation

```typescript
// pipes/date-transform.pipe.ts
@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string): Date {
    return new Date(value);
  }
}

@Injectable()
export class FormatDatePipe implements PipeTransform {
  transform(value: Date, format: string = 'YYYY-MM-DD'): string {
    // Simple date formatting
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }
}
```

## 🎨 Advanced Transformation Examples

### Password Hash Pipe

```typescript
// pipes/hash-password.pipe.ts
import { PipeTransform, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  async transform(value: any) {
    if (!value.password) {
      return value;
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    
    return {
      ...value,
      password: hashedPassword,
    };
  }
}

// Usage
@Post('register')
async register(@Body(HashPasswordPipe) dto: RegisterDto) {
  // Password sudah ter-hash ✅
  return this.authService.register(dto);
}
```

### Slug Generation Pipe

```typescript
// pipes/generate-slug.pipe.ts
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class GenerateSlugPipe implements PipeTransform {
  transform(value: any) {
    if (!value.title) {
      return value;
    }

    const slug = value.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return {
      ...value,
      slug: value.slug || slug, // Use existing slug or generate new one
    };
  }
}

// Usage
@Post()
create(@Body(GenerateSlugPipe) dto: CreatePostDto) {
  // Slug automatically generated from title
  return this.postsService.create(dto);
}

// Test
// Input:  { title: "Hello World! This is a Test" }
// Output: { title: "Hello World! This is a Test", slug: "hello-world-this-is-a-test" }
```

### File Path Transformation

```typescript
// pipes/file-path-transform.pipe.ts
import { PipeTransform, Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FilePathTransformPipe implements PipeTransform {
  constructor(private readonly baseDir: string) {}

  transform(file: Express.Multer.File) {
    return {
      ...file,
      url: `/uploads/${file.filename}`,
      fullPath: join(this.baseDir, file.filename),
    };
  }
}

// Usage
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(
  @UploadedFile(new FilePathTransformPipe('./uploads'))
  file: Express.Multer.File,
) {
  return {
    filename: file.filename,
    url: file.url,
    size: file.size,
  };
}
```

### Price Calculation Pipe

```typescript
// pipes/calculate-price.pipe.ts
import { PipeTransform, Injectable } from '@nestjs/common';

interface PriceCalculation {
  basePrice: number;
  tax: number;
  discount: number;
  finalPrice: number;
}

@Injectable()
export class CalculatePricePipe implements PipeTransform {
  transform(value: any): any {
    if (!value.basePrice) {
      return value;
    }

    const basePrice = Number(value.basePrice);
    const taxRate = 0.1; // 10% tax
    const discountRate = value.discountRate || 0;

    const tax = basePrice * taxRate;
    const discount = basePrice * discountRate;
    const finalPrice = basePrice + tax - discount;

    return {
      ...value,
      tax,
      discount,
      finalPrice,
    };
  }
}

// Usage
@Post('calculate')
calculate(@Body(CalculatePricePipe) dto: any) {
  return dto;
}

// Test
// Input:  { basePrice: 100000, discountRate: 0.15 }
// Output: {
//   basePrice: 100000,
//   discountRate: 0.15,
//   tax: 10000,
//   discount: 15000,
//   finalPrice: 95000
// }
```

## 🔄 Complex Transformations

### Nested Object Transformation

```typescript
// pipes/transform-address.pipe.ts
@Injectable()
export class TransformAddressPipe implements PipeTransform {
  transform(value: any) {
    if (!value.address) {
      return value;
    }

    // Normalize address format
    return {
      ...value,
      address: {
        street: value.address.street?.trim(),
        city: value.address.city?.trim(),
        postalCode: value.address.postalCode?.replace(/\s/g, ''),
        country: value.address.country?.toUpperCase(),
        fullAddress: this.buildFullAddress(value.address),
      },
    };
  }

  private buildFullAddress(address: any): string {
    return [
      address.street,
      address.city,
      address.postalCode,
      address.country,
    ]
      .filter(Boolean)
      .join(', ');
  }
}
```

### Array of Objects Transformation

```typescript
// pipes/transform-order-items.pipe.ts
@Injectable()
export class TransformOrderItemsPipe implements PipeTransform {
  async transform(value: any) {
    if (!value.items || !Array.isArray(value.items)) {
      return value;
    }

    const transformedItems = value.items.map(item => ({
      ...item,
      subtotal: item.quantity * item.price,
    }));

    const total = transformedItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      ...value,
      items: transformedItems,
      total,
    };
  }
}

// Usage
@Post('orders')
create(@Body(TransformOrderItemsPipe) dto: CreateOrderDto) {
  return this.ordersService.create(dto);
}

// Test
// Input: {
//   customerId: 1,
//   items: [
//     { productId: 1, quantity: 2, price: 50000 },
//     { productId: 2, quantity: 1, price: 75000 }
//   ]
// }
// Output: {
//   customerId: 1,
//   items: [
//     { productId: 1, quantity: 2, price: 50000, subtotal: 100000 },
//     { productId: 2, quantity: 1, price: 75000, subtotal: 75000 }
//   ],
//   total: 175000
// }
```

## 🎯 Practical Examples

### Complete User Registration Transformation

```typescript
// Combine multiple transformations
@Post('register')
async register(
  @Body(
    TrimPipe,                 // 1. Trim whitespace
    LowercasePipe,            // 2. Lowercase email
    HashPasswordPipe,         // 3. Hash password
    GenerateSlugPipe,         // 4. Generate username slug
  )
  dto: RegisterDto,
) {
  return this.authService.register(dto);
}
```

### Product Creation with Auto-calculations

```typescript
@Post('products')
async create(
  @Body(
    TrimPipe,
    GenerateSlugPipe,
    CalculatePricePipe,
  )
  dto: CreateProductDto,
) {
  return this.productsService.create(dto);
}
```

## 💡 Best Practices

### ✅ DO:

```typescript
// 1. Keep transformations pure (no side effects)
@Injectable()
export class PurePipe implements PipeTransform {
  transform(value: any) {
    return { ...value, transformed: true }; // Return new object
  }
}

// 2. Make pipes configurable
@Injectable()
export class ConfigurablePipe implements PipeTransform {
  constructor(private readonly options: any) {}
  transform(value: any) {
    return this.process(value, this.options);
  }
}

// 3. Use descriptive names
UppercasePipe, TrimPipe, GenerateSlugPipe // ✅ Clear
TransformPipe, ProcessPipe, DoStuffPipe   // ❌ Vague
```

### ❌ DON'T:

```typescript
// 1. Don't mutate input
transform(value: any) {
  value.modified = true; // ❌ Mutating input
  return value;
}

// 2. Don't make HTTP calls in transformation pipes
transform(value: any) {
  await this.httpService.post('...', value); // ❌ Side effect
  return value;
}

// 3. Don't throw errors for transformation failures
transform(value: any) {
  if (!value) {
    throw new BadRequestException(); // ❌ Use validation pipe instead
  }
  return value;
}
```

## 📊 Summary

| Pattern | Purpose | Example |
|---------|---------|---------|
| Type Conversion | Change data type | ToNumberPipe |
| String Transform | Modify strings | UppercasePipe, TrimPipe |
| Array Transform | Modify arrays | SplitPipe, UniqueArrayPipe |
| Object Transform | Modify objects | PickFieldsPipe, OmitFieldsPipe |
| Complex Transform | Multi-step transformation | HashPasswordPipe |

---

**Next Chapter:** Middleware - Request/Response processing! 🔄
