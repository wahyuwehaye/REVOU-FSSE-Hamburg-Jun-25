# Project Milestone 4 - Banking API Backend Development

## 📋 Overview

In this milestone project, you will apply your NestJS and Prisma skills to build a full-stack banking API. This project will reinforce your understanding of:
- Relational database schema design using Prisma
- Modular architecture in NestJS
- Secure authentication using JWT
- CRUD operations and business logic
- Testing strategies (Unit & Integration tests)
- Production deployment

This project prepares you for real-world backend development scenarios.

---

## 🎯 Goals

The goal of this project is to evaluate your ability to:

✅ **Database Design**
- Design a relational database schema using Prisma
- Set up and connect database (MySQL, PostgreSQL, or SQLite)
- Define proper relationships and constraints

✅ **API Development**
- Build RESTful APIs using NestJS
- Apply modular architecture (Module-Service-Controller)
- Implement secure authentication using JWT
- Develop full CRUD system

✅ **Testing**
- Write unit tests for services
- Write integration tests for endpoints
- Test authentication and authorization
- Achieve minimum 70% code coverage

✅ **Deployment**
- Deploy backend to Railway/Render/Fly.io
- Deploy database to Supabase/TigerData
- Configure environment variables
- Ensure production-ready setup

✅ **Documentation**
- Document API using Swagger
- Write comprehensive README
- Include setup instructions
- Provide API examples

---

## 📖 Expected Output

Your application should be similar in functionality to: **[Pet Store API](https://petstore3.swagger.io/#/)**

**Key Features:**
- User registration and authentication
- Bank account management (CRUD)
- Transaction operations (Deposit, Withdraw, Transfer)
- Transaction history
- Role-based access control
- Comprehensive API documentation
- Full test coverage
- Production deployment

---

## 📜 Scenario

You have been hired as a backend developer to build a secure and scalable banking API for a fictional financial institution named **RevoBank**. 

Your task is to design and implement the core backend services to support essential banking operations.

### 👥 Audience

The API will be consumed by two types of users:

**Customers:**
- Access their account details and balances
- View transaction history
- Initiate transfers between accounts
- Deposit and withdraw funds

**Administrators:**
- Manage all users and accounts
- Review and oversee transactions
- Access system-wide reports
- Ensure system reliability

### 🎯 Purpose

**For Customers:**
- Enable secure access to banking services
- View real-time account balances
- Monitor transaction history
- Perform fund transfers safely

**For Administrators:**
- Provide full access to system management
- Review and audit transaction records
- Manage user accounts
- Ensure compliance and security

---

## 📁 Requirements

### 1. Database Design & Setup

**Technology:** Prisma ORM + Relational Database (PostgreSQL/MySQL/SQLite)

**Required Models:**

#### User Model
```prisma
model User {
  id          String    @id @default(uuid())
  email       String    @unique
  password    String    // Hashed with bcrypt
  firstName   String
  lastName    String
  role        Role      @default(USER)
  accounts    Account[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

#### Account Model
```prisma
model Account {
  id              String        @id @default(uuid())
  accountNumber   String        @unique
  accountType     AccountType
  balance         Decimal       @default(0) @db.Decimal(10, 2)
  currency        String        @default("USD")
  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions    Transaction[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum AccountType {
  SAVINGS
  CHECKING
  INVESTMENT
}
```

#### Transaction Model
```prisma
model Transaction {
  id              String            @id @default(uuid())
  type            TransactionType
  amount          Decimal           @db.Decimal(10, 2)
  description     String?
  status          TransactionStatus @default(COMPLETED)
  fromAccountId   String?
  toAccountId     String?
  fromAccount     Account?          @relation("FromAccount", fields: [fromAccountId], references: [id])
  toAccount       Account?          @relation("ToAccount", fields: [toAccountId], references: [id])
  createdAt       DateTime          @default(now())
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  TRANSFER
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
}
```

**Requirements:**
- ✅ Define proper relationships (one-to-many, many-to-one)
- ✅ Add constraints (NOT NULL, UNIQUE, default values)
- ✅ Add indexes for performance
- ✅ Implement database seeder (optional but recommended)

---

### 2. Backend API (NestJS + Prisma)

**Project Structure:**
```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── dto/
│       └── update-user.dto.ts
├── accounts/
│   ├── accounts.controller.ts
│   ├── accounts.service.ts
│   ├── accounts.module.ts
│   └── dto/
│       ├── create-account.dto.ts
│       └── update-account.dto.ts
├── transactions/
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   ├── transactions.module.ts
│   └── dto/
│       ├── deposit.dto.ts
│       ├── withdraw.dto.ts
│       └── transfer.dto.ts
├── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
└── main.ts
```

---

### 📍 Required API Endpoints

#### 🔐 Authentication Module (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login and get JWT token | ❌ |
| GET | `/auth/profile` | Get current user profile | ✅ |
| POST | `/auth/logout` | Logout (invalidate token) | ✅ |

**Register Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

---

#### 👤 User Module (`/users`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/users/profile` | Get user profile | ✅ | USER |
| PATCH | `/users/profile` | Update user profile | ✅ | USER |
| GET | `/users` | List all users | ✅ | ADMIN |
| GET | `/users/:id` | Get user by ID | ✅ | ADMIN |
| DELETE | `/users/:id` | Delete user | ✅ | ADMIN |

---

#### 🏦 Account Module (`/accounts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/accounts` | Create new account | ✅ |
| GET | `/accounts` | List user's accounts | ✅ |
| GET | `/accounts/:id` | Get account details | ✅ |
| PATCH | `/accounts/:id` | Update account | ✅ |
| DELETE | `/accounts/:id` | Delete account | ✅ |
| GET | `/accounts/:id/balance` | Get account balance | ✅ |

**Create Account Request:**
```json
{
  "accountType": "SAVINGS",
  "currency": "USD",
  "initialDeposit": 1000.00
}
```

**Account Response:**
```json
{
  "id": "uuid",
  "accountNumber": "ACC-1234567890",
  "accountType": "SAVINGS",
  "balance": 1000.00,
  "currency": "USD",
  "userId": "uuid",
  "createdAt": "2025-12-18T10:00:00Z"
}
```

---

#### 💸 Transaction Module (`/transactions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/transactions/deposit` | Deposit to account | ✅ |
| POST | `/transactions/withdraw` | Withdraw from account | ✅ |
| POST | `/transactions/transfer` | Transfer between accounts | ✅ |
| GET | `/transactions` | List user transactions | ✅ |
| GET | `/transactions/:id` | Get transaction details | ✅ |
| GET | `/accounts/:id/transactions` | List account transactions | ✅ |

**Deposit Request:**
```json
{
  "accountId": "uuid",
  "amount": 500.00,
  "description": "Salary deposit"
}
```

**Withdraw Request:**
```json
{
  "accountId": "uuid",
  "amount": 200.00,
  "description": "ATM withdrawal"
}
```

**Transfer Request:**
```json
{
  "fromAccountId": "uuid",
  "toAccountId": "uuid",
  "amount": 300.00,
  "description": "Payment to John"
}
```

**Transaction Response:**
```json
{
  "id": "uuid",
  "type": "TRANSFER",
  "amount": 300.00,
  "description": "Payment to John",
  "status": "COMPLETED",
  "fromAccountId": "uuid",
  "toAccountId": "uuid",
  "createdAt": "2025-12-18T10:30:00Z"
}
```

---

### 3. Authentication & Authorization

**Requirements:**

✅ **JWT Authentication**
- Implement using `@nestjs/jwt` and `@nestjs/passport`
- Token expiration: 1 hour (configurable)
- Refresh token support (optional)
- Secure password hashing with bcrypt (10 rounds minimum)

✅ **Authorization Guards**
```typescript
// JWT Guard - Verify token
@UseGuards(JwtAuthGuard)

// Roles Guard - Check user role
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')

// Owner Guard - Verify resource ownership
@UseGuards(JwtAuthGuard, OwnerGuard)
```

✅ **Access Control**
- Users can only access their own accounts and transactions
- Admins can access all users' data
- Proper error messages for unauthorized access (401, 403)

**Example Implementation:**
```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
```

---

### 4. Testing

**Testing Strategy:**

#### Unit Tests
```typescript
// accounts.service.spec.ts
describe('AccountsService', () => {
  it('should create account successfully', async () => {
    const dto = {
      accountType: 'SAVINGS',
      currency: 'USD',
      initialDeposit: 1000
    };
    
    const account = await service.create(dto, userId);
    
    expect(account).toBeDefined();
    expect(account.balance).toBe(1000);
  });

  it('should throw error for insufficient balance', async () => {
    await expect(
      service.withdraw(accountId, 5000)
    ).rejects.toThrow('Insufficient balance');
  });
});
```

#### Integration Tests
```typescript
// accounts.e2e-spec.ts
describe('Accounts (e2e)', () => {
  it('/accounts (POST) should create account', () => {
    return request(app.getHttpServer())
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        accountType: 'SAVINGS',
        currency: 'USD',
        initialDeposit: 1000
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.balance).toBe(1000);
      });
  });
});
```

**Testing Requirements:**
- ✅ Minimum 70% code coverage
- ✅ Test all service methods
- ✅ Test authentication flows
- ✅ Test authorization (guards)
- ✅ Test business logic (balance checks, transfers)
- ✅ Test error scenarios (404, 401, 400)

**Test Commands:**
```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Watch mode
npm run test:watch
```

---

### 5. Deployment

#### Database Deployment

**Option 1: Supabase (PostgreSQL)**
```bash
# 1. Create project at supabase.com
# 2. Get connection string
# 3. Add to .env.production

DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres?pgbouncer=true"
```

**Option 2: TigerData**
```bash
# Similar to Supabase, follow platform instructions
```

**Option 3: Railway PostgreSQL**
```bash
# Add PostgreSQL plugin in Railway dashboard
# Connection string automatically provided
```

#### Backend Deployment

**Option 1: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add postgresql

# Deploy
railway up

# Set environment variables
railway variables set JWT_SECRET=your-secret
railway variables set NODE_ENV=production
```

**Option 2: Render**
```yaml
# render.yaml
services:
  - type: web
    name: banking-api
    env: node
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
```

**Option 3: Fly.io**
```bash
# Install flyctl
brew install flyctl

# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy
```

#### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run successfully
- [ ] Prisma client generated
- [ ] Health check endpoint working (`/health`)
- [ ] API accessible via public URL
- [ ] HTTPS enabled
- [ ] CORS configured for frontend
- [ ] Error tracking set up (optional)
- [ ] Logging configured

---

## 🚀 Deliverables

### 1. Deployed API ✅

**Requirements:**
- Live and functional deployment
- Accessible via public URL
- Connected to hosted database
- All endpoints working

**Example:** `https://banking-api-production.railway.app`

**Test Command:**
```bash
curl https://your-api-url.com/health
```

---

### 2. Source Code Repository ✅

**Requirements:**
- GitHub repository with complete code
- Clear folder structure
- Proper commit history
- `.gitignore` includes `.env`, `node_modules`, `dist`

**Repository Structure:**
```
banking-api/
├── src/
├── test/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── docker-compose.yml (optional)
```

---

### 3. Documentation (README.md) ✅

**Required Sections:**

#### Project Overview
```markdown
# RevoBank API

A secure and scalable banking API built with NestJS and Prisma. 
Supports user authentication, account management, and transaction operations.

**Live Demo:** https://your-api.railway.app
**API Documentation:** https://your-api.railway.app/api/docs
```

#### Features Implemented
```markdown
## Features

- ✅ User registration and JWT authentication
- ✅ Bank account creation and management (CRUD)
- ✅ Transaction operations (Deposit, Withdraw, Transfer)
- ✅ Transaction history and filtering
- ✅ Role-based access control (User, Admin)
- ✅ Comprehensive test coverage (70%+)
- ✅ API documentation with Swagger
- ✅ Production deployment
```

#### Technologies Used
```markdown
## Tech Stack

- **Framework:** NestJS 10
- **ORM:** Prisma 5
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT (@nestjs/jwt)
- **Testing:** Jest
- **Deployment:** Railway
- **Documentation:** Swagger
```

#### Setup Instructions
```markdown
## Local Setup

1. Clone repository:
\`\`\`bash
git clone https://github.com/yourusername/banking-api.git
cd banking-api
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment:
\`\`\`bash
cp .env.example .env
# Edit .env with your database credentials
\`\`\`

4. Run migrations:
\`\`\`bash
npx prisma migrate dev
\`\`\`

5. Seed database (optional):
\`\`\`bash
npx prisma db seed
\`\`\`

6. Start development server:
\`\`\`bash
npm run start:dev
\`\`\`

7. Access API:
- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs
```

#### API Examples
```markdown
## API Usage

### Register User
\`\`\`bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
\`\`\`

### Login
\`\`\`bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
\`\`\`
```

#### Screenshots (Optional)
```markdown
## Screenshots

### API Documentation (Swagger)
![Swagger](./docs/swagger-screenshot.png)

### Postman Tests
![Postman](./docs/postman-tests.png)
```

---

## 🔍 Grading Rubric

Your project will be evaluated based on:

### ✅ Database Schema (15 points)

- [ ] Prisma schema includes User, Account, Transaction models (5 pts)
- [ ] Proper relationships established (one-to-many, many-to-one) (5 pts)
- [ ] Constraints defined (NOT NULL, UNIQUE, defaults) (3 pts)
- [ ] Indexes added for performance (2 pts)

### ✅ Database Connection (10 points)

- [ ] Prisma properly configured and connected (4 pts)
- [ ] Environment variables used correctly (3 pts)
- [ ] Migrations run without errors (3 pts)

### ✅ NestJS API Structure (20 points)

- [ ] Follows modular architecture (module-service-controller) (8 pts)
- [ ] All required endpoints implemented (8 pts)
- [ ] DTOs and validation used properly (4 pts)

### ✅ CRUD Operations (15 points)

- [ ] User operations (register, login, profile) (5 pts)
- [ ] Account operations (create, read, update, delete) (5 pts)
- [ ] Transaction operations (deposit, withdraw, transfer) (5 pts)

### ✅ Authentication & Authorization (15 points)

- [ ] JWT authentication implemented (6 pts)
- [ ] Guards protect routes properly (4 pts)
- [ ] Role-based access control working (3 pts)
- [ ] Users can only access own data (2 pts)

### ✅ Testing (10 points)

- [ ] Unit tests written and passing (4 pts)
- [ ] Integration/E2E tests implemented (3 pts)
- [ ] Minimum 70% code coverage (3 pts)

### ✅ API Documentation (5 points)

- [ ] Swagger documentation complete (3 pts)
- [ ] All endpoints documented with examples (2 pts)

### ✅ Deployment (10 points)

- [ ] Deployed to cloud platform (4 pts)
- [ ] Connected to hosted database (3 pts)
- [ ] Public URL accessible and functional (3 pts)

**Total: 100 points**

**Grading Scale:**
- A: 90-100 points
- B: 80-89 points
- C: 70-79 points
- D: 60-69 points
- F: Below 60 points

---

## 📚 Resources

### Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT Best Practices](https://jwt.io/introduction)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [Swagger Editor](https://editor.swagger.io/) - API design
- [TablePlus](https://tableplus.com/) - Database GUI

### Deployment Platforms
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Fly.io](https://fly.io/)
- [Supabase](https://supabase.com/)

### Testing
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://testingjavascript.com/)

---

## 💡 Tips for Success

### Development Tips

1. **Start with Database Schema**
   - Design schema first
   - Test relationships
   - Add proper constraints

2. **Implement Authentication Early**
   - Get JWT working first
   - Test token generation
   - Implement guards

3. **Test as You Go**
   - Write tests alongside features
   - Don't wait until the end
   - Use TDD approach

4. **Use Git Properly**
   - Commit frequently
   - Write clear commit messages
   - Use feature branches

### Common Pitfalls to Avoid

❌ **DON'T:**
- Commit `.env` files to Git
- Skip validation on DTOs
- Ignore error handling
- Forget to hash passwords
- Deploy without testing

✅ **DO:**
- Use environment variables
- Validate all inputs
- Handle errors gracefully
- Hash passwords with bcrypt
- Test before deployment

### Time Management

**Week 1: Database & Auth (Days 1-3)**
- Day 1: Database schema and setup
- Day 2: User authentication (register/login)
- Day 3: JWT implementation and guards

**Week 2: Core Features (Days 4-6)**
- Day 4: Account CRUD operations
- Day 5: Transaction operations
- Day 6: Business logic and validation

**Week 3: Testing & Polish (Days 7-9)**
- Day 7: Unit tests for services
- Day 8: Integration tests
- Day 9: Bug fixes and refinement

**Week 4: Deployment (Days 10-12)**
- Day 10: Swagger documentation
- Day 11: Deployment setup
- Day 12: Final testing and submission

---

## 🎯 Bonus Challenges (Optional)

Want to go above and beyond? Try these:

### 1. Advanced Features
- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Account statements (PDF generation)
- [ ] Scheduled transactions
- [ ] Account freezing/suspension

### 2. Technical Improvements
- [ ] Redis caching for performance
- [ ] Rate limiting to prevent abuse
- [ ] GraphQL alternative to REST
- [ ] WebSocket for real-time notifications
- [ ] Database replication
- [ ] Microservices architecture

### 3. DevOps
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring with Sentry
- [ ] Logging with Winston
- [ ] Performance profiling
- [ ] Load testing with Artillery

---

## 📞 Support

If you need help:

1. **Check Documentation:** Review NestJS and Prisma docs
2. **Ask Questions:** Use class discussion forum
3. **Office Hours:** Schedule 1-on-1 with instructor
4. **Peer Review:** Ask classmates for feedback

---

## 📝 Submission

**Due Date:** [INSERT DATE]

**Submission Format:**
1. GitHub repository URL
2. Deployed API URL
3. README.md with all required sections
4. (Optional) Video demo or presentation

**Submit to:** [INSERT SUBMISSION LINK]

---

Good luck! Remember: This project demonstrates everything you've learned. Take your time, test thoroughly, and build something you're proud of! 🚀💪

---

**Note:** This specification is based on Pet Store API example and follows industry best practices for backend development.
