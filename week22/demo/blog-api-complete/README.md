# 📝 Blog API Complete - Week 22 Demo Project

Complete RESTful Blog API built with **NestJS**, **TypeORM**, and **PostgreSQL**

## ✨ Features

### 🔐 Authentication
- JWT-based authentication
- User registration and login
- Protected routes with guards

### 👥 User Management
- User CRUD operations
- User profiles with bio and avatar
- Role-based access (User, Admin, Moderator)
- User statistics (posts and comments count)

### 📄 Posts System
- Complete post CRUD operations
- Post status (Draft, Published, Archived)
- Auto-generated unique slugs
- View counter
- Featured images
- Post excerpts
- Filter by status, category, or tag
- Posts by author

### 🏷️ Categories & Tags
- Category management
- Many-to-Many relationship with Posts via Tags
- Auto-generated slugs
- Filter posts by category or tag

### 💬 Comments System
- Comment on posts
- Nested relationships (User → Comments → Posts)
- Cascade delete when post is removed

### 🔗 Relationships
- **One-to-Many**: User → Posts, User → Comments, Category → Posts
- **Many-to-Many**: Posts ↔ Tags (via junction table)
- **Many-to-One**: Comments → User, Comments → Post, Posts → Category

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Create PostgreSQL database
createdb blog_api_db

# Or using psql
psql -d postgres -c "CREATE DATABASE blog_api_db;"
```

### 3. Configure Environment
Copy `.env` file and update with your database credentials:
```bash
PORT=3000
NODE_ENV=development

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=blog_api_db

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### 4. Build and Run
```bash
# Build the project
./node_modules/.bin/nest build

# Run the application
node dist/main.js
```

Application will be available at: **http://localhost:3000/api**

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "bio": "Optional bio"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  },
  "access_token": "jwt-token"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | No |
| GET | `/users/:id` | Get user by ID | No |
| GET | `/users/:id/stats` | Get user statistics | No |
| PATCH | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes |

---

### Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/categories` | Create category | Yes |
| GET | `/categories` | Get all categories | No |
| GET | `/categories/:id` | Get category by ID | No |
| GET | `/categories/slug/:slug` | Get category by slug | No |
| PATCH | `/categories/:id` | Update category | Yes |
| DELETE | `/categories/:id` | Delete category | Yes |

**Create Category:**
```http
POST /categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Technology",
  "description": "Tech articles and tutorials"
}
```

---

### Tag Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/tags` | Create tag | Yes |
| GET | `/tags` | Get all tags | No |
| GET | `/tags/:id` | Get tag by ID | No |
| GET | `/tags/slug/:slug` | Get tag by slug | No |
| PATCH | `/tags/:id` | Update tag | Yes |
| DELETE | `/tags/:id` | Delete tag | Yes |

**Create Tag:**
```http
POST /tags
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "JavaScript"
}
```

---

### Post Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/posts` | Create post | Yes |
| GET | `/posts` | Get all posts | No |
| GET | `/posts?status=published` | Filter by status | No |
| GET | `/posts?categoryId=uuid` | Filter by category | No |
| GET | `/posts?tagId=uuid` | Filter by tag | No |
| GET | `/posts/author/:authorId` | Get posts by author | No |
| GET | `/posts/:id` | Get post by ID | No |
| GET | `/posts/slug/:slug` | Get post by slug | No |
| PATCH | `/posts/:id` | Update post | Yes |
| DELETE | `/posts/:id` | Delete post | Yes |

**Create Post:**
```http
POST /posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "Long content here...",
  "excerpt": "Short description",
  "categoryId": "category-uuid",
  "tagIds": ["tag-uuid-1", "tag-uuid-2"],
  "status": "published",
  "featuredImage": "https://example.com/image.jpg"
}
```

---

### Comment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/comments` | Create comment | Yes |
| GET | `/comments` | Get all comments | No |
| GET | `/comments/post/:postId` | Get comments by post | No |
| GET | `/comments/:id` | Get comment by ID | No |
| PATCH | `/comments/:id` | Update comment | Yes |
| DELETE | `/comments/:id` | Delete comment | Yes |

**Create Comment:**
```http
POST /comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Great article!",
  "postId": "post-uuid"
}
```

---

## 🧪 Testing with Postman

### Import Collection
1. Open Postman
2. Click **Import**
3. Select `postman/Blog-API-Complete.postman_collection.json`
4. Collection will be imported with all endpoints

### Collection Features
- ✅ Auto-save tokens after login
- ✅ Environment variables for IDs
- ✅ All endpoints pre-configured
- ✅ Example requests included

### Testing Flow
1. **Register User** → Saves token automatically
2. **Create Category** → Saves category ID
3. **Create Tags** → Saves tag IDs
4. **Create Post** → Saves post ID
5. **Create Comment** → Test relationships
6. **Test all GET endpoints** → View data

---

## 📊 Database Schema

```
Users (id, email, username, password, bio, avatar, role, isActive)
  ↓ One-to-Many
Posts (id, title, slug, content, excerpt, featuredImage, status, viewCount, authorId, categoryId)
  ↓ Many-to-Many (via post_tags junction table)
Tags (id, name, slug)

Posts
  ↓ Many-to-One
Categories (id, name, slug, description)

Posts
  ↓ One-to-Many
Comments (id, content, userId, postId)
```

---

## 🛠️ Project Structure

```
blog-api-complete/
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                 # Users module
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── categories/            # Categories module
│   ├── tags/                  # Tags module
│   ├── posts/                 # Posts module (complex relationships)
│   ├── comments/              # Comments module
│   ├── app.module.ts
│   └── main.ts
├── postman/
│   └── Blog-API-Complete.postman_collection.json
├── .env
├── package.json
└── README.md
```

---

## 🔑 Key Implementation Details

### Auto-Generated Slugs
Posts, categories, and tags automatically generate URL-friendly slugs:
```typescript
// Example: "My Blog Post" → "my-blog-post"
const slug = slugify(title, { lower: true, strict: true });
```

### Password Hashing
User passwords are automatically hashed using bcrypt:
```typescript
const hashedPassword = await bcrypt.hash(password, 10);
```

### JWT Authentication
Protected routes require Bearer token:
```typescript
@UseGuards(JwtAuthGuard)
@Post()
createPost() { ... }
```

### Cascade Delete
Comments are automatically deleted when post is removed:
```typescript
@ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
post: Post;
```

### View Counter
Post views increment automatically when accessed by slug:
```typescript
post.viewCount += 1;
await this.postsRepository.save(post);
```

---

## 🎯 Learning Objectives Covered

### Week 22 Materials:
- ✅ TypeORM entities with decorators
- ✅ One-to-Many relationships
- ✅ Many-to-Many relationships with junction tables
- ✅ Many-to-One relationships
- ✅ Cascade operations
- ✅ Query builder and filtering
- ✅ Eager vs Lazy loading
- ✅ DTO validation
- ✅ JWT authentication with Passport
- ✅ Guards and protected routes
- ✅ Auto-generated slugs
- ✅ Database transactions (implicit via TypeORM)

---

## 📖 Additional Resources

### Official Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Related Topics
- Database migrations
- Seeding data
- Testing (Unit & E2E)
- Deployment to production
- API documentation with Swagger
- Rate limiting
- Caching strategies

---

## 🤝 Contributing

This is a demo project for educational purposes. Feel free to:
- Add more features
- Improve error handling
- Add unit tests
- Implement pagination
- Add search functionality
- Create migrations

---

## 📝 Notes

### Important Reminders:
- ⚠️ **Never use `synchronize: true` in production!**
- ⚠️ Always validate user input with DTOs
- ⚠️ Use environment variables for sensitive data
- ⚠️ Hash passwords before storing
- ⚠️ Use transactions for critical operations
- ⚠️ Always exclude sensitive fields (like password) from responses

### Performance Tips:
- Use eager loading carefully (can cause N+1 queries)
- Implement pagination for large datasets
- Add database indexes for frequently queried fields
- Use query builder for complex queries
- Cache frequently accessed data

---

## 🎓 For Students

### How to Study This Project:
1. **Start with Entities** - Understand the relationships
2. **Study DTOs** - Learn input validation
3. **Analyze Services** - Business logic implementation
4. **Review Controllers** - Request/Response handling
5. **Test with Postman** - Hands-on API testing

### Exercises:
1. Add pagination to list endpoints
2. Implement search functionality for posts
3. Add likes/reactions to posts
4. Create user profiles with avatar upload
5. Implement post drafts auto-save
6. Add email notifications
7. Create admin dashboard endpoints

---

## 🏆 Project Highlights

✅ **Complete CRUD** for all resources  
✅ **JWT Authentication** with Passport  
✅ **Complex Relationships** (1-M, M-M, M-1)  
✅ **Auto-generated Slugs** for SEO-friendly URLs  
✅ **Password Hashing** with bcrypt  
✅ **Input Validation** with class-validator  
✅ **Error Handling** with proper HTTP codes  
✅ **Postman Collection** ready to import  
✅ **Production-ready** structure  

---

**Happy Coding! 🚀**
