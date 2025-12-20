# Banking API - Implementation Guide

## 🚀 Step-by-Step Implementation Guide

This guide will walk you through implementing the complete Banking API from scratch.

---

## Phase 1: Project Setup (Day 1)

### Step 1: Initialize NestJS Project

```bash
# Install NestJS CLI
npm install -g @nestjs/cli

# Create new project
nest new banking-api

# Navigate to project
cd banking-api

# Install required dependencies
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install @prisma/client
npm install -D @types/passport-jwt @types/bcrypt prisma

# Install validation
npm install class-validator class-transformer

# Install Swagger
npm install @nestjs/swagger swagger-ui-express

# Install testing utilities
npm install -D @nestjs/testing
```

### Step 2: Setup Prisma

```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env
```

### Step 3: Configure Environment Variables

Create `.env`:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/banking_dev?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
JWT_EXPIRES_IN="1h"

# Application
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3001"
```

Create `.env.example`:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database_name"

# JWT
JWT_SECRET="change-this-to-a-secure-secret"
JWT_EXPIRES_IN="1h"

# Application
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3001"
```

### Step 4: Update .gitignore

```bash
# Add to .gitignore
.env
.env.local
.env.*.local
dist
node_modules
coverage
```

---

## Phase 2: Database Schema (Day 1-2)

### Step 1: Define Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum AccountType {
  SAVINGS
  CHECKING
  INVESTMENT
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

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  firstName String
  lastName  String
  role      Role      @default(USER)
  accounts  Account[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("users")
}

model Account {
  id                  String        @id @default(uuid())
  accountNumber       String        @unique
  accountType         AccountType
  balance             Decimal       @default(0) @db.Decimal(10, 2)
  currency            String        @default("USD")
  isActive            Boolean       @default(true)
  userId              String
  user                User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactionsFrom    Transaction[] @relation("FromAccount")
  transactionsTo      Transaction[] @relation("ToAccount")
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt

  @@index([userId])
  @@index([accountNumber])
  @@map("accounts")
}

model Transaction {
  id            String            @id @default(uuid())
  type          TransactionType
  amount        Decimal           @db.Decimal(10, 2)
  description   String?
  status        TransactionStatus @default(COMPLETED)
  fromAccountId String?
  toAccountId   String?
  fromAccount   Account?          @relation("FromAccount", fields: [fromAccountId], references: [id])
  toAccount     Account?          @relation("ToAccount", fields: [toAccountId], references: [id])
  createdAt     DateTime          @default(now())

  @@index([fromAccountId])
  @@index([toAccountId])
  @@index([createdAt])
  @@map("transactions")
}
```

### Step 2: Generate Migration

```bash
# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### Step 3: Create Prisma Service

```bash
# Generate Prisma module
nest g module prisma
nest g service prisma
```

Edit `src/prisma/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

Update `src/prisma/prisma.module.ts`:

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### Step 4: Create Database Seeder (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@revobank.com' },
    update: {},
    create: {
      email: 'admin@revobank.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // Create regular users
  const userPassword = await bcrypt.hash('User123!', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: userPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'USER',
    },
  });

  // Create accounts for John
  const johnSavings = await prisma.account.create({
    data: {
      accountNumber: `ACC-${Date.now()}-001`,
      accountType: 'SAVINGS',
      balance: 5000,
      currency: 'USD',
      userId: user1.id,
    },
  });

  const johnChecking = await prisma.account.create({
    data: {
      accountNumber: `ACC-${Date.now()}-002`,
      accountType: 'CHECKING',
      balance: 2000,
      currency: 'USD',
      userId: user1.id,
    },
  });

  // Create accounts for Jane
  const janeSavings = await prisma.account.create({
    data: {
      accountNumber: `ACC-${Date.now()}-003`,
      accountType: 'SAVINGS',
      balance: 10000,
      currency: 'USD',
      userId: user2.id,
    },
  });

  // Create sample transactions
  await prisma.transaction.create({
    data: {
      type: 'DEPOSIT',
      amount: 5000,
      description: 'Initial deposit',
      status: 'COMPLETED',
      toAccountId: johnSavings.id,
    },
  });

  await prisma.transaction.create({
    data: {
      type: 'TRANSFER',
      amount: 1000,
      description: 'Transfer to checking',
      status: 'COMPLETED',
      fromAccountId: johnSavings.id,
      toAccountId: johnChecking.id,
    },
  });

  console.log('✅ Database seeded successfully');
  console.log('\n📊 Created:');
  console.log(`  - 3 users (1 admin, 2 regular)`);
  console.log(`  - 3 accounts`);
  console.log(`  - 2 transactions`);
  console.log('\n🔐 Test Credentials:');
  console.log('  Admin: admin@revobank.com / Admin123!');
  console.log('  User: john@example.com / User123!');
  console.log('  User: jane@example.com / User123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Install ts-node:
```bash
npm install -D ts-node
```

Run seeder:
```bash
npx prisma db seed
```

---

## Phase 3: Authentication Module (Day 2-3)

### Step 1: Generate Auth Module

```bash
nest g module auth
nest g service auth
nest g controller auth
```

### Step 2: Create DTOs

Create `src/auth/dto/register.dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
```

Create `src/auth/dto/login.dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### Step 3: Implement Auth Service

Edit `src/auth/auth.service.ts`:

```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
```

### Step 4: Implement Auth Controller

Edit `src/auth/auth.controller.ts`:

```typescript
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return req.user;
  }
}
```

### Step 5: Create JWT Strategy

Create `src/auth/strategies/jwt.strategy.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
```

### Step 6: Create Guards

Create `src/auth/guards/jwt-auth.guard.ts`:

```typescript
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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

Create `src/auth/guards/roles.guard.ts`:

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    return true;
  }
}
```

Create decorator `src/auth/decorators/roles.decorator.ts`:

```typescript
import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
```

### Step 7: Configure Auth Module

Edit `src/auth/auth.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN') || '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## Phase 4: Accounts Module (Day 4)

### Step 1: Generate Module

```bash
nest g module accounts
nest g service accounts
nest g controller accounts
```

### Step 2: Create DTOs

Create `src/accounts/dto/create-account.dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { AccountType } from '@prisma/client';

export class CreateAccountDto {
  @ApiProperty({ enum: AccountType, example: 'SAVINGS' })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty({ example: 'USD', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @ApiProperty({ example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  initialDeposit?: number = 0;
}
```

### Step 3: Implement Service

Edit `src/accounts/accounts.service.ts`:

```typescript
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAccountDto, userId: string) {
    // Generate unique account number
    const accountNumber = `ACC-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const account = await this.prisma.account.create({
      data: {
        accountNumber,
        accountType: dto.accountType,
        balance: dto.initialDeposit || 0,
        currency: dto.currency || 'USD',
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create initial deposit transaction if amount > 0
    if (dto.initialDeposit > 0) {
      await this.prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          amount: dto.initialDeposit,
          description: 'Initial deposit',
          status: 'COMPLETED',
          toAccountId: account.id,
        },
      });
    }

    return account;
  }

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            transactionsFrom: true,
            transactionsTo: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return account;
  }

  async getBalance(id: string, userId: string) {
    const account = await this.findOne(id, userId);
    
    return {
      accountNumber: account.accountNumber,
      balance: account.balance,
      currency: account.currency,
      accountType: account.accountType,
    };
  }

  async remove(id: string, userId: string) {
    const account = await this.findOne(id, userId);

    if (account.balance > 0) {
      throw new BadRequestException('Cannot delete account with positive balance');
    }

    await this.prisma.account.delete({
      where: { id },
    });

    return { message: 'Account deleted successfully' };
  }
}
```

### Step 4: Implement Controller

Edit `src/accounts/accounts.controller.ts`:

```typescript
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new account' })
  @ApiResponse({ status: 201, description: 'Account created' })
  create(@Body() dto: CreateAccountDto, @Request() req) {
    return this.accountsService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all user accounts' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved' })
  findAll(@Request() req) {
    return this.accountsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account details' })
  @ApiResponse({ status: 200, description: 'Account retrieved' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.accountsService.findOne(id, req.user.id);
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get account balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved' })
  getBalance(@Param('id') id: string, @Request() req) {
    return this.accountsService.getBalance(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted' })
  @ApiResponse({ status: 400, description: 'Cannot delete account with balance' })
  remove(@Param('id') id: string, @Request() req) {
    return this.accountsService.remove(id, req.user.id);
  }
}
```

---

## Phase 5: Transactions Module (Day 5)

### Step 1: Create Transaction DTOs

Create `src/transactions/dto/deposit.dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  @ApiProperty({ example: 100.00, minimum: 0.01 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
```

Create `src/transactions/dto/withdraw.dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  @ApiProperty({ example: 50.00, minimum: 0.01 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
```

Create `src/transactions/dto/transfer.dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty()
  @IsUUID()
  fromAccountId: string;

  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  @IsNotEmpty()
  @IsUUID()
  toAccountId: string;

  @ApiProperty({ example: 75.00, minimum: 0.01 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
```

### Step 2: Create Transactions Service

Create `src/transactions/transactions.service.ts`:

```typescript
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { TransactionType, TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async deposit(dto: DepositDto, userId: string) {
    // Verify account ownership
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('You do not own this account');
    }

    // Create transaction and update balance in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update account balance
      const updatedAccount = await tx.account.update({
        where: { id: dto.accountId },
        data: { balance: { increment: dto.amount } },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.DEPOSIT,
          amount: dto.amount,
          status: TransactionStatus.COMPLETED,
          toAccountId: dto.accountId,
          description: `Deposit of ${dto.amount}`,
        },
        include: {
          toAccount: true,
        },
      });

      return { transaction, newBalance: updatedAccount.balance };
    });

    return {
      message: 'Deposit successful',
      transaction: result.transaction,
      newBalance: result.newBalance,
    };
  }

  async withdraw(dto: WithdrawDto, userId: string) {
    // Verify account ownership
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('You do not own this account');
    }

    // Check sufficient balance
    if (account.balance.toNumber() < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create transaction and update balance
    const result = await this.prisma.$transaction(async (tx) => {
      // Update account balance
      const updatedAccount = await tx.account.update({
        where: { id: dto.accountId },
        data: { balance: { decrement: dto.amount } },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.WITHDRAWAL,
          amount: dto.amount,
          status: TransactionStatus.COMPLETED,
          fromAccountId: dto.accountId,
          description: `Withdrawal of ${dto.amount}`,
        },
        include: {
          fromAccount: true,
        },
      });

      return { transaction, newBalance: updatedAccount.balance };
    });

    return {
      message: 'Withdrawal successful',
      transaction: result.transaction,
      newBalance: result.newBalance,
    };
  }

  async transfer(dto: TransferDto, userId: string) {
    // Verify from account ownership
    const fromAccount = await this.prisma.account.findUnique({
      where: { id: dto.fromAccountId },
    });

    if (!fromAccount) {
      throw new NotFoundException('From account not found');
    }

    if (fromAccount.userId !== userId) {
      throw new ForbiddenException('You do not own the from account');
    }

    // Verify to account exists
    const toAccount = await this.prisma.account.findUnique({
      where: { id: dto.toAccountId },
    });

    if (!toAccount) {
      throw new NotFoundException('To account not found');
    }

    // Cannot transfer to same account
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    // Check sufficient balance
    if (fromAccount.balance.toNumber() < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Perform transfer in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Deduct from sender
      const updatedFromAccount = await tx.account.update({
        where: { id: dto.fromAccountId },
        data: { balance: { decrement: dto.amount } },
      });

      // Add to receiver
      await tx.account.update({
        where: { id: dto.toAccountId },
        data: { balance: { increment: dto.amount } },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: dto.amount,
          status: TransactionStatus.COMPLETED,
          fromAccountId: dto.fromAccountId,
          toAccountId: dto.toAccountId,
          description: `Transfer of ${dto.amount} to ${toAccount.accountNumber}`,
        },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });

      return { transaction, newBalance: updatedFromAccount.balance };
    });

    return {
      message: 'Transfer successful',
      transaction: result.transaction,
      newBalance: result.newBalance,
    };
  }

  async findAll(userId: string, accountId?: string) {
    const where: any = {
      OR: [
        { fromAccount: { userId } },
        { toAccount: { userId } },
      ],
    };

    // Filter by specific account if provided
    if (accountId) {
      where.OR = [
        { fromAccountId: accountId },
        { toAccountId: accountId },
      ];
    }

    return this.prisma.transaction.findMany({
      where,
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountType: true,
          },
        },
        toAccount: {
          select: {
            accountNumber: true,
            accountType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        fromAccount: true,
        toAccount: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // Verify user has access to this transaction
    const hasAccess =
      transaction.fromAccount?.userId === userId ||
      transaction.toAccount?.userId === userId;

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this transaction');
    }

    return transaction;
  }
}
```

### Step 3: Create Transactions Controller

Create `src/transactions/transactions.controller.ts`:

```typescript
import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money into an account' })
  @ApiResponse({ status: 201, description: 'Deposit successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  deposit(@Body() dto: DepositDto, @Request() req) {
    return this.transactionsService.deposit(dto, req.user.id);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from an account' })
  @ApiResponse({ status: 201, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Insufficient balance' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  withdraw(@Body() dto: WithdrawDto, @Request() req) {
    return this.transactionsService.withdraw(dto, req.user.id);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money between accounts' })
  @ApiResponse({ status: 201, description: 'Transfer successful' })
  @ApiResponse({ status: 400, description: 'Insufficient balance or invalid accounts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  transfer(@Body() dto: TransferDto, @Request() req) {
    return this.transactionsService.transfer(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for current user' })
  @ApiQuery({ name: 'accountId', required: false, description: 'Filter by account ID' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req, @Query('accountId') accountId?: string) {
    return this.transactionsService.findAll(req.user.id, accountId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.transactionsService.findOne(id, req.user.id);
  }
}
```

### Step 4: Create Transactions Module

Create `src/transactions/transactions.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
```

### Step 5: Register Transactions Module

Update `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module'; // Add this

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule, // Add this
  ],
})
export class AppModule {}
```

---

## Phase 6: Testing (Day 6-7)

### Step 1: Create Unit Tests for Auth Service

Create `src/auth/auth.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        id: '1',
        ...registerDto,
        password: 'hashed_password',
        role: 'USER',
      });

      const result = await service.register(registerDto);

      expect(result.email).toBe(registerDto.email);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: '1', email: registerDto.email });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should return access token for valid credentials', async () => {
      const user = {
        id: '1',
        email: loginDto.email,
        password: await bcrypt.hash(loginDto.password, 10),
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.login(loginDto);

      expect(result.access_token).toBe('jwt_token');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const user = {
        id: '1',
        email: loginDto.email,
        password: await bcrypt.hash('DifferentPassword123!', 10),
      };

      mockUsersService.findByEmail.mockResolvedValue(user);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
```

### Step 2: Create Unit Tests for Accounts Service

Create `src/accounts/accounts.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('AccountsService', () => {
  let service: AccountsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    account: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      accountType: 'SAVINGS' as any,
      currency: 'USD',
      initialDeposit: 100,
    };
    const userId = 'user-1';

    it('should create account with initial deposit', async () => {
      const mockAccount = {
        id: '1',
        accountNumber: '1234567890',
        ...createDto,
        balance: 100,
        userId,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrismaService);
      });
      mockPrismaService.account.create.mockResolvedValue(mockAccount);

      const result = await service.create(createDto, userId);

      expect(result.balance).toBe(100);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should create account without initial deposit', async () => {
      const dtoWithoutDeposit = { ...createDto, initialDeposit: 0 };
      const mockAccount = {
        id: '1',
        accountNumber: '1234567890',
        ...dtoWithoutDeposit,
        balance: 0,
        userId,
      };

      mockPrismaService.account.create.mockResolvedValue(mockAccount);

      const result = await service.create(dtoWithoutDeposit, userId);

      expect(result.balance).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return account if owned by user', async () => {
      const userId = 'user-1';
      const mockAccount = {
        id: '1',
        userId,
        accountNumber: '1234567890',
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      const result = await service.findOne('1', userId);

      expect(result).toEqual(mockAccount);
    });

    it('should throw NotFoundException if account does not exist', async () => {
      mockPrismaService.account.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own account', async () => {
      const mockAccount = {
        id: '1',
        userId: 'user-2',
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      await expect(service.findOne('1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete account if balance is zero', async () => {
      const mockAccount = {
        id: '1',
        userId: 'user-1',
        balance: 0,
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);
      mockPrismaService.account.delete.mockResolvedValue(mockAccount);

      const result = await service.remove('1', 'user-1');

      expect(result.message).toBe('Account deleted successfully');
      expect(mockPrismaService.account.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw BadRequestException if balance is not zero', async () => {
      const mockAccount = {
        id: '1',
        userId: 'user-1',
        balance: 100,
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      await expect(service.remove('1', 'user-1')).rejects.toThrow(BadRequestException);
    });
  });
});
```

### Step 3: Create Integration Tests

Create `test/auth.e2e-spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDatabase(); // Implement this helper
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe('test@example.com');
          expect(res.body.password).toBeUndefined();
        });
    });

    it('should reject duplicate email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(409);
    });

    it('should reject invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);
    });
  });
});
```

### Step 4: Configure Test Coverage

Update `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

Run tests:

```bash
# Unit tests
npm test

# With coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## Phase 7: Swagger Documentation (Day 8)

### Step 1: Configure Swagger

Update `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('RevoBank API')
    .setDescription('Banking API for managing accounts and transactions')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('accounts', 'Account management endpoints')
    .addTag('transactions', 'Transaction endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api`);
}
bootstrap();
```

### Step 2: Add Response Examples

Update DTOs with example responses. For example, in `src/auth/dto/login.dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;
}
```

### Step 3: Test API Documentation

1. Start the server: `npm run start:dev`
2. Open browser: `http://localhost:3000/api`
3. Test endpoints using Swagger UI
4. Verify all endpoints are documented
5. Test JWT authentication in Swagger

---

## Phase 8: Deployment (Day 9-10)

### Step 1: Create Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run migrations and start app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
```

Create `.dockerignore`:

```
node_modules
dist
.env
.git
.gitignore
README.md
docker-compose.yml
.dockerignore
Dockerfile
*.log
coverage
.vscode
.idea
```

### Step 2: Test Docker Build

```bash
# Build image
docker build -t revobank-api .

# Run container locally
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e JWT_SECRET="your_secret" \
  revobank-api

# Test endpoints
curl http://localhost:3000/api
```

### Step 3: Deploy to Railway

1. **Create Railway Account**: Sign up at railway.app

2. **Install Railway CLI**:
```bash
npm install -g @railway/cli
railway login
```

3. **Initialize Project**:
```bash
railway init
```

4. **Add PostgreSQL**:
```bash
railway add --database postgres
```

5. **Set Environment Variables**:
```bash
railway variables set JWT_SECRET=your-super-secret-jwt-key-min-32-chars
railway variables set PORT=3000
```

6. **Deploy**:
```bash
railway up
```

7. **Run Migrations**:
```bash
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

8. **Get Public URL**:
```bash
railway domain
```

### Step 4: Deploy to Render (Alternative)

1. **Create Render Account**: Sign up at render.com

2. **Create New Web Service**:
   - Connect your GitHub repository
   - Select "Docker" as environment
   - Set build command: (automatic from Dockerfile)
   - Set start command: (automatic from Dockerfile)

3. **Add PostgreSQL**:
   - Create new PostgreSQL database
   - Copy Internal Database URL

4. **Set Environment Variables**:
   - `DATABASE_URL`: (from Render PostgreSQL)
   - `JWT_SECRET`: your-super-secret-jwt-key
   - `NODE_ENV`: production
   - `PORT`: 3000

5. **Deploy**: Click "Create Web Service"

### Step 5: Create Health Check Endpoint

Update `src/app.controller.ts`:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API root' })
  root() {
    return {
      message: 'RevoBank API is running',
      version: '1.0.0',
      docs: '/api',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  health() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

### Step 6: Setup CI/CD with GitHub Actions

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Run tests
        run: npm run test:cov
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          JWT_SECRET: test-secret-key-for-ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up --service ${{ secrets.RAILWAY_SERVICE_ID }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Step 7: Post-Deployment Verification

Create a test script `test-api.sh`:

```bash
#!/bin/bash

API_URL="https://your-app.railway.app"

echo "Testing API endpoints..."

# Test health check
echo "1. Health check:"
curl -s $API_URL/health | jq

# Register user
echo -e "\n2. Register user:"
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "Demo123!",
    "firstName": "Demo",
    "lastName": "User"
  }')
echo $REGISTER_RESPONSE | jq

# Login
echo -e "\n3. Login:"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "Demo123!"
  }')
echo $LOGIN_RESPONSE | jq

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

# Create account
echo -e "\n4. Create account:"
ACCOUNT_RESPONSE=$(curl -s -X POST $API_URL/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "accountType": "SAVINGS",
    "currency": "USD",
    "initialDeposit": 1000
  }')
echo $ACCOUNT_RESPONSE | jq

echo -e "\n✅ All tests completed!"
```

Make it executable and run:

```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Phase 9: Final Documentation (Day 11)

### Step 1: Create Comprehensive README

Update your project `README.md` with:

- Project overview and features
- Tech stack details
- Local development setup
- API documentation link
- Deployment instructions
- Environment variables documentation
- Testing instructions
- Screenshots/GIFs of API in action
- Contributing guidelines
- License

### Step 2: Create API Documentation

Add `API.md` with detailed endpoint documentation, request/response examples, and error codes.

### Step 3: Add Architecture Diagram

Create `ARCHITECTURE.md` explaining:
- System architecture
- Database schema diagram
- Authentication flow
- Transaction processing flow
- Deployment architecture

---

## Congratulations! 🎉

You have successfully built and deployed a production-ready banking API with:

✅ **Complete NestJS Application**
- Modular architecture
- TypeScript throughout
- DTOs with validation

✅ **Database with Prisma**
- PostgreSQL integration
- Migrations
- Relationships

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control
- Protected routes

✅ **Banking Features**
- Account management
- Deposits and withdrawals
- Transfers between accounts
- Transaction history

✅ **Testing**
- Unit tests
- Integration tests
- 70%+ code coverage

✅ **API Documentation**
- Swagger/OpenAPI
- Interactive testing

✅ **Deployment**
- Docker containerization
- Railway/Render deployment
- CI/CD pipeline
- Production monitoring

## Next Steps

1. **Add More Features**:
   - Account statements (PDF/CSV)
   - Transaction receipts
   - Email notifications
   - Two-factor authentication

2. **Improve Security**:
   - Rate limiting
   - API key authentication for external services
   - Audit logging
   - Data encryption at rest

3. **Scale the Application**:
   - Redis caching
   - Message queues for async processing
   - Microservices architecture
   - Load balancing

4. **Monitor and Optimize**:
   - Application performance monitoring (APM)
   - Error tracking (Sentry)
   - Database query optimization
   - Load testing

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Railway Documentation](https://docs.railway.app)
- [Docker Documentation](https://docs.docker.com)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

**Good luck with your project! 🚀**
