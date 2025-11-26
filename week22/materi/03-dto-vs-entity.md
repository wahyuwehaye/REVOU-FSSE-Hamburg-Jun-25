# Chapter 3: DTO vs Entity - Apa Bedanya?

## 🤔 Pertanyaan yang Sering Muncul

"Kalau DTO dan Entity sama-sama class yang mendefinisikan struktur data, **apa bedanya?** Kenapa tidak pakai satu class saja untuk semuanya?"

Mari kita bedah perbedaannya! 🔍

## 📊 Definisi Dasar

### DTO (Data Transfer Object)

**Purpose:** Untuk transfer data antar layer, khususnya **antara client dan server**

```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

**Karakteristik:**
- ✅ Digunakan di Controller (boundary layer)
- ✅ Fokus pada **validasi input**
- ✅ Shape sesuai dengan **kebutuhan API endpoint**
- ✅ Tidak punya relasi dengan table database
- ✅ Bisa berbeda untuk Create, Update, Response

### Entity (Database Model)

**Purpose:** Representasi **struktur table database**

```typescript
// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
```

**Karakteristik:**
- ✅ Representasi table database
- ✅ Punya decorators TypeORM/Prisma/Sequelize
- ✅ Include metadata database (primary key, relations, timestamps)
- ✅ Satu Entity = Satu Table
- ✅ Tidak berubah-ubah (stable structure)

## 🎭 Perbedaan Fundamental

### 1. Purpose (Tujuan)

| DTO | Entity |
|-----|--------|
| Transfer data HTTP | Struktur database |
| Validasi input | Mapping table |
| External communication | Internal data storage |

### 2. Lifecycle

```
┌─────────────────────────────────────────────────┐
│                  HTTP REQUEST                    │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
            ┌──────────────┐
            │     DTO      │  ← Validasi & Transform
            │ (Boundary)   │
            └──────┬───────┘
                   │
                   ↓
            ┌──────────────┐
            │  Controller  │
            └──────┬───────┘
                   │
                   ↓
            ┌──────────────┐
            │   Service    │  ← Business Logic
            └──────┬───────┘
                   │
                   ↓
            ┌──────────────┐
            │    Entity    │  ← Database Operations
            └──────┬───────┘
                   │
                   ↓
            ┌──────────────┐
            │   Database   │
            └──────────────┘
```

### 3. Field Differences

```typescript
// DTO - Input dari client
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  // ❌ TIDAK punya: id, createdAt, updatedAt
  // Karena client tidak perlu/tidak boleh kirim field ini
}

// Entity - Database structure
export class User {
  id: number;              // ✅ Auto-generated
  name: string;
  email: string;
  password: string;
  isActive: boolean;       // ✅ Default value dari database
  createdAt: Date;         // ✅ Auto-generated
  updatedAt: Date;         // ✅ Auto-generated
}
```

## 🔄 Flow: DTO → Entity

### Complete Flow Example

```typescript
// 1. DTO - Input dari client
// create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// 2. Entity - Database model
// user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// 3. Controller - Receive DTO
// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // DTO sudah tervalidasi ✅
    return this.usersService.create(createUserDto);
  }
}

// 4. Service - Convert DTO to Entity
// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash password sebelum save
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Convert DTO → Entity
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      // isActive, createdAt, updatedAt akan di-set otomatis oleh database
    });

    // Save entity ke database
    return this.userRepository.save(user);
  }
}
```

## 🎯 Kenapa Tidak Pakai Satu Class Saja?

### ❌ Bad Practice: Menggunakan Entity sebagai DTO

```typescript
// ❌ JANGAN LAKUKAN INI!
@Controller('users')
export class UsersController {
  @Post()
  create(@Body() user: User) {  // ❌ Langsung pakai Entity!
    return this.usersService.create(user);
  }
}
```

**Masalah yang timbul:**

#### 1. Security Issues

```bash
# Client bisa set field yang tidak boleh di-set!
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hacker",
    "email": "hack@evil.com",
    "password": "12345",
    "id": 999,                    # ⚠️ Set ID sendiri!
    "isActive": true,             # ⚠️ Langsung aktif!
    "createdAt": "1990-01-01",    # ⚠️ Manipulasi timestamp!
    "role": "ADMIN"               # ⚠️ Jadi admin!
  }'
```

#### 2. Validation Conflicts

```typescript
// Entity punya decorators TypeORM
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;  // ID adalah auto-generated, tapi jika pakai sebagai DTO, client bisa kirim ID!

  @Column({ unique: true })
  email: string;  // Unique constraint adalah database concern, bukan validation concern
}
```

#### 3. Breaking Encapsulation

```typescript
// Entity punya relations
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];  // ⚠️ Client bisa manipulasi orders!
}

// Client bisa inject orders palsu:
{
  "name": "User",
  "orders": [
    { "id": 999, "total": 0, "status": "completed" }  // ⚠️ Order palsu!
  ]
}
```

### ✅ Good Practice: Separate DTO and Entity

```typescript
// DTO - Clean & focused
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
  // Hanya field yang boleh di-input oleh client
}

// Entity - Full database structure
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 📐 Multiple DTOs untuk Satu Entity

### Satu Entity, Banyak DTOs

```typescript
// 1 Entity
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  stock: number;

  @Column()
  description: string;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  createdAt: Date;
}

// Multiple DTOs for different purposes

// DTO untuk Create
export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  description: string;

  @IsInt()
  categoryId: number;
}

// DTO untuk Update (semua optional)
export class UpdateProductDto extends PartialType(CreateProductDto) {}

// DTO untuk Response (tanpa field sensitive)
export class ProductResponseDto {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: CategoryResponseDto;
  createdAt: Date;
  // ❌ Tidak expose internal fields
}

// DTO untuk Query/Filter
export class FilterProductDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;
}
```

## 🔄 Mapping: DTO ↔ Entity

### Manual Mapping

```typescript
@Injectable()
export class ProductsService {
  // DTO → Entity
  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      name: dto.name,
      price: dto.price,
      stock: dto.stock,
      description: dto.description,
      categoryId: dto.categoryId,
      // id, createdAt akan di-set otomatis
    });

    return this.productRepository.save(product);
  }

  // Entity → Response DTO
  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    // Manual mapping
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
      createdAt: product.createdAt,
    };
  }
}
```

### Auto Mapping (dengan library)

```bash
npm install @automapper/core @automapper/classes
```

```typescript
// Create mapping profile
@Injectable()
export class ProductProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Product, ProductResponseDto);
      createMap(mapper, CreateProductDto, Product);
    };
  }
}

// Use in service
async findOne(id: number): Promise<ProductResponseDto> {
  const product = await this.productRepository.findOne({ where: { id } });
  return this.mapper.map(product, Product, ProductResponseDto);
}
```

## 📊 Comparison Table

| Aspek | DTO | Entity |
|-------|-----|--------|
| **Purpose** | Data transfer | Database structure |
| **Location** | Controller, API boundary | Service, Repository |
| **Decorators** | `class-validator` (@IsString, @IsEmail, etc.) | TypeORM (@Entity, @Column, etc.) |
| **Validation** | ✅ Yes (input validation) | ❌ No (database constraints) |
| **Relations** | ❌ No relations | ✅ Yes (@OneToMany, @ManyToOne) |
| **Auto-generated fields** | ❌ No (id, timestamps) | ✅ Yes |
| **Flexibility** | ✅ High (berbeda per endpoint) | ❌ Low (stable structure) |
| **Security** | ✅ Expose only needed fields | ⚠️ May have sensitive fields |
| **Changes** | ✅ Sering (sesuai API needs) | ⚠️ Jarang (schema migration) |

## 🎯 When to Use What?

### Use DTO When:

✅ Receiving data from client (POST, PATCH, PUT)  
✅ Returning data to client (GET responses)  
✅ Need input validation  
✅ Need to hide/transform fields  
✅ Different endpoints need different shapes

### Use Entity When:

✅ Database operations (save, update, delete)  
✅ Defining table structure  
✅ Database relations  
✅ Internal business logic  
✅ Repository methods

## 💡 Best Practices

### 1. Never Use Entity as Input DTO

```typescript
// ❌ Bad
@Post()
create(@Body() user: User) { }

// ✅ Good
@Post()
create(@Body() dto: CreateUserDto) { }
```

### 2. Convert DTO to Entity in Service Layer

```typescript
// ✅ Good
@Injectable()
export class UsersService {
  async create(dto: CreateUserDto): Promise<User> {
    // Convert here, not in controller
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }
}
```

### 3. Don't Return Entity Directly to Client

```typescript
// ❌ Bad - might expose password!
@Get(':id')
async findOne(@Param('id') id: string): Promise<User> {
  return this.usersService.findOne(+id);
}

// ✅ Good - use response DTO
@Get(':id')
async findOne(@Param('id') id: string): Promise<UserResponseDto> {
  return this.usersService.findOne(+id);
}
```

### 4. Use Separate DTOs for Different Operations

```typescript
// ✅ Good separation
CreateUserDto    // For POST /users
UpdateUserDto    // For PATCH /users/:id
UserResponseDto  // For GET /users/:id
UserListDto      // For GET /users (simplified)
FilterUserDto    // For GET /users?filter=...
```

## 🧪 Practical Example: Complete CRUD

```typescript
// ===== ENTITY =====
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  authorId: number;

  @ManyToOne(() => User)
  author: User;

  @Column({ default: 'draft' })
  status: 'draft' | 'published';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ===== DTOs =====
export class CreatePostDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: 'draft' | 'published';
}

export class PostResponseDto {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
  };
  status: string;
  createdAt: Date;
}

// ===== SERVICE =====
@Injectable()
export class PostsService {
  async create(userId: number, dto: CreatePostDto): Promise<PostResponseDto> {
    // DTO → Entity
    const post = this.postRepository.create({
      ...dto,
      authorId: userId,
    });

    const saved = await this.postRepository.save(post);

    // Entity → Response DTO
    return this.toResponseDto(saved);
  }

  async update(id: number, dto: UpdatePostDto): Promise<PostResponseDto> {
    await this.postRepository.update(id, dto);
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    return this.toResponseDto(post);
  }

  private toResponseDto(post: Post): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author.id,
        name: post.author.name,
      },
      status: post.status,
      createdAt: post.createdAt,
    };
  }
}
```

## 🎓 Kesimpulan

- **DTO** = Data yang keluar-masuk API (boundary layer)
- **Entity** = Struktur database (data layer)
- **Jangan campur!** Pisahkan untuk security, flexibility, dan maintainability
- **Multiple DTOs** untuk satu Entity adalah hal yang normal dan recommended
- **Convert** DTO ↔ Entity di **Service layer**, bukan di Controller

---

**Next Chapter:** Deep Dive into DTOs - Advanced patterns & techniques! 🚀
