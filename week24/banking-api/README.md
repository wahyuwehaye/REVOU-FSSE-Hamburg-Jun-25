# 🏦 Banking API - Week 24 Demo Project

Complete Banking REST API built with **NestJS**, **Prisma ORM**, **MySQL**, demonstrating all Week 24 concepts:
- ✅ Database Relations (1:1, 1:N, M:N)
- ✅ JWT Authentication with Refresh Tokens
- ✅ Role-Based Access Control (RBAC)
- ✅ Security Best Practices
- ✅ Real-world Banking Features

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Test Credentials](#test-credentials)
- [Project Structure](#project-structure)

## ✨ Features

### Authentication & Authorization
- 🔐 JWT-based authentication
- 🔄 Refresh token rotation
- 👥 4 Role levels: CUSTOMER, TELLER, MANAGER, ADMIN
- 🛡️ Route-level permissions
- 📝 Audit logging

### Banking Operations
- 💰 Multiple account types (Savings, Checking, Deposit)
- 💸 Transactions (Deposit, Withdrawal, Transfer, Payment)
- 💳 Debit/Credit card management
- 📋 Beneficiary management (saved recipients)
- 💵 Loan management with payment schedules
- 🔔 Real-time notifications
- 📊 Transaction history

### Security Features
- 🔒 Password hashing (bcrypt)
- 🚦 Rate limiting
- 🛡️ Helmet security headers
- ✅ Input validation
- 🔐 PIN/CVV encryption
- 📝 Audit trail
- 💰 Daily transaction limits

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Database**: MySQL 8.0
- **ORM**: Prisma 5.x
- **Authentication**: JWT (Passport)
- **Validation**: class-validator
- **Security**: Helmet, bcrypt, Throttler

## 📦 Prerequisites

- Node.js >= 18.x
- MySQL >= 8.0
- npm or yarn

## 🚀 Installation

### 1. Clone & Install Dependencies

\`\`\`bash
cd week24/banking-api
npm install
\`\`\`

### 2. Environment Configuration

Create `.env` file:

\`\`\`bash
cp .env.example .env
\`\`\`

Update MySQL connection:

\`\`\`env
DATABASE_URL="mysql://root@localhost:3306/banking_api"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
\`\`\`

## 🗄️ Database Setup

### 1. Create Database

\`\`\`bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS banking_api;"
\`\`\`

### 2. Generate Prisma Client

\`\`\`bash
npx prisma generate
\`\`\`

### 3. Push Schema to Database

\`\`\`bash
npx prisma db push
\`\`\`

### 4. Seed Database

\`\`\`bash
npx prisma db seed
\`\`\`

**Seed Output:**
- 6 Users (1 admin, 1 manager, 1 teller, 3 customers)
- 3 Customer profiles
- 6 Bank accounts
- 3 Debit/Credit cards
- 6 Transactions
- 3 Saved beneficiaries
- 2 Loans with payment schedules
- 4 Notifications

### 5. View Database (Optional)

\`\`\`bash
npx prisma studio
\`\`\`

Opens at `http://localhost:5555`

## 🏃 Running the Application

### Development Mode

\`\`\`bash
npm run start:dev
\`\`\`

Server runs at: `http://localhost:3000/api/v1`

### Production Build

\`\`\`bash
npm run build
npm run start:prod
\`\`\`

## 📚 API Documentation

### Base URL
\`\`\`
http://localhost:3000/api/v1
\`\`\`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new customer | ❌ |
| POST | `/auth/login` | Login | ❌ |
| POST | `/auth/refresh` | Refresh tokens | ❌ |
| POST | `/auth/logout` | Logout | ✅ |
| GET | `/auth/profile` | Get current user | ✅ |

### Account Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/accounts` | Get my accounts | CUSTOMER |
| GET | `/accounts/:id` | Get account details | CUSTOMER, TELLER |
| POST | `/accounts` | Create new account | TELLER, MANAGER |
| PATCH | `/accounts/:id` | Update account | MANAGER |
| DELETE | `/accounts/:id/close` | Close account | MANAGER |
| GET | `/accounts/:id/balance` | Check balance | CUSTOMER |

### Transaction Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/transactions` | Get my transactions | CUSTOMER |
| GET | `/transactions/:id` | Get transaction details | CUSTOMER, TELLER |
| POST | `/transactions/deposit` | Deposit cash | TELLER |
| POST | `/transactions/withdraw` | Withdraw cash | CUSTOMER |
| POST | `/transactions/transfer` | Transfer money | CUSTOMER |
| POST | `/transactions/payment` | Make payment | CUSTOMER |

### Card Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/cards` | Get my cards | CUSTOMER |
| POST | `/cards` | Request new card | CUSTOMER |
| PATCH | `/cards/:id/activate` | Activate card | CUSTOMER |
| PATCH | `/cards/:id/block` | Block card | CUSTOMER |
| PATCH | `/cards/:id/pin` | Change PIN | CUSTOMER |

### Beneficiary Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/beneficiaries` | Get saved beneficiaries | CUSTOMER |
| POST | `/beneficiaries` | Add beneficiary | CUSTOMER |
| DELETE | `/beneficiaries/:id` | Remove beneficiary | CUSTOMER |

### Loan Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/loans` | Get my loans | CUSTOMER |
| POST | `/loans/apply` | Apply for loan | CUSTOMER |
| PATCH | `/loans/:id/approve` | Approve loan | MANAGER |
| POST | `/loans/:id/payment` | Make loan payment | CUSTOMER |
| GET | `/loans/:id/schedule` | Get payment schedule | CUSTOMER |

### Notification Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/notifications` | Get notifications | CUSTOMER |
| PATCH | `/notifications/:id/read` | Mark as read | CUSTOMER |
| DELETE | `/notifications/:id` | Delete notification | CUSTOMER |

### Admin Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/admin/users` | Get all users | ADMIN |
| GET | `/admin/transactions` | All transactions | ADMIN, MANAGER |
| GET | `/admin/audit-logs` | View audit logs | ADMIN |
| GET | `/admin/reports` | Generate reports | MANAGER, ADMIN |

## 🔐 Test Credentials

### Admin
\`\`\`
Email: admin@bank.com
Password: password123
Role: ADMIN
\`\`\`

### Manager
\`\`\`
Email: manager@bank.com
Password: password123
Role: MANAGER
\`\`\`

### Teller
\`\`\`
Email: teller@bank.com
Password: password123
Role: TELLER
\`\`\`

### Customers
\`\`\`
# Customer 1 (John Doe)
Email: john@email.com
Password: password123
Accounts: 1001234567 (Savings), 2001234567 (Checking)
Balance: Rp 5,000,000 + Rp 10,000,000

# Customer 2 (Jane Smith)
Email: jane@email.com
Password: password123
Accounts: 1001234568 (Savings), 3001234568 (Deposit)
Balance: Rp 8,000,000 + Rp 50,000,000

# Customer 3 (Bob Wilson)
Email: bob@email.com
Password: password123
Accounts: 1001234569 (Savings), 2001234569 (Checking)
Balance: Rp 15,000,000 + Rp 20,000,000
\`\`\`

## 📁 Project Structure

\`\`\`
banking-api/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── guards/            # JWT & Roles guards
│   │   ├── strategies/        # Passport strategies
│   │   ├── decorators/        # Custom decorators
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                 # User management
│   ├── customers/             # Customer profiles
│   ├── accounts/              # Bank accounts
│   ├── transactions/          # Transactions
│   ├── cards/                 # Card management
│   ├── beneficiaries/         # Beneficiaries
│   ├── loans/                 # Loan management
│   ├── notifications/         # Notifications
│   ├── prisma/                # Prisma service
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application entry
├── .env                       # Environment variables
├── .env.example               # Environment template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # This file
\`\`\`

## 🎯 Learning Objectives (Week 24)

### 1. Database Relations ✅
- **1:1**: User ↔ Customer
- **1:N**: User → Accounts, Account → Transactions, Loan → Payments
- **M:N**: User → Beneficiaries → Accounts (explicit join table pattern)

### 2. Authentication ✅
- JWT-based stateless authentication
- Access token (15 minutes)
- Refresh token (7 days)
- Token rotation
- Password hashing with bcrypt

### 3. Authorization (RBAC) ✅
- 4 role levels with different permissions
- Guard-based authorization
- Resource ownership validation
- Route-level protection

### 4. Security ✅
- Helmet security headers
- Rate limiting (100 req/min global, custom per route)
- CORS configuration
- Input validation with DTOs
- SQL injection prevention (Prisma)
- Password/PIN hashing
- Audit logging

### 5. Best Practices ✅
- Clean architecture (Controller → Service → Prisma)
- Type safety with TypeScript
- Error handling
- DTO validation
- Transaction management
- Cascade deletes
- Indexes for performance

## 📝 Postman Collection

Import the included Postman collection:
\`\`\`
Banking-API.postman_collection.json
Banking-API.postman_environment.json
\`\`\`

**Features:**
- Pre-configured requests for all endpoints
- Auto-save tokens to environment
- Test scripts for validation
- Organized by module
- Example request bodies

## 🧪 Testing Scenarios

### Scenario 1: Customer Registration & Login
1. Register new customer
2. Login to get tokens
3. View profile and accounts

### Scenario 2: Money Transfer
1. Login as John
2. Add Jane as beneficiary
3. Transfer Rp 100,000 to Jane
4. Check both account balances
5. View transaction history

### Scenario 3: Loan Application
1. Login as customer
2. Apply for personal loan
3. Login as manager
4. Approve loan
5. View payment schedule

### Scenario 4: Card Management
1. Request new debit card
2. Activate card
3. Change PIN
4. Block card (if lost)

### Scenario 5: RBAC Testing
1. Try customer accessing admin routes (403)
2. Try teller processing deposits (200)
3. Try manager approving loans (200)

## 🔧 Troubleshooting

### Database Connection Error
\`\`\`bash
# Check MySQL is running
mysql -u root -e "SELECT 1;"

# Verify database exists
mysql -u root -e "SHOW DATABASES LIKE 'banking_api';"
\`\`\`

### Port Already in Use
\`\`\`bash
# Change port in .env
PORT=3001
\`\`\`

### Prisma Client Not Generated
\`\`\`bash
npx prisma generate
\`\`\`

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Best Practices](https://jwt.io/introduction)
- [Banking API Standards](https://www.openbanking.org.uk/)

## 🎓 Week 24 Concepts Demonstrated

✅ **Prisma ORM**: All relationship types, migrations, seeding
✅ **Database Relations**: 1:1, 1:N, M:N with real-world examples  
✅ **JWT Authentication**: Access & refresh tokens, token rotation  
✅ **RBAC Authorization**: 4 roles, guards, ownership validation  
✅ **Security**: Hashing, rate limiting, validation, audit logs  
✅ **RESTful API**: Standard HTTP methods, status codes, error handling  
✅ **TypeScript**: Type safety, interfaces, decorators  
✅ **Clean Architecture**: Separation of concerns, modularity  

---

**Built for RevoU Full Stack Software Engineering - Week 24** 🚀
