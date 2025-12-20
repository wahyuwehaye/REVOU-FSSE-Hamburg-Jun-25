# Docker Introduction and Core Concepts

## Apa itu Docker?

### Analogi: Shipping Container untuk Aplikasi

**Masalah Tradisional:**
Bayangkan Anda ingin mengirim berbagai barang dari Indonesia ke Amerika:
- 🏺 Keramik rapuh
- 📦 Furniture besar
- 🍎 Buah yang perlu pendingin
- 📚 Buku yang takut air

**Tanpa Container:** Setiap barang perlu penanganan berbeda, mudah rusak, sulit track.

**Dengan Shipping Container:** Semua masuk container standar, mudah dimuat di kapal, truck, kereta. Tidak peduli isinya apa, cara handling-nya sama!

**Docker = Shipping Container untuk Software:**
- 📦 Package aplikasi + semua dependencies
- 🚢 Berjalan sama di laptop, server, cloud
- 🔄 Mudah dipindah-pindah
- 🛡️ Isolated, tidak ganggu aplikasi lain

## Mengapa Docker Penting?

### Problem: "Works on My Machine"

```
Developer A (Mac):        Developer B (Windows):      Production Server (Linux):
Node.js 18.x             Node.js 16.x                Node.js 20.x
PostgreSQL 14            PostgreSQL 15               PostgreSQL 16
npm 9                    npm 8                       npm 10
macOS libs               Windows libs                Linux libs

✅ Works                  ❌ Different behavior        ❌ Crashes!
```

### Solution: Docker Container

```
Developer A:              Developer B:                Production Server:
┌──────────────┐         ┌──────────────┐            ┌──────────────┐
│   Docker     │         │   Docker     │            │   Docker     │
│ Container    │         │ Container    │            │ Container    │
│              │         │              │            │              │
│ Node 18      │         │ Node 18      │            │ Node 18      │
│ PostgreSQL14 │    =    │ PostgreSQL14 │      =     │ PostgreSQL14 │
│ npm 9        │         │ npm 9        │            │ npm 9        │
│ Linux env    │         │ Linux env    │            │ Linux env    │
└──────────────┘         └──────────────┘            └──────────────┘

✅ Works                  ✅ Works                     ✅ Works
```

## Docker vs Virtual Machine

### Virtual Machine

```
┌─────────────────────────────────────┐
│         Physical Server             │
│  ┌───────────────────────────────┐ │
│  │       Host OS (Linux)         │ │
│  │  ┌─────────────────────────┐  │ │
│  │  │     Hypervisor          │  │ │
│  │  │  ┌────────┐  ┌────────┐ │  │ │
│  │  │  │  VM 1  │  │  VM 2  │ │  │ │
│  │  │  │ OS     │  │ OS     │ │  │ │  ← Each VM has full OS
│  │  │  │ (2GB)  │  │ (2GB)  │ │  │ │
│  │  │  │ App A  │  │ App B  │ │  │ │
│  │  │  └────────┘  └────────┘ │  │ │
│  │  └─────────────────────────┘  │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
Heavy: ~4GB for 2 VMs
Slow: Minutes to start
```

### Docker Container

```
┌─────────────────────────────────────┐
│         Physical Server             │
│  ┌───────────────────────────────┐ │
│  │       Host OS (Linux)         │ │
│  │  ┌─────────────────────────┐  │ │
│  │  │    Docker Engine        │  │ │
│  │  │  ┌────────┐  ┌────────┐ │  │ │
│  │  │  │ Cont 1 │  │ Cont 2 │ │  │ │  ← Share Host OS
│  │  │  │ (50MB) │  │ (50MB) │ │  │ │
│  │  │  │ App A  │  │ App B  │ │  │ │
│  │  │  └────────┘  └────────┘ │  │ │
│  │  └─────────────────────────┘  │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
Light: ~100MB for 2 containers
Fast: Seconds to start
```

### Comparison Table

| Feature | Virtual Machine | Docker Container |
|---------|----------------|------------------|
| **Startup Time** | Minutes | Seconds |
| **Size** | GB (2-10GB) | MB (50-500MB) |
| **OS** | Full OS each | Share host OS |
| **Resource Usage** | Heavy | Lightweight |
| **Isolation** | Complete | Process-level |
| **Portability** | Difficult | Easy |
| **Use Case** | Different OS needed | Same OS, different apps |

## Docker Architecture

### Key Components

```
┌─────────────────────────────────────────────┐
│            Docker Architecture              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐      ┌────────────────┐  │
│  │ Docker CLI   │─────▶│ Docker Daemon  │  │
│  │ (Commands)   │      │ (Engine)       │  │
│  └──────────────┘      └────────┬───────┘  │
│                                 │           │
│                    ┌────────────┼────────┐  │
│                    ▼            ▼        ▼  │
│              ┌─────────┐  ┌─────────┐  ...  │
│              │Container│  │Container│       │
│              │    1    │  │    2    │       │
│              └─────────┘  └─────────┘       │
│                    │            │           │
│                    ▼            ▼           │
│              ┌─────────────────────┐        │
│              │   Docker Images     │        │
│              │   (Templates)       │        │
│              └─────────────────────┘        │
│                         │                   │
│                         ▼                   │
│              ┌─────────────────────┐        │
│              │   Docker Registry   │        │
│              │   (Docker Hub)      │        │
│              └─────────────────────┘        │
└─────────────────────────────────────────────┘
```

### 1. Docker Client (CLI)

**Apa itu?** Command-line tool untuk berinteraksi dengan Docker.

```bash
# Common commands
docker build    # Build image from Dockerfile
docker run      # Run container from image
docker ps       # List running containers
docker images   # List images
docker pull     # Download image from registry
docker push     # Upload image to registry
docker stop     # Stop running container
docker rm       # Remove container
docker rmi      # Remove image
```

### 2. Docker Daemon (Engine)

**Apa itu?** Background service yang menjalankan dan manage containers.

**Tugas:**
- Menjalankan containers
- Manage images
- Handle networking
- Manage storage volumes

### 3. Docker Images

**Apa itu?** Blueprint/template untuk membuat containers. Seperti "class" di OOP.

```bash
# List images
docker images

OUTPUT:
REPOSITORY          TAG       SIZE      CREATED
node                18-alpine 174MB     2 days ago
todo-api            latest    250MB     1 hour ago
postgres            14        376MB     1 week ago
```

**Image layers:**
```
┌──────────────────────────┐
│  Your App Code (10MB)    │  ← Layer 4
├──────────────────────────┤
│  npm packages (150MB)    │  ← Layer 3
├──────────────────────────┤
│  Node.js (50MB)          │  ← Layer 2
├──────────────────────────┤
│  Alpine Linux (5MB)      │  ← Layer 1 (Base)
└──────────────────────────┘
Total: 215MB

Layers are cached! Rebuild is fast.
```

### 4. Docker Containers

**Apa itu?** Running instance dari image. Seperti "object" dari class.

```bash
# One image, multiple containers
docker run -d --name api-1 todo-api
docker run -d --name api-2 todo-api
docker run -d --name api-3 todo-api

# Three separate containers dari satu image
```

```
     ┌─────────────┐
     │ todo-api    │
     │ (Image)     │
     └──────┬──────┘
            │
      ┌─────┼─────┐
      ▼     ▼     ▼
   ┌─────┐ ┌─────┐ ┌─────┐
   │api-1│ │api-2│ │api-3│
   │:3001│ │:3002│ │:3003│
   └─────┘ └─────┘ └─────┘
   3 separate running containers
```

### 5. Docker Registry

**Apa itu?** Storage untuk Docker images. Seperti npm registry untuk packages.

**Docker Hub** = Public registry (gratis):
```bash
# Pull image from Docker Hub
docker pull node:18-alpine

# Push your image
docker tag todo-api yourusername/todo-api
docker push yourusername/todo-api
```

**Private Registry** = Your own registry:
- GitHub Container Registry
- AWS ECR
- Google Container Registry
- Azure Container Registry

## Docker Workflow

### Complete Development Flow

```
1. Write Code
   ↓
2. Create Dockerfile
   ↓
3. Build Image
   ↓
4. Test Container Locally
   ↓
5. Push to Registry
   ↓
6. Deploy to Production
```

### Detailed Example

```bash
# 1. Your NestJS application
project/
├── src/
├── package.json
└── Dockerfile    ← Create this

# 2. Build image from Dockerfile
docker build -t todo-api:v1 .

# 3. Run container locally
docker run -p 3000:3000 todo-api:v1

# 4. Test it
curl http://localhost:3000/health
# ✅ Works!

# 5. Tag for registry
docker tag todo-api:v1 username/todo-api:v1

# 6. Push to Docker Hub
docker push username/todo-api:v1

# 7. On production server
docker pull username/todo-api:v1
docker run -d -p 3000:3000 username/todo-api:v1
```

## Installing Docker

### macOS

```bash
# 1. Download Docker Desktop
# Visit: https://www.docker.com/products/docker-desktop

# 2. Install .dmg file
# Drag Docker to Applications

# 3. Start Docker Desktop

# 4. Verify installation
docker --version
# Output: Docker version 24.0.6

docker run hello-world
# Should download and run test container
```

### Windows

```bash
# 1. Enable WSL 2
wsl --install

# 2. Download Docker Desktop
# Visit: https://www.docker.com/products/docker-desktop

# 3. Install and restart

# 4. Verify
docker --version
docker run hello-world
```

### Linux (Ubuntu)

```bash
# 1. Update packages
sudo apt-get update

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Add user to docker group
sudo usermod -aG docker $USER

# 4. Restart session, then verify
docker --version
docker run hello-world
```

## Docker Desktop Features

### GUI Management

```
Docker Desktop Dashboard:
┌─────────────────────────────────────┐
│ Containers                          │
│  ● todo-api-1    Running  :3000     │
│  ● postgres-1    Running  :5432     │
│  ○ redis-1       Stopped            │
│                                     │
│ Images                              │
│  node:18-alpine       174MB         │
│  todo-api:latest      250MB         │
│  postgres:14          376MB         │
│                                     │
│ Volumes                             │
│  postgres-data        1.2GB         │
│  redis-data           50MB          │
└─────────────────────────────────────┘
```

### Resource Settings

```
Settings → Resources:
┌─────────────────────────────────┐
│ CPUs: [=====>    ] 4 of 8      │
│ Memory: [======>  ] 6GB of 16GB│
│ Swap: [===>      ] 2GB         │
│ Disk: [========> ] 100GB       │
└─────────────────────────────────┘
```

## Basic Docker Commands

### Container Management

```bash
# Run container
docker run -d --name my-app -p 3000:3000 node:18-alpine

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop container
docker stop my-app

# Start stopped container
docker start my-app

# Restart container
docker restart my-app

# Remove container
docker rm my-app

# Remove running container (force)
docker rm -f my-app

# View logs
docker logs my-app

# Follow logs (like tail -f)
docker logs -f my-app

# Execute command in running container
docker exec -it my-app sh

# View container stats
docker stats my-app
```

### Image Management

```bash
# List images
docker images

# Pull image from registry
docker pull node:18-alpine

# Build image from Dockerfile
docker build -t my-app:v1 .

# Tag image
docker tag my-app:v1 username/my-app:v1

# Push image to registry
docker push username/my-app:v1

# Remove image
docker rmi my-app:v1

# Remove unused images
docker image prune

# View image history
docker history my-app:v1
```

### System Management

```bash
# View Docker info
docker info

# View disk usage
docker system df

# Clean up everything unused
docker system prune -a

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune
```

## Docker Best Practices

### 1. Use Official Images

```dockerfile
# ✅ Good - Official Node.js image
FROM node:18-alpine

# ❌ Bad - Random unofficial image
FROM someuser/node-custom
```

### 2. Use Specific Tags

```dockerfile
# ✅ Good - Specific version
FROM node:18.17-alpine3.18

# ❌ Bad - Latest tag (unpredictable)
FROM node:latest
```

### 3. Minimize Layers

```dockerfile
# ❌ Bad - Many layers
RUN npm install express
RUN npm install bcrypt
RUN npm install jsonwebtoken

# ✅ Good - Single layer
RUN npm install express bcrypt jsonwebtoken
```

### 4. Use .dockerignore

```bash
# .dockerignore
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.vscode
.idea
dist
coverage
*.test.ts
*.spec.ts
```

### 5. Don't Run as Root

```dockerfile
# ❌ Bad - Runs as root (default)
COPY . .
CMD ["node", "dist/main.js"]

# ✅ Good - Create and use non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs
CMD ["node", "dist/main.js"]
```

## Common Docker Use Cases

### 1. Development Environment

```bash
# Start development database
docker run -d \
  --name dev-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=todo_dev \
  -p 5432:5432 \
  postgres:14-alpine

# Now your app can connect to localhost:5432
```

### 2. Testing

```bash
# Run tests in isolated container
docker run --rm \
  -v $(pwd):/app \
  -w /app \
  node:18-alpine \
  npm test
```

### 3. Production Deployment

```bash
# Run production container
docker run -d \
  --name todo-api \
  --restart unless-stopped \
  -p 3000:3000 \
  -e DATABASE_URL=$DATABASE_URL \
  -e JWT_SECRET=$JWT_SECRET \
  todo-api:latest
```

## Summary

**Key Concepts:**

1. 📦 **Container** = Lightweight, isolated runtime environment
2. 🖼️ **Image** = Template for creating containers
3. 🏗️ **Dockerfile** = Instructions to build an image
4. 🌐 **Registry** = Storage for images (Docker Hub)
5. 🚀 **Docker Engine** = Software that runs containers

**Benefits:**

1. ✅ Consistency across environments
2. ✅ Fast startup and deployment
3. ✅ Efficient resource usage
4. ✅ Easy scaling
5. ✅ Isolated environments
6. ✅ Version control for infrastructure

**Docker vs VM:**

| Docker | VM |
|--------|-----|
| Lightweight (MB) | Heavy (GB) |
| Seconds to start | Minutes to start |
| Share host OS | Full OS each |
| Process-level isolation | Complete isolation |

**Quote to Remember:**
> "Docker allows you to package an application with all of its dependencies into a standardized unit for software development." - Docker Inc.

---

**Practice Exercise:**

1. Install Docker Desktop on your machine
2. Run your first container: `docker run hello-world`
3. Start a PostgreSQL container for development
4. Explore Docker Desktop dashboard
5. Try basic commands: `docker ps`, `docker images`, `docker logs`

**Next Steps:**

In the next material, we'll learn how to create a Dockerfile for our NestJS Todo API application!
