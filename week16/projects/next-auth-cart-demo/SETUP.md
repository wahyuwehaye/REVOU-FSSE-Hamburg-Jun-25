# Next Auth Cart Demo - Setup Fixed ✅

## Problem yang Diperbaiki

### 1. **Environment Variables Not Loading**
**Error:**
```
Error: Environment variable not found: DATABASE_URL.
```

**Root Cause:**
- Ketika ada `prisma.config.ts`, Prisma skips automatic `.env` loading
- Seed script juga tidak load `.env` file

**Solution:**
- Install `dotenv` dan `dotenv-cli`
- Load environment variables di `prisma.config.ts` dan `seed.ts`
- Wrap semua Prisma commands dengan `dotenv -e .env --`

### 2. **Prisma Client Import Path Error**
**Error:**
```
Error: @prisma/client did not initialize yet
```

**Root Cause:**
- Prisma Client di-generate ke custom path `src/generated/prisma`
- Seed script import dari default path `@prisma/client`

**Solution:**
- Update import di `seed.ts` ke `../src/generated/prisma`

### 3. **skipDuplicates Not Supported in SQLite**
**Error:**
```
Unknown argument `skipDuplicates`
```

**Root Cause:**
- SQLite tidak support `skipDuplicates` option di `createMany`

**Solution:**
- Gunakan `upsert` untuk setiap product instead of `createMany`
- Lebih reliable dan works dengan semua database

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

File `.env` sudah ada dengan config:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="yyp2ojsfTMijtbXlj2nJq2UAf8t64S58aWVDJjJ6FNQ="
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Database Migration

```bash
npm run prisma:migrate
```

### 5. Seed Database

```bash
npm run prisma:seed
```

### 6. Verify Data (Optional)

Open Prisma Studio to verify:

```bash
npm run prisma:studio
```

### 7. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | Next dev server | Run app in development mode |
| `npm run build` | Next build | Build for production |
| `npm run start` | Next start | Run production server |
| `npm run lint` | ESLint | Lint your code |
| `npm run prisma:generate` | Prisma generate | Generate Prisma Client |
| `npm run prisma:migrate` | Prisma migrate dev | Run migrations |
| `npm run prisma:seed` | Prisma db seed | Seed database |
| `npm run prisma:studio` | Prisma Studio | Open database GUI |
| `npm run db:reset` | Prisma migrate reset | Reset database |

## Seeded Data

### Users
- **Admin User**
  - Email: `admin@example.com`
  - Password: `admin123`
  - Role: ADMIN

- **Demo User**
  - Email: `user@example.com`
  - Password: `user123`
  - Role: USER

### Products
1. **Kaos Next.js** - Rp 1,499,000
2. **Mug RevoU** - Rp 799,000
3. **Sticker Pack** - Rp 299,000

## File Changes Made

### 1. `prisma.config.ts`
```typescript
import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Load environment variables from .env file
config();

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
```

### 2. `prisma/seed.ts`
```typescript
import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient();

// ... seed logic with upsert instead of createMany
```

### 3. `package.json`
Added new scripts:
```json
{
  "scripts": {
    "prisma:generate": "dotenv -e .env -- prisma generate",
    "prisma:migrate": "dotenv -e .env -- prisma migrate dev",
    "prisma:seed": "dotenv -e .env -- prisma db seed",
    "prisma:studio": "dotenv -e .env -- prisma studio",
    "db:reset": "dotenv -e .env -- prisma migrate reset"
  }
}
```

## Troubleshooting

### If you get "Environment variable not found"
```bash
# Make sure .env file exists
ls -la .env

# Run commands with dotenv wrapper
npx dotenv -e .env -- npx prisma generate
```

### If Prisma Client not initialized
```bash
# Regenerate Prisma Client
npm run prisma:generate
```

### To reset database completely
```bash
# This will drop all data and re-run migrations
npm run db:reset

# Then seed again
npm run prisma:seed
```

## Next Steps

1. ✅ **Test Login** - Try logging in with seeded users
2. ✅ **Test Cart** - Add products to cart
3. ✅ **Test Admin** - Access admin features with admin account
4. ✅ **Build Features** - Start developing new features

## Notes

- **Database:** SQLite (dev.db) - Good for development
- **Authentication:** NextAuth.js with Credentials provider
- **State Management:** SWR for data fetching
- **Styling:** Tailwind CSS v4

---

**Status:** ✅ All issues fixed and working!

**Last Updated:** October 21, 2025
