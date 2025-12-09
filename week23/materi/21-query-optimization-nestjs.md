# ⚡ Query Optimization in NestJS with TypeORM

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Understand query performance issues
- ✅ Use indexes effectively
- ✅ Optimize TypeORM queries
- ✅ Implement connection pooling
- ✅ Use query caching
- ✅ Avoid N+1 query problem
- ✅ Monitor and analyze query performance

---

## 🎯 Why Query Optimization?

### Performance Impact

**Slow Query:**
```typescript
// Takes 5 seconds to load
const users = await userRepository.find();  // 100,000 users 😱
```

**Optimized Query:**
```typescript
// Takes 0.05 seconds
const users = await userRepository.find({
  skip: 0,
  take: 10,
  cache: true,
});
```

**Real-World Impact:**
- 💰 Cost: Slow queries = More server resources = Higher costs
- 😊 UX: Fast queries = Happy users
- 📈 Scale: Optimized queries handle more traffic

---

## 🔍 Common Performance Issues

### 1. N+1 Query Problem

**Problem:**
```typescript
// Fetches users
const users = await userRepository.find();  // 1 query

// Fetches posts for EACH user
for (const user of users) {
  const posts = await postRepository.find({
    where: { authorId: user.id },  // N queries 😱
  });
}
// Total: 1 + N queries
```

**Solution: Use Relations**
```typescript
const users = await userRepository.find({
  relations: ['posts'],  // 1 query with JOIN ✅
});
```

### 2. Loading Too Much Data

**Problem:**
```typescript
// Loads ALL columns and ALL rows
const users = await userRepository.find();  // 😱
```

**Solution:**
```typescript
// Select only needed columns
const users = await userRepository.find({
  select: ['id', 'email', 'username'],
  skip: 0,
  take: 10,  // Pagination
});
```

### 3. Missing Indexes

**Problem:**
```typescript
// Slow query without index
const users = await userRepository.find({
  where: { email: 'john@example.com' },  // Full table scan 😱
});
```

**Solution: Add Index**
```typescript
@Entity()
export class User {
  @Column()
  @Index()  // ✅ Add index
  email: string;
}
```

---

## 📊 Using Indexes

### What is an Index?

**Index** = Database "bookmark" for faster lookups

**Analogy:**
```
Without Index: Read entire book to find a topic
With Index:    Check index at back, jump to page
```

### Creating Indexes

#### Single Column Index

```typescript
@Entity()
export class User {
  @Column()
  @Index()
  email: string;

  @Column()
  @Index()
  username: string;
}
```

#### Composite Index

```typescript
@Entity()
@Index(['firstName', 'lastName'])  // Multi-column index
export class User {
  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
```

#### Unique Index

```typescript
@Entity()
export class User {
  @Column({ unique: true })  // Automatically creates unique index
  email: string;
}
```

#### Custom Index Name

```typescript
@Entity()
export class User {
  @Column()
  @Index('IDX_USER_EMAIL')
  email: string;
}
```

### When to Use Indexes

**✅ Good for:**
- Columns used in WHERE clauses
- Foreign keys
- Columns used in JOIN conditions
- Columns used in ORDER BY
- Columns with high cardinality (many unique values)

**❌ Bad for:**
- Small tables (< 1000 rows)
- Columns with low cardinality (few unique values)
- Columns that change frequently
- Columns not used in queries

**Example:**
```typescript
@Entity()
export class User {
  @Column()
  @Index()  // ✅ GOOD: Often searched
  email: string;

  @Column({ type: 'boolean' })
  // ❌ BAD: Only 2 values (true/false)
  isActive: boolean;

  @Column()
  @Index()  // ✅ GOOD: Foreign key
  companyId: number;
}
```

---

## 🚀 Query Optimization Techniques

### 1. Select Only Needed Columns

```typescript
// ❌ BAD: Select all columns
const users = await userRepository.find();

// ✅ GOOD: Select specific columns
const users = await userRepository.find({
  select: ['id', 'email', 'username'],
});
```

**Query Builder:**
```typescript
const users = await userRepository
  .createQueryBuilder('user')
  .select(['user.id', 'user.email', 'user.username'])
  .getMany();
```

### 2. Use Pagination

```typescript
// ❌ BAD: Load all rows
const users = await userRepository.find();

// ✅ GOOD: Paginate
const users = await userRepository.find({
  skip: (page - 1) * limit,
  take: limit,
});
```

### 3. Eager Loading Relations

```typescript
// ❌ BAD: N+1 queries
const users = await userRepository.find();
for (const user of users) {
  user.posts = await postRepository.find({ where: { authorId: user.id } });
}

// ✅ GOOD: Load with relations
const users = await userRepository.find({
  relations: ['posts'],
});
```

### 4. Use Query Builder for Complex Queries

```typescript
// ❌ BAD: Multiple queries
const users = await userRepository.find({ where: { isActive: true } });
const posts = await postRepository.find({ where: { authorId: In(users.map(u => u.id)) } });

// ✅ GOOD: Single query with join
const posts = await postRepository
  .createQueryBuilder('post')
  .leftJoinAndSelect('post.author', 'author')
  .where('author.isActive = :isActive', { isActive: true })
  .getMany();
```

### 5. Use Raw Queries for Complex Operations

```typescript
// Complex aggregation
const result = await userRepository.query(`
  SELECT 
    DATE(createdAt) as date,
    COUNT(*) as count
  FROM users
  WHERE createdAt > NOW() - INTERVAL '30 days'
  GROUP BY DATE(createdAt)
  ORDER BY date DESC
`);
```

---

## 💾 Caching Strategies

### 1. Query Result Caching

**Enable in app.module.ts:**
```typescript
TypeOrmModule.forRoot({
  // ... other config
  cache: {
    type: 'database',  // or 'redis'
    duration: 60000,   // 60 seconds
  },
})
```

**Use in queries:**
```typescript
// Cache result for 60 seconds
const users = await userRepository.find({
  cache: 60000,
});

// With custom cache key
const users = await userRepository.find({
  where: { isActive: true },
  cache: {
    id: 'active_users',
    milliseconds: 60000,
  },
});
```

**Query Builder:**
```typescript
const users = await userRepository
  .createQueryBuilder('user')
  .where('user.isActive = :isActive', { isActive: true })
  .cache('active_users', 60000)
  .getMany();
```

### 2. Redis Caching (Recommended)

**Install Redis:**
```bash
npm install ioredis
```

**Configure:**
```typescript
TypeOrmModule.forRoot({
  // ... other config
  cache: {
    type: 'ioredis',
    options: {
      host: 'localhost',
      port: 6379,
    },
    duration: 60000,
  },
})
```

### 3. Clear Cache

```typescript
// Clear all cache
await userRepository.createQueryBuilder()
  .clearCachedResults();

// Clear specific cache
await userRepository.createQueryBuilder()
  .cache('active_users', 0);  // 0 = clear
```

---

## 🔄 Connection Pooling

### What is Connection Pooling?

**Connection Pool** = Reusable database connections

**Without Pool:**
```
Request 1: Open connection → Query → Close
Request 2: Open connection → Query → Close  // Slow! 😱
Request 3: Open connection → Query → Close
```

**With Pool:**
```
Request 1: Get from pool → Query → Return to pool
Request 2: Get from pool → Query → Return to pool  // Fast! ✅
Request 3: Get from pool → Query → Return to pool
```

### Configure Connection Pool

```typescript
// src/app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'mydb',
  
  // Connection pool settings
  extra: {
    max: 10,          // Maximum connections
    min: 2,           // Minimum connections
    idleTimeoutMillis: 30000,  // Close idle after 30s
    connectionTimeoutMillis: 2000,  // Connection timeout
  },
})
```

**Recommended Settings:**

| Environment | max | min |
|-------------|-----|-----|
| Development | 5   | 2   |
| Production  | 20  | 5   |
| High Traffic| 50  | 10  |

---

## 🎯 Solving N+1 Problem

### Example: Users with Posts

**❌ BAD: N+1 Queries**
```typescript
// 1 query to get users
const users = await userRepository.find();

// N queries to get posts (one per user)
for (const user of users) {
  user.posts = await postRepository.find({
    where: { authorId: user.id },
  });
}
// Total: 1 + N queries 😱
```

**✅ GOOD: Single Query with JOIN**
```typescript
const users = await userRepository.find({
  relations: ['posts'],
});
// Total: 1 query ✅
```

**✅ GOOD: Query Builder**
```typescript
const users = await userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'post')
  .getMany();
```

**✅ GOOD: Custom SQL**
```typescript
const users = await userRepository.query(`
  SELECT 
    u.*,
    json_agg(p.*) as posts
  FROM users u
  LEFT JOIN posts p ON p.authorId = u.id
  GROUP BY u.id
`);
```

---

## 📈 Monitoring Query Performance

### 1. Enable Logging

```typescript
TypeOrmModule.forRoot({
  // ... other config
  logging: true,
  logger: 'advanced-console',
})
```

**Output:**
```
query: SELECT * FROM users WHERE id = $1
parameters: [1]
execution time: 2ms
```

### 2. Log Slow Queries

```typescript
TypeOrmModule.forRoot({
  // ... other config
  logging: ['error', 'warn'],
  maxQueryExecutionTime: 1000,  // Log queries > 1s
})
```

### 3. Custom Query Logger

```typescript
// src/config/query-logger.ts
import { Logger as TypeOrmLogger } from 'typeorm';

export class QueryLogger implements TypeOrmLogger {
  logQuery(query: string, parameters?: any[]) {
    console.log('Query:', query);
    console.log('Parameters:', parameters);
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    console.error('Query Error:', error);
    console.error('Query:', query);
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    console.warn(`Slow Query (${time}ms):`, query);
  }

  logSchemaBuild(message: string) {
    console.log('Schema Build:', message);
  }

  logMigration(message: string) {
    console.log('Migration:', message);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    console.log(`[${level}]`, message);
  }
}
```

**Use it:**
```typescript
TypeOrmModule.forRoot({
  // ... other config
  logger: new QueryLogger(),
})
```

---

## 🛠️ Optimization Checklist

### ✅ Query Level

- [ ] Use pagination (skip/take)
- [ ] Select only needed columns
- [ ] Use indexes on WHERE columns
- [ ] Eager load relations (avoid N+1)
- [ ] Use Query Builder for complex queries
- [ ] Cache frequent queries

### ✅ Database Level

- [ ] Add indexes on foreign keys
- [ ] Add composite indexes for multi-column queries
- [ ] Use appropriate column types
- [ ] Normalize database structure
- [ ] Set up connection pooling

### ✅ Application Level

- [ ] Enable query caching (Redis)
- [ ] Implement pagination
- [ ] Use DTOs to limit returned data
- [ ] Monitor slow queries
- [ ] Use EXPLAIN ANALYZE

---

## 🔬 EXPLAIN ANALYZE

### Understanding Query Plans

```typescript
const result = await userRepository.query(`
  EXPLAIN ANALYZE
  SELECT * FROM users
  WHERE email = 'john@example.com'
`);

console.log(result);
```

**Without Index:**
```
Seq Scan on users  (cost=0.00..25.00 rows=1 width=100) (actual time=0.050..0.250 rows=1 loops=1)
  Filter: (email = 'john@example.com')
Planning Time: 0.100 ms
Execution Time: 0.300 ms
```

**With Index:**
```
Index Scan using idx_users_email on users  (cost=0.00..8.00 rows=1 width=100) (actual time=0.010..0.015 rows=1 loops=1)
  Index Cond: (email = 'john@example.com')
Planning Time: 0.050 ms
Execution Time: 0.020 ms
```

**Key Metrics:**
- **cost:** Estimated query cost
- **rows:** Estimated rows returned
- **actual time:** Real execution time
- **Seq Scan:** Full table scan (slow)
- **Index Scan:** Using index (fast)

---

## 💡 Real-World Example

### Slow Service (Before)

```typescript
@Injectable()
export class PostsService {
  // ❌ BAD: N+1 problem
  async findAllWithAuthor() {
    const posts = await this.postRepository.find();
    
    for (const post of posts) {
      post.author = await this.userRepository.findOne({
        where: { id: post.authorId },
      });
    }
    
    return posts;
  }

  // ❌ BAD: No pagination
  async findAll() {
    return await this.postRepository.find();
  }

  // ❌ BAD: Loading everything
  async findOne(id: number) {
    return await this.postRepository.findOne({
      where: { id },
    });
  }
}
```

### Optimized Service (After)

```typescript
@Injectable()
export class PostsService {
  // ✅ GOOD: Single query with JOIN
  async findAllWithAuthor(page = 1, limit = 10) {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tag')
      .select([
        'post.id',
        'post.title',
        'post.createdAt',
        'author.id',
        'author.username',
        'tag.id',
        'tag.name',
      ])
      .skip((page - 1) * limit)
      .take(limit)
      .cache(`posts_page_${page}`, 60000)
      .orderBy('post.createdAt', 'DESC')
      .getManyAndCount();
  }

  // ✅ GOOD: Pagination + caching
  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.postRepository.findAndCount({
      select: ['id', 'title', 'createdAt'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      cache: 60000,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ✅ GOOD: Select only needed fields + cache
  async findOne(id: number) {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tag')
      .select([
        'post',
        'author.id',
        'author.username',
        'author.email',
        'tag',
      ])
      .where('post.id = :id', { id })
      .cache(`post_${id}`, 60000)
      .getOne();
  }

  // ✅ GOOD: Efficient search with index
  async search(keyword: string, page = 1, limit = 10) {
    return await this.postRepository
      .createQueryBuilder('post')
      .where('post.title ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('post.content ILIKE :keyword', { keyword: `%${keyword}%` })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }
}
```

### Entity with Indexes

```typescript
@Entity('posts')
@Index(['title'])  // For search
@Index(['createdAt'])  // For sorting
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  @Index()  // Foreign key
  authorId: number;

  @ManyToOne(() => User, { eager: false })
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## 📊 Performance Comparison

### Before Optimization

```
Query: SELECT * FROM posts
Time: 1.5s
Rows: 100,000

Query: SELECT * FROM users WHERE id = 1
Query: SELECT * FROM users WHERE id = 2
Query: SELECT * FROM users WHERE id = 3
...
Time: 3.0s (N+1 problem)

Total Time: 4.5s 😱
```

### After Optimization

```
Query: 
  SELECT p.*, u.username 
  FROM posts p 
  LEFT JOIN users u ON p.authorId = u.id 
  LIMIT 10 OFFSET 0
Time: 0.02s

Total Time: 0.02s ✅
```

**Result:**
- **225x faster** (4.5s → 0.02s)
- **Fewer database queries** (1 vs 100,001)
- **Less memory usage**
- **Better scalability**

---

## 💡 Best Practices

### 1. Always Use Pagination

```typescript
// ✅ GOOD
const [data, total] = await repository.findAndCount({
  skip: (page - 1) * limit,
  take: limit,
});
```

### 2. Select Only Needed Columns

```typescript
// ✅ GOOD
const users = await repository.find({
  select: ['id', 'email', 'username'],
});
```

### 3. Add Indexes to Foreign Keys

```typescript
// ✅ GOOD
@Column()
@Index()
authorId: number;
```

### 4. Use Relations Instead of Manual Joins

```typescript
// ✅ GOOD
const posts = await repository.find({
  relations: ['author', 'tags'],
});
```

### 5. Enable Query Caching

```typescript
// ✅ GOOD
const users = await repository.find({
  cache: 60000,
});
```

### 6. Monitor Slow Queries

```typescript
// ✅ GOOD
TypeOrmModule.forRoot({
  maxQueryExecutionTime: 1000,
  logging: ['warn', 'error'],
})
```

---

## 🎯 Summary

**Performance Issues:**
- N+1 Query Problem
- Loading too much data
- Missing indexes
- No caching
- Poor connection pooling

**Solutions:**
- Use relations to avoid N+1
- Implement pagination
- Add indexes on queried columns
- Enable query caching (Redis)
- Configure connection pool
- Monitor with logging

**Key Techniques:**
```typescript
// Pagination
findAndCount({ skip, take })

// Select columns
find({ select: ['id', 'email'] })

// Relations
find({ relations: ['author'] })

// Caching
find({ cache: 60000 })

// Indexes
@Column() @Index() email: string;
```

**Connection Pool:**
```typescript
extra: {
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
}
```

**Next Step:**
👉 Lanjut ke [Materi 22: Production Best Practices](./22-production-best-practices.md)

---

**Happy Coding! 🚀**
