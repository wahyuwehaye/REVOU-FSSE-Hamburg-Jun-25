# Setting Up Development Environment

## Prerequisites

Sebelum mulai dengan NestJS, Anda perlu install beberapa tools:

### 1. **Node.js dan npm**

NestJS membutuhkan Node.js versi 16 atau lebih tinggi.

#### Check Existing Installation

```bash
# Check Node.js version
node --version
# Expected: v16.x.x atau lebih tinggi

# Check npm version
npm --version
# Expected: 8.x.x atau lebih tinggi
```

#### Install Node.js (jika belum ada)

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download dari https://nodejs.org/
```

**Windows:**
```bash
# Download installer dari https://nodejs.org/
# Pilih LTS version
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Verify Installation

```bash
node --version
# Should show: v18.x.x atau v20.x.x

npm --version
# Should show: 9.x.x atau 10.x.x
```

### 2. **Package Manager: npm vs yarn vs pnpm**

#### npm (Default, sudah include dengan Node.js)
```bash
npm --version
```

#### yarn (Optional, faster alternative)
```bash
# Install yarn globally
npm install -g yarn

# Verify
yarn --version
```

#### pnpm (Optional, most efficient)
```bash
# Install pnpm globally
npm install -g pnpm

# Verify
pnpm --version
```

**Recommendation:** Gunakan npm untuk simplicity, atau yarn/pnpm untuk better performance.

### 3. **Code Editor: Visual Studio Code**

#### Install VS Code

Download dari: https://code.visualstudio.com/

#### Essential VS Code Extensions

```
1. ESLint - JavaScript linting
2. Prettier - Code formatter
3. TypeScript and JavaScript Language Features (built-in)
4. Path Intellisense - Auto-complete paths
5. REST Client - Test API directly in VS Code
6. Thunder Client - API testing tool
7. GitLens - Git integration
8. Auto Import - Auto import modules
9. Material Icon Theme - Better file icons
10. NestJS Snippets - NestJS code snippets
```

#### Install Extensions via Command Line

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension christian-kohler.path-intellisense
code --install-extension humao.rest-client
code --install-extension rangav.vscode-thunder-client
code --install-extension eamodio.gitlens
code --install-extension steoates.autoimport
code --install-extension pkief.material-icon-theme
code --install-extension ashinzekene.nestjs
```

### 4. **Git Version Control**

#### Check Installation

```bash
git --version
```

#### Install Git (jika belum ada)

**macOS:**
```bash
brew install git
```

**Windows:**
```bash
# Download dari https://git-scm.com/download/win
```

**Linux:**
```bash
sudo apt-get install git
```

#### Configure Git

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Verify
git config --list
```

### 5. **API Testing Tools**

#### Option 1: Postman (Recommended for Beginners)

1. Download dari: https://www.postman.com/downloads/
2. Install dan create free account
3. Create new workspace for your projects

#### Option 2: Insomnia

1. Download dari: https://insomnia.rest/download
2. Alternative yang lebih lightweight

#### Option 3: Thunder Client (VS Code Extension)

```bash
# Already installed if you followed VS Code extensions above
# Access via VS Code sidebar
```

#### Option 4: REST Client (VS Code Extension)

Create `.http` files untuk test API:

```http
### Get all users
GET http://localhost:3000/api/users

### Create user
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Installing NestJS CLI

NestJS CLI adalah command-line tool untuk creating dan managing NestJS projects.

### Install NestJS CLI Globally

```bash
# Using npm
npm install -g @nestjs/cli

# Using yarn
yarn global add @nestjs/cli

# Using pnpm
pnpm add -g @nestjs/cli
```

### Verify Installation

```bash
nest --version
# Expected: 10.x.x atau lebih tinggi

# Check available commands
nest --help
```

### NestJS CLI Commands Reference

```bash
# Create new project
nest new <project-name>

# Generate resources
nest generate module <name>      # Generate module
nest generate controller <name>  # Generate controller
nest generate service <name>     # Generate service
nest generate resource <name>    # Generate complete CRUD

# Shortcuts
nest g mo <name>   # Generate module
nest g co <name>   # Generate controller
nest g s <name>    # Generate service
nest g res <name>  # Generate resource

# Other useful commands
nest info          # Display Nest CLI and project info
nest build         # Build application
nest start         # Start application
nest start --watch # Start with hot-reload
```

## Creating Your First NestJS Project

### Step 1: Create New Project

```bash
# Navigate to your projects directory
cd ~/projects

# Create new NestJS project
nest new my-first-api

# During installation, choose package manager:
# ? Which package manager would you ❤️  to use?
# > npm
#   yarn
#   pnpm
```

**What happens:**
- Creates project directory
- Installs all dependencies
- Sets up initial project structure
- Configures TypeScript
- Adds testing setup

### Step 2: Understand Project Structure

```bash
cd my-first-api
ls -la
```

**Project Structure:**
```
my-first-api/
├── node_modules/          # Dependencies
├── src/                   # Source code
│   ├── app.controller.ts      # Main controller
│   ├── app.controller.spec.ts # Controller tests
│   ├── app.module.ts          # Root module
│   ├── app.service.ts         # Main service
│   └── main.ts                # Entry point
├── test/                  # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── nest-cli.json         # Nest CLI configuration
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
├── tsconfig.build.json   # Build TypeScript config
└── README.md             # Project documentation
```

### Step 3: Examine Key Files

#### `src/main.ts` - Entry Point

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

#### `src/app.module.ts` - Root Module

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

#### `src/app.controller.ts` - Controller

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

#### `src/app.service.ts` - Service

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

### Step 4: Start Development Server

```bash
# Start server
npm run start

# Start with hot-reload (recommended for development)
npm run start:dev

# Start in debug mode
npm run start:debug
```

**Output:**
```
[Nest] 12345  - 01/15/2024, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/15/2024, 10:00:00 AM     LOG [InstanceLoader] AppModule dependencies initialized +10ms
[Nest] 12345  - 01/15/2024, 10:00:00 AM     LOG [RoutesResolver] AppController {/}: +5ms
[Nest] 12345  - 01/15/2024, 10:00:00 AM     LOG [RouterExplorer] Mapped {/, GET} route +2ms
[Nest] 12345  - 01/15/2024, 10:00:00 AM     LOG [NestApplication] Nest application successfully started +3ms
```

### Step 5: Test Your API

#### Method 1: Browser

```bash
# Open in browser
open http://localhost:3000
# or
curl http://localhost:3000
```

**Expected Response:**
```
Hello World!
```

#### Method 2: Using curl

```bash
curl http://localhost:3000
```

#### Method 3: Using Postman

1. Open Postman
2. Create new request
3. Set method to `GET`
4. Enter URL: `http://localhost:3000`
5. Click "Send"

#### Method 4: Using REST Client (VS Code)

Create `test.http` file:
```http
### Test Hello World
GET http://localhost:3000
```

Click "Send Request" above the GET line.

## VS Code Configuration for NestJS

### Recommended `settings.json`

Create or update `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/dist": true
  }
}
```

### Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach NestJS",
      "port": 9229,
      "restart": true,
      "stopOnEntry": false,
      "protocol": "inspector"
    }
  ]
}
```

Run debug mode:
```bash
npm run start:debug
```

Then press F5 in VS Code to attach debugger.

## Package.json Scripts

Understanding available scripts:

```json
{
  "scripts": {
    "build": "nest build",                    // Compile TypeScript
    "format": "prettier --write \"src/**/*.ts\"",  // Format code
    "start": "nest start",                    // Start production
    "start:dev": "nest start --watch",       // Start with hot-reload
    "start:debug": "nest start --debug --watch",  // Start debug mode
    "start:prod": "node dist/main",          // Start compiled app
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",  // Lint code
    "test": "jest",                          // Run unit tests
    "test:watch": "jest --watch",            // Run tests in watch mode
    "test:cov": "jest --coverage",           // Run tests with coverage
    "test:e2e": "jest --config ./test/jest-e2e.json"  // Run E2E tests
  }
}
```

## Environment Setup Checklist

- ✅ Node.js installed (v16+)
- ✅ npm/yarn/pnpm installed
- ✅ VS Code installed with extensions
- ✅ Git installed and configured
- ✅ API testing tool (Postman/Thunder Client) ready
- ✅ NestJS CLI installed globally
- ✅ First NestJS project created
- ✅ Development server running
- ✅ Successfully tested Hello World endpoint

## Troubleshooting Common Issues

### Issue 1: Command Not Found

```bash
# nest: command not found
```

**Solution:**
```bash
# Reinstall globally
npm install -g @nestjs/cli

# Or use npx
npx @nestjs/cli new my-project
```

### Issue 2: Port Already in Use

```bash
# Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in main.ts
await app.listen(3001);
```

### Issue 3: TypeScript Errors

```bash
# Cannot find module or type definitions
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Hot Reload Not Working

**Solution:**
```bash
# Make sure you're using start:dev
npm run start:dev

# Not just start
npm run start
```

## Next Steps

Setelah environment setup selesai:
1. ✅ Understand NestJS architecture
2. ✅ Learn about Modules, Controllers, Services
3. ✅ Create your first endpoints
4. ✅ Test with Postman

## Useful Resources

- **NestJS Documentation:** https://docs.nestjs.com
- **NestJS GitHub:** https://github.com/nestjs/nest
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **Node.js Documentation:** https://nodejs.org/docs/

---

**Congratulations!** 🎉  
Your development environment is now ready untuk belajar NestJS!
