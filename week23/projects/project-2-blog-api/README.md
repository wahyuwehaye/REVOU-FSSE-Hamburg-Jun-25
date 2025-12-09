# 📝 Project 2: Blog API (Intermediate Level)

Build a complete blogging platform API with posts, comments, tags, and categories.

## 🎯 Project Overview

**Difficulty:** Intermediate  
**Est. Time:** 6-8 hours  
**Tech Stack:** NestJS, PostgreSQL, TypeORM, JWT

## 📊 Database Schema

```sql
-- Users (authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT,
  avatar VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- Posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featuredImage VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  viewCount INTEGER DEFAULT 0,
  authorId INTEGER REFERENCES users(id),
  categoryId INTEGER REFERENCES categories(id),
  publishedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- Posts_Tags (Many-to-Many)
CREATE TABLE posts_tags (
  postId INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tagId INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (postId, tagId)
);

-- Comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  postId INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  authorId INTEGER REFERENCES users(id),
  parentId INTEGER REFERENCES comments(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Requirements

### Core Features
- [ ] User authentication (register, login, JWT)
- [ ] User roles (admin, author, user)
- [ ] CRUD for posts (with draft/published status)
- [ ] Categories management
- [ ] Tags (Many-to-Many with posts)
- [ ] Comments (with nested replies)
- [ ] Search posts by title/content
- [ ] Filter by category/tag
- [ ] Pagination
- [ ] Post view counter

### Advanced Features
- [ ] Slug generation from title
- [ ] Featured image upload
- [ ] Like/Unlike posts
- [ ] Bookmark posts
- [ ] User profiles
- [ ] Author dashboard (own posts stats)
- [ ] Admin panel (manage all content)

## 📋 API Endpoints

### Auth
- POST `/auth/register` - Register
- POST `/auth/login` - Login
- GET `/auth/profile` - Get profile

### Posts
- GET `/posts` - List posts (public, published only)
- GET `/posts/:slug` - Get post by slug
- POST `/posts` - Create post (auth)
- PUT `/posts/:id` - Update post (author/admin)
- DELETE `/posts/:id` - Delete post (author/admin)
- PATCH `/posts/:id/publish` - Publish post
- GET `/posts/:id/comments` - Get post comments

### Categories
- GET `/categories` - List all
- POST `/categories` - Create (admin)
- PUT `/categories/:id` - Update (admin)
- DELETE `/categories/:id` - Delete (admin)

### Tags
- GET `/tags` - List all
- POST `/tags` - Create
- GET `/tags/:slug/posts` - Posts by tag

### Comments
- POST `/posts/:id/comments` - Add comment
- POST `/comments/:id/reply` - Reply to comment
- PUT `/comments/:id` - Update comment
- DELETE `/comments/:id` - Delete comment

## 💻 Key Implementation Points

### 1. Slug Generation
```typescript
generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

### 2. Role-Based Access
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'author')
@Post()
createPost() { }
```

### 3. Nested Comments
```typescript
@Entity()
class Comment {
  @ManyToOne(() => Comment, comment => comment.replies)
  parent: Comment;
  
  @OneToMany(() => Comment, comment => comment.parent)
  replies: Comment[];
}
```

### 4. View Counter
```typescript
async incrementViewCount(id: number) {
  await this.postsRepository.increment({ id }, 'viewCount', 1);
}
```

## 🧪 Testing

```bash
# Register author
curl -X POST http://localhost:3000/auth/register \
  -d '{"email":"author@test.com","password":"pass123","username":"author1"}'

# Create post
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My First Post","content":"Content here","categoryId":1}'

# Get published posts
curl http://localhost:3000/posts

# Add comment
curl -X POST http://localhost:3000/posts/1/comments \
  -H "Authorization: Bearer TOKEN" \
  -d '{"content":"Great post!"}'
```

## 🎓 Learning Points

- Many-to-Many relationships (Posts ↔ Tags)
- Self-referencing relations (Comments)
- Role-based authorization
- Slug generation & SEO
- Complex queries with filters
- Aggregation (view counts, comment counts)

---

**Good luck! 🚀**
