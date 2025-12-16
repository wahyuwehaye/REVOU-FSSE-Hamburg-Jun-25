# Testabilities - Membuat Code yang Mudah Di-Test

## 🤔 Apa itu Testability?

**Analogi Sederhana:**
Bayangkan kamu punya mobil:
- **High Testability** 🚗 = Mobil dengan kap mesin yang gampang dibuka, parts terpisah, bisa cek oli tanpa bongkar mesin
- **Low Testability** 🚙 = Mobil yang semua komponennya menyatu, harus bongkar setengah mobil cuma buat ganti busi

**Testability** = Seberapa mudah code kamu untuk **di-test** secara isolated (terpisah).

---

## 🎯 Karakteristik Code yang Testable

### 1. Single Responsibility Principle (SRP) 🎯

**❌ Bad Example - Too Many Responsibilities:**
```typescript
// Service yang ngerjain SEMUA hal (hard to test!)
class UserService {
  createUser(userData: any) {
    // 1. Validate data
    if (!userData.email || !userData.password) {
      throw new Error('Invalid data');
    }

    // 2. Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = bcrypt.hashSync(userData.password, 10);

    // 3. Save to database
    const db = require('./database');
    db.query('INSERT INTO users...');

    // 4. Send email
    const nodemailer = require('nodemailer');
    nodemailer.sendMail({...});

    // 5. Log activity
    console.log('User created');
  }
}

// 😱 Gimana test ini? Harus mock database, email service, bcrypt, console.log...
```

**✅ Good Example - Separated Responsibilities:**
```typescript
// Service dengan single responsibility (easy to test!)
@Injectable()
class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private logger: Logger,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    // This service ONLY handles business logic
    const user = await this.userRepository.create(userData);
    
    await this.emailService.sendWelcomeEmail(user.email);
    this.logger.log(`User created: ${user.id}`);
    
    return user;
  }
}

// 😎 Easy to test! Mock repository, email, logger = done
```

---

### 2. Dependency Injection (DI) 💉

**Kenapa DI penting untuk testability?**
- Bisa **ganti dependencies** dengan mock/fake
- **Loose coupling** - components tidak terikat satu sama lain
- **Flexible** - gampang swap implementation

**❌ Bad Example - Hard-Coded Dependencies:**
```typescript
class OrderService {
  createOrder(orderData: any) {
    // Hard-coded dependency = tidak bisa di-mock!
    const paymentService = new PaymentService();
    const emailService = new EmailService();
    
    paymentService.charge(orderData.amount);
    emailService.send(orderData.email);
  }
}

// 😱 Test ini akan BETULAN hit payment API dan send email!
```

**✅ Good Example - Dependency Injection:**
```typescript
@Injectable()
class OrderService {
  constructor(
    private paymentService: PaymentService,  // Injected!
    private emailService: EmailService,      // Injected!
  ) {}

  createOrder(orderData: CreateOrderDto) {
    this.paymentService.charge(orderData.amount);
    this.emailService.send(orderData.email);
  }
}

// 😎 Test dengan mock PaymentService & EmailService
```

---

### 3. Pure Functions (Predictable & Isolated) 🎲

**Pure Function** = Function yang:
1. Same input → always same output
2. No side effects (tidak ubah state, tidak save ke DB, tidak call API)

**❌ Impure Function (Hard to Test):**
```typescript
let globalCounter = 0; // Global state = BAD!

function incrementCounter() {
  globalCounter++; // Side effect!
  return globalCounter;
}

// Test 1: incrementCounter() → 1 ✅
// Test 2: incrementCounter() → 2 ✅
// Test 3: incrementCounter() → 3 ✅
// 😱 Tests tergantung urutan execution! (Flaky test!)
```

**✅ Pure Function (Easy to Test):**
```typescript
function add(a: number, b: number): number {
  return a + b; // No side effects, predictable
}

// Test 1: add(2, 3) → 5 ✅
// Test 2: add(2, 3) → 5 ✅
// Test 1000: add(2, 3) → 5 ✅
// 😎 Always predictable!
```

---

### 4. Avoid Static Methods & Singletons 🚫

**Static methods** dan **singletons** sulit di-mock.

**❌ Bad Example:**
```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection;

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  query(sql: string) {
    // Real database query
  }
}

class UserService {
  getUsers() {
    // 😱 Cannot mock this!
    const db = DatabaseConnection.getInstance();
    return db.query('SELECT * FROM users');
  }
}
```

**✅ Good Example:**
```typescript
@Injectable()
class UserService {
  constructor(private database: DatabaseService) {}

  getUsers() {
    // 😎 Can easily mock DatabaseService
    return this.database.query('SELECT * FROM users');
  }
}
```

---

## 🧪 Testability Checklist

### ✅ Your Code is Testable If:

1. **Can run in isolation**
   ```typescript
   // Can test without starting the whole app
   const service = new TodoService(mockRepository);
   ```

2. **Dependencies are injectable**
   ```typescript
   constructor(private readonly dep: Dependency) {}
   ```

3. **No hard-coded external calls**
   ```typescript
   // ❌ axios.get('http://api.com')
   // ✅ this.httpService.get(url)
   ```

4. **Functions have clear inputs/outputs**
   ```typescript
   calculateTotal(items: Item[]): number // Clear contract
   ```

5. **No global state**
   ```typescript
   // ❌ global.config
   // ✅ this.configService.get()
   ```

---

## 🏗️ NestJS Architecture = Built for Testability

NestJS dirancang dengan **testability in mind**:

```typescript
// 1. Dependency Injection ✅
@Injectable()
class TodoService {
  constructor(private repo: TodoRepository) {} // Injectable!
}

// 2. Modular Architecture ✅
@Module({
  providers: [TodoService, TodoRepository], // Swappable
  exports: [TodoService],
})
export class TodoModule {}

// 3. Decorators untuk Metadata ✅
@Controller('todos')
class TodoController {
  @Get()
  findAll() {} // Easy to test without HTTP server
}
```

---

## 💡 Making Untestable Code Testable

### Before (Untestable):
```typescript
class UserService {
  registerUser(email: string, password: string) {
    // Hard-coded dependencies
    const bcrypt = require('bcrypt');
    const nodemailer = require('nodemailer');
    const db = require('./database');

    // All logic mixed together
    if (!email.includes('@')) throw new Error('Invalid email');
    const hashed = bcrypt.hashSync(password, 10);
    db.query(`INSERT INTO users VALUES ('${email}', '${hashed}')`);
    nodemailer.sendMail({ to: email, subject: 'Welcome!' });
  }
}
```

### After (Testable):
```typescript
// Step 1: Extract dependencies
@Injectable()
class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService,
    private hashService: HashService,
  ) {}

  // Step 2: Separate concerns
  async registerUser(dto: RegisterUserDto): Promise<User> {
    // Validation happens in DTO with class-validator
    const hashedPassword = await this.hashService.hash(dto.password);
    
    const user = await this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
    });

    await this.emailService.sendWelcome(user.email);
    
    return user;
  }
}

// Step 3: Easy to test!
describe('UserService', () => {
  it('should register user successfully', async () => {
    const mockRepo = { create: jest.fn().mockResolvedValue({ id: 1 }) };
    const mockEmail = { sendWelcome: jest.fn() };
    const mockHash = { hash: jest.fn().mockResolvedValue('hashed') };

    const service = new UserService(mockRepo, mockEmail, mockHash);
    const result = await service.registerUser({ email: 'test@email.com', password: 'pass' });

    expect(result).toEqual({ id: 1 });
    expect(mockEmail.sendWelcome).toHaveBeenCalledWith('test@email.com');
  });
});
```

---

## 🎯 Key Principles for Testable Code

1. **Loose Coupling** 🔗
   - Components tidak tergantung langsung satu sama lain
   - Berkomunikasi lewat interfaces/abstractions

2. **High Cohesion** 🎯
   - Setiap class/function punya tanggung jawab yang jelas
   - Related things stay together

3. **Explicit Dependencies** 📦
   - Semua dependencies di-declare di constructor
   - No hidden/implicit dependencies

4. **Avoid Side Effects** 🚫
   - Functions tidak ubah global state
   - Database/API calls via dependencies, not direct

---

## 📊 Testability Score

Rate your code:

| Criteria | Score | Notes |
|----------|-------|-------|
| Uses DI | ✅/❌ | Dependencies injected via constructor? |
| Single Responsibility | ✅/❌ | Each class does ONE thing? |
| No Global State | ✅/❌ | No global variables or singletons? |
| Pure Functions | ✅/❌ | Most functions predictable & isolated? |
| No Hard-Coded Deps | ✅/❌ | No `new` or `require` in business logic? |

**Scoring:**
- 5/5 ✅ = Excellent testability
- 3-4/5 = Good, minor improvements needed
- 0-2/5 = Refactoring required

---

## 🧠 Remember

> "If your code is hard to test, it's probably hard to maintain too."

**Good testability = Good design**

Testing bukan hanya soal "apakah code works", tapi juga soal **code quality** dan **maintainability**.

---

## 📝 Summary

**Testable Code:**
- ✅ Uses Dependency Injection
- ✅ Single Responsibility per class
- ✅ No global state or singletons
- ✅ Pure functions (predictable)
- ✅ Explicit dependencies
- ✅ Separated concerns (Controller → Service → Repository)

**NestJS helps with:**
- 💉 Built-in Dependency Injection
- 🎯 Modular architecture
- 🧪 Testing utilities (`@nestjs/testing`)

---

## 🔗 Next Steps
- **Materi 03:** Testing Fundamentals - Mulai tulis unit tests dengan Jest
- **Materi 04:** Jest Framework - Deep dive into mocking strategies
