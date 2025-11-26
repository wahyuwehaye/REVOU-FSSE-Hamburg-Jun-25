# Chapter 1: Understanding DTOs (Data Transfer Objects)

## 📚 Apa itu DTO?

**DTO (Data Transfer Object)** adalah sebuah object pattern yang digunakan untuk mentransfer data antar berbagai layer aplikasi, khususnya antara client dan server.

### 🎯 Definisi Sederhana

DTO adalah class TypeScript sederhana yang mendefinisikan:
- **Struktur data** yang diterima dari client
- **Struktur data** yang dikirim ke client
- **Validasi** untuk memastikan data sesuai format

### 💡 Analogi Kehidupan Nyata

Bayangkan DTO seperti **formulir pendaftaran**:

```
┌─────────────────────────────────┐
│   FORMULIR PENDAFTARAN USER     │
├─────────────────────────────────┤
│ Nama:     [________________]    │
│ Email:    [________________]    │
│ Password: [________________]    │
│ Umur:     [___] (minimal 18)    │
└─────────────────────────────────┘
```

Formulir ini:
- ✅ Menentukan field apa saja yang harus diisi
- ✅ Menentukan format yang valid (email harus mengandung @)
- ✅ Menentukan batasan (umur minimal 18 tahun)

## 🏗️ Struktur DTO dalam NestJS

### Contoh Sederhana: DTO Tanpa Validasi

```typescript
// user.dto.ts
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  age: number;
}
```

### Contoh dengan Validasi (Recommended)

```typescript
// create-user.dto.ts
import { IsString, IsEmail, IsInt, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Nama minimal 3 karakter' })
  name: string;

  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;

  @IsInt()
  @Min(18, { message: 'Umur minimal 18 tahun' })
  age: number;
}
```

## 📊 Flow Data dengan DTO

```
CLIENT (Browser/Postman)
    ↓
  [JSON Data]
    ↓
┌─────────────────────┐
│   HTTP Request      │
│  POST /users        │
│  Body: {            │
│    name: "John",    │
│    email: "a@b.com" │
│  }                  │
└─────────────────────┘
    ↓
┌─────────────────────┐
│   DTO VALIDATION    │
│  CreateUserDto      │
│  ✓ Check types      │
│  ✓ Check rules      │
│  ✓ Transform data   │
└─────────────────────┘
    ↓
  [Valid DTO Object]
    ↓
┌─────────────────────┐
│   CONTROLLER        │
│  @Post()            │
│  create(dto) {...}  │
└─────────────────────┘
    ↓
┌─────────────────────┐
│   SERVICE           │
│  Business Logic     │
└─────────────────────┘
    ↓
┌─────────────────────┐
│   DATABASE          │
│  Save Data          │
└─────────────────────┘
```

## 🎓 Contoh Penggunaan dalam Controller

```typescript
// users.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // createUserDto sudah tervalidasi ✅
    // Bisa langsung digunakan dengan aman
    return this.usersService.create(createUserDto);
  }
}
```

## 🔍 Kenapa Pakai DTO, Bukan Langsung Object Biasa?

### ❌ Tanpa DTO (Tidak Aman)

```typescript
@Post()
create(@Body() body: any) {  // ❌ Tidak tahu struktur datanya
  // body bisa berisi apa saja!
  // Tidak ada validasi
  // Rawan error dan security issues
  return this.usersService.create(body);
}
```

**Masalah:**
- Tidak tahu field apa saja yang ada
- Tidak ada type checking
- Tidak ada validasi
- Client bisa kirim data apapun
- Sulit untuk maintenance

### ✅ Dengan DTO (Aman & Terstruktur)

```typescript
@Post()
create(@Body() createUserDto: CreateUserDto) {  // ✅ Jelas strukturnya
  // TypeScript tahu field apa saja
  // Ada validasi otomatis
  // Aman dari data tidak valid
  // Mudah maintenance
  return this.usersService.create(createUserDto);
}
```

**Keuntungan:**
- ✅ Type safety (TypeScript check)
- ✅ Validasi otomatis
- ✅ Auto-complete di IDE
- ✅ Dokumentasi built-in
- ✅ Keamanan lebih baik

## 📝 Jenis-Jenis DTO

### 1. Create DTO

Untuk membuat data baru:

```typescript
// create-product.dto.ts
export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  description: string;
}
```

### 2. Update DTO

Untuk update data (biasanya semua field optional):

```typescript
// update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Semua field dari CreateProductDto jadi optional
export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

### 3. Response DTO

Untuk response ke client (tanpa field sensitive):

```typescript
// user-response.dto.ts
export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  // ❌ Tidak include password!
  createdAt: Date;
}
```

## 🛠️ Setup Validasi di NestJS

### 1. Install Dependencies

```bash
npm install class-validator class-transformer
```

### 2. Enable Global Validation Pipe

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Remove fields yang tidak ada di DTO
    forbidNonWhitelisted: true,  // Throw error jika ada extra fields
    transform: true,  // Transform data ke tipe yang benar
  }));
  
  await app.listen(3000);
}
```

## 📚 Decorators Validasi yang Sering Dipakai

### String Validators

```typescript
import { IsString, MinLength, MaxLength, IsEmail, IsUrl } from 'class-validator';

export class StringExampleDto {
  @IsString()
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsUrl()
  website: string;
}
```

### Number Validators

```typescript
import { IsNumber, IsInt, Min, Max, IsPositive } from 'class-validator';

export class NumberExampleDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsInt()
  age: number;

  @IsPositive()
  price: number;
}
```

### Boolean & Array Validators

```typescript
import { IsBoolean, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class OtherTypesDto {
  @IsBoolean()
  isActive: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  tags: string[];
}
```

### Optional Fields

```typescript
import { IsOptional, IsString } from 'class-validator';

export class OptionalFieldsDto {
  @IsString()
  name: string;  // Required

  @IsOptional()
  @IsString()
  description?: string;  // Optional
}
```

## 🧪 Testing DTO

### Test Request Valid

```bash
# Valid request
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 25
  }'

# Response: ✅ 201 Created
```

### Test Request Invalid

```bash
# Invalid: email salah format
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "invalid-email",
    "password": "pass",
    "age": 15
  }'

# Response: ❌ 400 Bad Request
{
  "statusCode": 400,
  "message": [
    "Email tidak valid",
    "Password minimal 8 karakter",
    "Umur minimal 18 tahun"
  ],
  "error": "Bad Request"
}
```

## 🎯 Best Practices

### ✅ DO: Gunakan DTO untuk Semua Endpoint

```typescript
@Post()
create(@Body() dto: CreateUserDto) { }

@Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdateUserDto) { }
```

### ✅ DO: Pisahkan DTO untuk Create dan Update

```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsString()
  name: string;
  
  @IsEmail()
  email: string;
}

// update-user.dto.ts (semua optional)
export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

### ✅ DO: Gunakan Custom Error Messages

```typescript
export class CreateUserDto {
  @IsEmail({}, { message: 'Email tidak valid! Contoh: user@example.com' })
  email: string;

  @MinLength(8, { message: 'Password harus minimal 8 karakter' })
  password: string;
}
```

### ❌ DON'T: Jangan Pakai `any` Type

```typescript
// ❌ Bad
@Post()
create(@Body() data: any) { }

// ✅ Good
@Post()
create(@Body() dto: CreateUserDto) { }
```

### ❌ DON'T: Jangan Validasi di Controller

```typescript
// ❌ Bad - validasi manual di controller
@Post()
create(@Body() dto: CreateUserDto) {
  if (!dto.email.includes('@')) {
    throw new BadRequestException('Email invalid');
  }
  // ...
}

// ✅ Good - validasi di DTO
export class CreateUserDto {
  @IsEmail()
  email: string;
}
```

## 📊 Ringkasan

| Aspek | Tanpa DTO | Dengan DTO |
|-------|-----------|------------|
| Type Safety | ❌ Tidak ada | ✅ Ada |
| Validasi | ❌ Manual | ✅ Otomatis |
| Auto-complete | ❌ Tidak ada | ✅ Ada |
| Dokumentasi | ❌ Tidak jelas | ✅ Self-documenting |
| Maintainability | ❌ Sulit | ✅ Mudah |
| Security | ❌ Rawan | ✅ Aman |

## 🚀 Next Steps

Setelah memahami DTO, kita akan belajar:
1. **Pipes** - Bagaimana validasi bekerja
2. **Custom Validation** - Membuat validasi sendiri
3. **Transformation** - Mengubah data sebelum masuk controller

## 💡 Tips untuk Student

1. **Selalu gunakan DTO** untuk semua endpoint yang menerima data
2. **Enable ValidationPipe** di main.ts sejak awal project
3. **Buat error message yang jelas** agar client tahu apa yang salah
4. **Pisahkan Create dan Update DTO** untuk fleksibilitas
5. **Jangan expose field sensitive** (password, token) di response DTO

---

**🎓 Practice Exercise:**

Coba buat DTO untuk kasus berikut:
1. Create Product (name, price, stock, category)
2. Update Product (semua field optional)
3. Create Order (productIds, quantity, shippingAddress)

Hint: Gunakan decorators yang sudah dipelajari! 🚀
