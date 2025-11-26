# User Management API

Demo project focusing on **DTOs, Pipes, and Validation** in NestJS.

## 🎯 Learning Focus

This project demonstrates:
- ✅ Creating DTOs with class-validator
- ✅ Nested DTOs (Address)
- ✅ Custom validation decorators
- ✅ Custom transformation pipes
- ✅ PartialType for updates
- ✅ ValidationPipe configuration
- ✅ TypeORM integration

## 🚀 Features

- **User CRUD Operations**
  - Create user with validation
  - Get all users with pagination
  - Get single user
  - Update user (partial)
  - Delete user
  - Soft delete support

- **Advanced Validation**
  - Email uniqueness check
  - Strong password validation
  - Age validation (18+)
  - Phone number format
  - Nested address validation

- **Custom Pipes**
  - TrimPipe - Remove whitespace
  - LowercaseEmailPipe - Normalize email
  - HashPasswordPipe - Hash password before saving

## 📦 Tech Stack

- NestJS 10
- TypeORM
- PostgreSQL
- class-validator
- class-transformer
- bcrypt

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Create PostgreSQL database:
```sql
CREATE DATABASE user_management_db;
```

### 3. Environment Variables

Create `.env`:
```
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=user_management_db
```

### 4. Run Migrations

```bash
npm run migration:run
```

### 5. Start Development Server

```bash
npm run start:dev
```

API available at: http://localhost:3000

## 📚 API Endpoints

### Users

```
POST   /api/users          Create user
GET    /api/users          Get all users (with pagination)
GET    /api/users/:id      Get user by ID
PATCH  /api/users/:id      Update user
DELETE /api/users/:id      Delete user
POST   /api/users/seed     Seed sample data
```

### Health Check

```
GET    /health             Health check
```

## 🧪 Testing Endpoints

### Create User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "StrongPass123!",
    "age": 25,
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

### Get All Users

```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

### Get User by ID

```bash
curl http://localhost:3000/api/users/1
```

### Update User

```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "phone": "+9876543210"
  }'
```

### Delete User

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## 📁 Project Structure

```
src/
├── main.ts                     # Entry point
├── app.module.ts               # Root module
├── common/
│   ├── pipes/
│   │   ├── trim.pipe.ts        # Trim whitespace
│   │   ├── lowercase-email.pipe.ts
│   │   └── hash-password.pipe.ts
│   └── decorators/
│       └── is-strong-password.decorator.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       ├── address.dto.ts
│       └── pagination-query.dto.ts
└── health/
    └── health.controller.ts
```

## 💡 Key Learning Points

### 1. DTOs with Nested Validation

```typescript
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```

### 2. Custom Pipes

```typescript
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'object') {
      return this.trimObject(value);
    }
    return typeof value === 'string' ? value.trim() : value;
  }
}
```

### 3. PartialType for Updates

```typescript
export class UpdateUserDto extends PartialType(CreateUserDto) {}
// All fields become optional
```

### 4. Global Validation Pipe

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

## 🎓 What You'll Learn

1. **DTO Validation**
   - Required fields validation
   - Email format validation
   - Password strength validation
   - Nested object validation
   - Array validation

2. **Custom Pipes**
   - Creating transformation pipes
   - Creating validation pipes
   - Applying pipes to routes
   - Pipe composition

3. **TypeORM Integration**
   - Entity definition
   - Repository pattern
   - Soft deletes
   - Timestamps

4. **Best Practices**
   - Separation of concerns
   - Input validation
   - Error handling
   - Response formatting

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED
```

**Solution:** Check PostgreSQL is running and credentials in .env

### Validation Error

```
"message": ["email must be an email"]
```

**Solution:** Check request body format and DTO validation rules

## 📝 License

MIT - For educational purposes
