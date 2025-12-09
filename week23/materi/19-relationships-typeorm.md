# 🔗 Entity Relationships in TypeORM

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Understand relationship types (One-to-One, One-to-Many, Many-to-Many)
- ✅ Implement relationships in TypeORM
- ✅ Use cascade options
- ✅ Understand eager vs lazy loading
- ✅ Work with bi-directional relationships
- ✅ Join queries with relations
- ✅ Handle circular dependencies

---

## 🎯 Types of Relationships

### Overview

| Relationship | Example | Description |
|--------------|---------|-------------|
| **One-to-One** | User ↔️ Profile | One user has one profile |
| **One-to-Many** | User ↔️ Posts | One user has many posts |
| **Many-to-One** | Post ↔️ User | Many posts belong to one user |
| **Many-to-Many** | Post ↔️ Tags | Many posts have many tags |

---

## 1️⃣ One-to-One Relationship

### Scenario: User has one Profile

```
User (1) ←→ (1) Profile
```

### Implementation

#### user.entity.ts

```typescript
// src/users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from '../profiles/profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  // One-to-One relationship
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,  // Auto-save profile when saving user
    eager: false,   // Don't auto-load profile
  })
  @JoinColumn()  // This side owns the foreign key
  profile: Profile;
}
```

#### profile.entity.ts

```typescript
// src/profiles/profile.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  // Reverse side of relationship
  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
```

**Database Structure:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  username VARCHAR(255),
  profileId INTEGER UNIQUE REFERENCES profiles(id)
);

CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  bio TEXT,
  avatar VARCHAR(255),
  phone VARCHAR(20)
);
```

### Usage Example

```typescript
// src/users/users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Create user with profile
  async createWithProfile(userData: any, profileData: any) {
    const user = this.usersRepository.create({
      ...userData,
      profile: profileData,  // Cascade will save profile
    });

    return await this.usersRepository.save(user);
  }

  // Find user with profile
  async findWithProfile(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],  // Load profile
    });
  }
}
```

---

## 2️⃣ One-to-Many / Many-to-One Relationship

### Scenario: User has many Posts

```
User (1) ←→ (N) Post
```

### Implementation

#### user.entity.ts

```typescript
// src/users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  // One user has many posts
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
```

#### post.entity.ts

```typescript
// src/posts/post.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  // Many posts belong to one user
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',  // Delete posts when user is deleted
  })
  @JoinColumn({ name: 'authorId' })  // Custom column name
  author: User;

  @Column()
  authorId: number;  // Explicit FK column
}
```

**Database Structure:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  username VARCHAR(255)
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  createdAt TIMESTAMP,
  authorId INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

### Usage Example

```typescript
// src/posts/posts.service.ts
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Create post
  async create(authorId: number, postData: any) {
    const author = await this.usersRepository.findOne({
      where: { id: authorId },
    });

    const post = this.postsRepository.create({
      ...postData,
      author,
    });

    return await this.postsRepository.save(post);
  }

  // Find all posts with author
  async findAll() {
    return await this.postsRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  // Find user's posts
  async findByUser(userId: number) {
    return await this.postsRepository.find({
      where: { authorId: userId },
      relations: ['author'],
    });
  }
}
```

---

## 3️⃣ Many-to-Many Relationship

### Scenario: Posts have many Tags

```
Post (N) ←→ (N) Tag
```

### Implementation

#### post.entity.ts

```typescript
// src/posts/post.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from '../tags/tag.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  // Many-to-Many relationship
  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true,
  })
  @JoinTable({
    name: 'posts_tags',  // Junction table name
    joinColumn: {
      name: 'postId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];
}
```

#### tag.entity.ts

```typescript
// src/tags/tag.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  // Reverse side
  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
```

**Database Structure:**
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  description TEXT
);

CREATE TABLE posts_tags (
  postId INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tagId INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (postId, tagId)
);
```

### Usage Example

```typescript
// src/posts/posts.service.ts
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  // Create post with tags
  async createWithTags(postData: any, tagNames: string[]) {
    // Find or create tags
    const tags = await Promise.all(
      tagNames.map(async (name) => {
        let tag = await this.tagsRepository.findOne({ where: { name } });
        if (!tag) {
          tag = this.tagsRepository.create({ name });
          await this.tagsRepository.save(tag);
        }
        return tag;
      }),
    );

    // Create post with tags
    const post = this.postsRepository.create({
      ...postData,
      tags,
    });

    return await this.postsRepository.save(post);
  }

  // Find posts with tags
  async findAll() {
    return await this.postsRepository.find({
      relations: ['tags'],
    });
  }

  // Find posts by tag
  async findByTag(tagName: string) {
    return await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('tag.name = :tagName', { tagName })
      .getMany();
  }

  // Add tag to post
  async addTag(postId: number, tagName: string) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['tags'],
    });

    let tag = await this.tagsRepository.findOne({ where: { name: tagName } });
    if (!tag) {
      tag = this.tagsRepository.create({ name: tagName });
      await this.tagsRepository.save(tag);
    }

    post.tags.push(tag);
    return await this.postsRepository.save(post);
  }

  // Remove tag from post
  async removeTag(postId: number, tagId: number) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['tags'],
    });

    post.tags = post.tags.filter((tag) => tag.id !== tagId);
    return await this.postsRepository.save(post);
  }
}
```

---

## 🔄 Cascade Options

### What is Cascade?

**Cascade** = Automatically perform operations on related entities

### Available Options

```typescript
@OneToMany(() => Post, (post) => post.author, {
  cascade: true,      // All operations
  cascade: ['insert'],  // Only insert
  cascade: ['update'],  // Only update
  cascade: ['remove'],  // Only remove
  cascade: ['insert', 'update'],  // Multiple
})
posts: Post[];
```

### Example: Cascade Insert

```typescript
// Without cascade
const user = new User();
user.email = 'john@example.com';
await userRepository.save(user);

const profile = new Profile();
profile.bio = 'Hello World';
profile.user = user;
await profileRepository.save(profile);  // Manual save

// With cascade: true
const user = new User();
user.email = 'john@example.com';
user.profile = {
  bio: 'Hello World',
};
await userRepository.save(user);  // Auto-saves profile!
```

### ⚠️ Cascade Warning

```typescript
// DANGER: cascade: true with remove
@OneToOne(() => Profile, {
  cascade: true,
})
profile: Profile;

// If you delete user...
await userRepository.remove(user);
// Profile is also deleted! 🔥
```

**Best Practice:** Be explicit about cascade operations

```typescript
@OneToOne(() => Profile, {
  cascade: ['insert', 'update'],  // ✅ Safe
  // cascade: true,  // ❌ Too broad
})
profile: Profile;
```

---

## 🚀 Eager vs Lazy Loading

### Eager Loading

**Definition:** Always load relations automatically

```typescript
@OneToOne(() => Profile, {
  eager: true,  // Always load profile
})
profile: Profile;

// No need to specify relations
const user = await userRepository.findOne({ where: { id: 1 } });
console.log(user.profile);  // ✅ Loaded!
```

**Pros:**
- ✅ Convenient
- ✅ Less code

**Cons:**
- ❌ Always loads (even if not needed)
- ❌ Performance impact
- ❌ Can cause circular loading

### Lazy Loading

**Definition:** Load relations only when accessed

```typescript
@OneToOne(() => Profile, {
  eager: false,  // Default
})
profile: Profile;

// Must explicitly load
const user = await userRepository.findOne({
  where: { id: 1 },
  relations: ['profile'],  // Specify!
});
console.log(user.profile);  // ✅ Loaded!
```

**Pros:**
- ✅ Performance efficient
- ✅ Load only what you need
- ✅ Prevents circular loading

**Cons:**
- ❌ More verbose
- ❌ Must remember to load relations

**Recommendation:** Use `eager: false` (lazy loading) by default

---

## 🔍 Loading Relations

### Method 1: Using `relations` option

```typescript
// Single relation
const user = await userRepository.findOne({
  where: { id: 1 },
  relations: ['profile'],
});

// Multiple relations
const post = await postRepository.findOne({
  where: { id: 1 },
  relations: ['author', 'tags'],
});

// Nested relations
const post = await postRepository.findOne({
  where: { id: 1 },
  relations: ['author', 'author.profile', 'tags'],
});
```

### Method 2: Using Query Builder

```typescript
// LEFT JOIN
const posts = await postRepository
  .createQueryBuilder('post')
  .leftJoinAndSelect('post.author', 'author')
  .leftJoinAndSelect('post.tags', 'tag')
  .getMany();

// INNER JOIN
const posts = await postRepository
  .createQueryBuilder('post')
  .innerJoinAndSelect('post.author', 'author')
  .where('author.isActive = :isActive', { isActive: true })
  .getMany();
```

### Method 3: Relation Query Builder

```typescript
// Load specific relation
const user = await userRepository.findOne({ where: { id: 1 } });
const posts = await userRepository
  .createQueryBuilder()
  .relation(User, 'posts')
  .of(user)
  .loadMany();
```

---

## ↔️ Bi-directional vs Uni-directional

### Bi-directional

**Definition:** Both entities know about each other

```typescript
// user.entity.ts
@OneToMany(() => Post, (post) => post.author)
posts: Post[];

// post.entity.ts
@ManyToOne(() => User, (user) => user.posts)
author: User;
```

**Pros:**
- ✅ Can navigate both ways
- ✅ More intuitive

**Cons:**
- ❌ Must maintain both sides
- ❌ Risk of circular dependencies

### Uni-directional

**Definition:** Only one side knows about the relationship

```typescript
// post.entity.ts
@ManyToOne(() => User)
author: User;

// user.entity.ts
// No posts property!
```

**Pros:**
- ✅ Simpler
- ✅ Less maintenance
- ✅ No circular dependencies

**Cons:**
- ❌ Can't navigate from User to Posts easily

---

## 🔄 Self-Referencing Relations

### Example: Comments with Replies

```typescript
// src/comments/comment.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  // Parent comment
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @Column({ nullable: true })
  parentId: number;

  // Child comments (replies)
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];
}
```

**Usage:**
```typescript
// Create root comment
const rootComment = commentRepository.create({
  content: 'This is a comment',
});
await commentRepository.save(rootComment);

// Create reply
const reply = commentRepository.create({
  content: 'This is a reply',
  parent: rootComment,
});
await commentRepository.save(reply);

// Load with replies
const comment = await commentRepository.findOne({
  where: { id: 1 },
  relations: ['replies'],
});
```

---

## 📊 Complex Example: Blog System

### Entities

#### user.entity.ts

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
```

#### profile.entity.ts

```typescript
@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
```

#### post.entity.ts

```typescript
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
```

#### tag.entity.ts

```typescript
@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
```

#### comment.entity.ts

```typescript
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
  })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];
}
```

### Query Examples

```typescript
// Get post with all relations
const post = await postRepository.findOne({
  where: { id: 1 },
  relations: [
    'author',
    'author.profile',
    'tags',
    'comments',
    'comments.author',
    'comments.replies',
  ],
});

// Get user with all posts and comments
const user = await userRepository.findOne({
  where: { id: 1 },
  relations: ['profile', 'posts', 'posts.tags', 'comments'],
});
```

---

## 🎯 onDelete Options

### Available Options

```typescript
@ManyToOne(() => User, {
  onDelete: 'CASCADE',    // Delete posts when user deleted
  onDelete: 'SET NULL',   // Set authorId to NULL
  onDelete: 'RESTRICT',   // Prevent user deletion if has posts
  onDelete: 'NO ACTION',  // Do nothing (default)
})
author: User;
```

### Examples

```typescript
// CASCADE: Delete all posts when user deleted
@ManyToOne(() => User, { onDelete: 'CASCADE' })
author: User;

// SET NULL: Keep posts but set author to null
@ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
author: User;

// RESTRICT: Can't delete user if has posts
@ManyToOne(() => User, { onDelete: 'RESTRICT' })
author: User;
```

---

## 💡 Best Practices

### 1. Be Explicit About Cascades

```typescript
// ❌ BAD
@OneToMany(() => Post, { cascade: true })
posts: Post[];

// ✅ GOOD
@OneToMany(() => Post, {
  cascade: ['insert', 'update'],
})
posts: Post[];
```

### 2. Use Lazy Loading by Default

```typescript
// ✅ GOOD
@OneToMany(() => Post, { eager: false })
posts: Post[];
```

### 3. Specify JoinColumn Names

```typescript
// ✅ GOOD
@ManyToOne(() => User)
@JoinColumn({ name: 'authorId' })
author: User;

@Column()
authorId: number;  // Explicit FK
```

### 4. Use Indexes on Foreign Keys

```typescript
@Column()
@Index()
authorId: number;
```

### 5. Handle onDelete Properly

```typescript
// ✅ GOOD for critical data
@ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
author: User;

// ✅ GOOD for dependent data
@ManyToOne(() => Post, { onDelete: 'CASCADE' })
post: Post;
```

---

## 🎯 Summary

**Relationship Types:**
- **One-to-One:** `@OneToOne()`, one entity per entity
- **One-to-Many:** `@OneToMany()`, parent has multiple children
- **Many-to-One:** `@ManyToOne()`, children reference parent
- **Many-to-Many:** `@ManyToMany()`, junction table

**Key Decorators:**
- `@JoinColumn()` - Owns FK (One-to-One, Many-to-One)
- `@JoinTable()` - Creates junction table (Many-to-Many)

**Options:**
- `cascade` - Auto-save/delete related entities
- `eager` - Auto-load relations
- `onDelete` - Handle deletions

**Loading Relations:**
```typescript
// Method 1: relations option
findOne({ relations: ['author', 'tags'] })

// Method 2: Query Builder
createQueryBuilder('post')
  .leftJoinAndSelect('post.author', 'author')
  .getMany()
```

**Next Step:**
👉 Lanjut ke [Materi 20: Migrations & Seeding](./20-migrations-seeding.md)

---

**Happy Coding! 🚀**
