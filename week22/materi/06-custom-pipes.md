# Chapter 6: Custom Pipes - Advanced Transformation

## 🎯 Kapan Perlu Custom Pipes?

Custom pipes diperlukan ketika:
- ✅ Built-in pipes tidak cukup untuk kebutuhan spesifik
- ✅ Butuh transformation logic yang complex
- ✅ Butuh async validation (database check, API call)
- ✅ Butuh reusable validation di banyak endpoint

## 🏗️ Anatomy of Custom Pipe

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class CustomPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // value: Input data
    // metadata: { type, metatype, data }
    
    // Do transformation/validation
    
    return transformedValue;
  }
}
```

### ArgumentMetadata Properties

```typescript
interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';  // Where the data comes from
  metatype?: Type<unknown>;  // Type of the parameter (class/primitive)
  data?: string;  // Decorator key (e.g., 'id' in @Param('id'))
}
```

## 🎨 Transformation Pipes Examples

### 1. Trim Whitespace Pipe

```typescript
// pipes/trim.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }
    
    if (typeof value === 'object' && value !== null) {
      return this.trimObject(value);
    }
    
    return value;
  }

  private trimObject(obj: any): any {
    const trimmed = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        trimmed[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object') {
        trimmed[key] = this.trimObject(obj[key]);
      } else {
        trimmed[key] = obj[key];
      }
    }
    return trimmed;
  }
}

// Usage
@Post()
create(@Body(TrimPipe) dto: CreateUserDto) {
  // All string fields automatically trimmed
  return this.usersService.create(dto);
}

// Test
// Input:  { name: "  John  ", email: "  john@test.com  " }
// Output: { name: "John", email: "john@test.com" }
```

### 2. Lowercase Email Pipe

```typescript
// pipes/lowercase-email.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class LowercaseEmailPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.email) {
      return value;
    }

    if (typeof value.email !== 'string') {
      throw new BadRequestException('Email must be a string');
    }

    return {
      ...value,
      email: value.email.toLowerCase().trim(),
    };
  }
}

// Usage
@Post('register')
register(@Body(LowercaseEmailPipe) dto: RegisterDto) {
  return this.authService.register(dto);
}

// Test
// Input:  { email: "  JOHN@EXAMPLE.COM  ", password: "pass123" }
// Output: { email: "john@example.com", password: "pass123" }
```

### 3. Parse CSV to Array Pipe

```typescript
// pipes/parse-csv.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseCsvPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string[] {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
}

// Usage
@Get()
findByTags(@Query('tags', ParseCsvPipe) tags: string[]) {
  console.log(tags); // ['electronics', 'laptop', 'gaming']
  return this.productsService.findByTags(tags);
}

// Test
// GET /products?tags=electronics,laptop,gaming
// Result: ['electronics', 'laptop', 'gaming']
```

### 4. Sanitize HTML Pipe

```typescript
// pipes/sanitize-html.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class SanitizeHtmlPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return this.sanitize(value);
    }

    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value);
    }

    return value;
  }

  private sanitize(text: string): string {
    // Remove HTML tags
    return text.replace(/<[^>]*>/g, '');
  }

  private sanitizeObject(obj: any): any {
    const sanitized = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = this.sanitize(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitized[key] = this.sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
    return sanitized;
  }
}

// Usage
@Post()
create(@Body(SanitizeHtmlPipe) dto: CreatePostDto) {
  return this.postsService.create(dto);
}

// Test
// Input:  { title: "<script>alert('xss')</script>Hello" }
// Output: { title: "Hello" }
```

## ✅ Validation Pipes Examples

### 5. Parse Positive Integer Pipe

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
      throw new BadRequestException(`${metadata.data} must be a number`);
    }

    if (val <= 0) {
      throw new BadRequestException(`${metadata.data} must be positive`);
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
// GET /users/5    ✅ Works
// GET /users/0    ❌ "id must be positive"
// GET /users/-5   ❌ "id must be positive"
// GET /users/abc  ❌ "id must be a number"
```

### 6. Parse Date Range Pipe

```typescript
// pipes/parse-date-range.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class ParseDateRangePipe implements PipeTransform<string, DateRange> {
  transform(value: string, metadata: ArgumentMetadata): DateRange {
    if (!value) {
      throw new BadRequestException('Date range is required');
    }

    const dates = value.split('to').map(d => d.trim());

    if (dates.length !== 2) {
      throw new BadRequestException(
        'Invalid date range format. Use: YYYY-MM-DD to YYYY-MM-DD',
      );
    }

    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);

    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Invalid start date');
    }

    if (isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid end date');
    }

    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    return { startDate, endDate };
  }
}

// Usage
@Get('reports')
getReports(@Query('dateRange', ParseDateRangePipe) dateRange: DateRange) {
  console.log(dateRange);
  // { startDate: Date, endDate: Date }
  return this.reportsService.getByDateRange(dateRange);
}

// Test
// GET /reports?dateRange=2024-01-01 to 2024-12-31  ✅ Works
// GET /reports?dateRange=2024-12-31 to 2024-01-01  ❌ "Start date must be before end date"
```

### 7. Validate File Size Pipe

```typescript
// pipes/validate-file-size.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  PayloadTooLargeException,
} from '@nestjs/common';

@Injectable()
export class ValidateFileSizePipe implements PipeTransform {
  constructor(private readonly maxSizeInBytes: number) {}

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }

    if (value.size > this.maxSizeInBytes) {
      const maxSizeInMB = (this.maxSizeInBytes / 1024 / 1024).toFixed(2);
      const fileSizeInMB = (value.size / 1024 / 1024).toFixed(2);
      
      throw new PayloadTooLargeException(
        `File size ${fileSizeInMB}MB exceeds maximum allowed size ${maxSizeInMB}MB`,
      );
    }

    return value;
  }
}

// Usage
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(
  @UploadedFile(new ValidateFileSizePipe(5 * 1024 * 1024))  // 5MB max
  file: Express.Multer.File,
) {
  return { filename: file.filename, size: file.size };
}
```

## 🔄 Async Validation Pipes

### 8. User Exists Pipe (Database Check)

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

  async transform(value: any, metadata: ArgumentMetadata): Promise<number> {
    const userId = parseInt(value, 10);

    if (isNaN(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return userId;
  }
}

// Usage in controller
@Get(':userId')
findOne(@Param('userId', UserExistsPipe) userId: number) {
  // At this point, user is guaranteed to exist ✅
  return this.usersService.findOne(userId);
}

@Patch(':userId')
update(
  @Param('userId', UserExistsPipe) userId: number,
  @Body() dto: UpdateUserDto,
) {
  return this.usersService.update(userId, dto);
}
```

### 9. Email Unique Pipe (Database Check)

```typescript
// pipes/email-unique.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmailUniquePipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value.email) {
      return value;
    }

    const existingUser = await this.usersService.findByEmail(value.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return value;
  }
}

// Usage
@Post('register')
async register(@Body(EmailUniquePipe) dto: RegisterDto) {
  return this.authService.register(dto);
}
```

### 10. Slug Available Pipe

```typescript
// pipes/slug-available.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ConflictException,
} from '@nestjs/common';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class SlugAvailablePipe implements PipeTransform {
  constructor(private readonly postsService: PostsService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value.slug) {
      return value;
    }

    const existingPost = await this.postsService.findBySlug(value.slug);

    if (existingPost) {
      throw new ConflictException(`Slug '${value.slug}' is already taken`);
    }

    return value;
  }
}

// Usage
@Post()
async create(@Body(SlugAvailablePipe) dto: CreatePostDto) {
  return this.postsService.create(dto);
}
```

## 🎭 Conditional Pipes

### 11. Optional Parse Int Pipe

```typescript
// pipes/optional-parse-int.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const val = parseInt(value, 10);

    if (isNaN(val)) {
      throw new BadRequestException(`${metadata.data} must be a number`);
    }

    return val;
  }
}

// Usage
@Get()
findAll(
  @Query('categoryId', OptionalParseIntPipe) categoryId?: number,
  @Query('minPrice', OptionalParseIntPipe) minPrice?: number,
) {
  return this.productsService.findAll({ categoryId, minPrice });
}

// Test
// GET /products                           ✅ categoryId=undefined, minPrice=undefined
// GET /products?categoryId=5              ✅ categoryId=5, minPrice=undefined
// GET /products?categoryId=5&minPrice=100 ✅ categoryId=5, minPrice=100
// GET /products?categoryId=abc            ❌ "categoryId must be a number"
```

## 🔗 Chaining Multiple Pipes

### 12. Multiple Transformation Pipes

```typescript
// Chain multiple pipes
@Post()
create(
  @Body(TrimPipe, LowercaseEmailPipe, SanitizeHtmlPipe)
  dto: CreateUserDto,
) {
  return this.usersService.create(dto);
}

// Execution order:
// 1. TrimPipe: Remove whitespace
// 2. LowercaseEmailPipe: Lowercase email
// 3. SanitizeHtmlPipe: Remove HTML tags
```

### 13. Validation + Transformation Chain

```typescript
@Get(':id')
findOne(
  @Param('id', ParseIntPipe, ParsePositiveIntPipe, UserExistsPipe)
  id: number,
) {
  return this.usersService.findOne(id);
}

// Execution order:
// 1. ParseIntPipe: "123" → 123
// 2. ParsePositiveIntPipe: Check > 0
// 3. UserExistsPipe: Check if user exists in DB
```

## 🧪 Testing Custom Pipes

```typescript
// trim.pipe.spec.ts
import { TrimPipe } from './trim.pipe';
import { ArgumentMetadata } from '@nestjs/common';

describe('TrimPipe', () => {
  let pipe: TrimPipe;
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: String,
    data: '',
  };

  beforeEach(() => {
    pipe = new TrimPipe();
  });

  describe('transform', () => {
    it('should trim string values', () => {
      const result = pipe.transform('  hello  ', metadata);
      expect(result).toBe('hello');
    });

    it('should trim object string properties', () => {
      const input = {
        name: '  John  ',
        email: '  john@test.com  ',
      };
      const result = pipe.transform(input, metadata);
      expect(result).toEqual({
        name: 'John',
        email: 'john@test.com',
      });
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: '  John  ',
          address: {
            street: '  Main St  ',
          },
        },
      };
      const result = pipe.transform(input, metadata);
      expect(result.user.name).toBe('John');
      expect(result.user.address.street).toBe('Main St');
    });

    it('should return non-string values unchanged', () => {
      expect(pipe.transform(123, metadata)).toBe(123);
      expect(pipe.transform(null, metadata)).toBe(null);
      expect(pipe.transform(true, metadata)).toBe(true);
    });
  });
});
```

## 💡 Best Practices

### ✅ DO:

```typescript
// 1. Make pipes reusable
@Injectable()
export class TrimPipe implements PipeTransform { }

// 2. Provide clear error messages
throw new BadRequestException('Email must be a valid email address');

// 3. Use dependency injection
constructor(private readonly usersService: UsersService) {}

// 4. Test your pipes
describe('CustomPipe', () => { });
```

### ❌ DON'T:

```typescript
// 1. Don't put business logic in pipes
@Injectable()
export class CalculatePricePipe implements PipeTransform {
  transform(value: any) {
    // ❌ Business logic should be in service!
    return value * 1.1 + 5000;
  }
}

// 2. Don't make pipes too complex
@Injectable()
export class DoEverythingPipe implements PipeTransform {
  // ❌ Too many responsibilities!
}

// 3. Don't ignore errors
transform(value: any) {
  try {
    return parseInt(value);
  } catch (e) {
    return 0; // ❌ Silent failure!
  }
}
```

## 📊 Summary

| Type | Purpose | Example |
|------|---------|---------|
| Transformation | Change data format | TrimPipe, LowercasePipe |
| Validation | Check data validity | ParsePositiveIntPipe |
| Async Validation | Database/API checks | UserExistsPipe |
| Sanitization | Clean malicious input | SanitizeHtmlPipe |

---

**Next Chapter:** Transformation Pipes - Advanced data transformation! 🔄
