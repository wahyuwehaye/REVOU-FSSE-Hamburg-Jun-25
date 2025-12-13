# 🔗 Database Relations dengan Prisma

## 📋 Daftar Isi

1. [Pengantar](#pengantar)
2. [What the Heck is a JOIN?](#what-is-join)
3. [Types of Relationships](#types-of-relationships)
4. [One-to-One Relationship](#one-to-one)
5. [One-to-Many Relationship](#one-to-many)
6. [Many-to-Many Relationship](#many-to-many)
7. [Relation Queries](#relation-queries)
8. [Nested Writes](#nested-writes)
9. [Cascade Operations](#cascade-operations)
10. [Best Practices](#best-practices)

---

## 📖 Pengantar

Di Material 1, kita sudah belajar Prisma basics. Sekarang kita akan deep dive ke **Database Relations** - salah satu fitur paling powerful dari Prisma!

### 🎯 Tujuan Pembelajaran

✅ Memahami apa itu JOIN dan kapan menggunakannya  
✅ Implement One-to-One relationship  
✅ Implement One-to-Many relationship  
✅ Implement Many-to-Many relationship  
✅ Query data dengan relations  
✅ Nested writes (create related data)  
✅ Cascade operations  
✅ Optimize relation queries  

### ⏱️ Estimasi Waktu

**Total:** 4-5 jam
- Teori & JOINs: 1 jam
- One-to-One: 1 jam
- One-to-Many: 1 jam
- Many-to-Many: 1.5 jam
- Practice: 30 menit

---

## 🤔 What the Heck is a JOIN?

### The Big Question from Week 23

Di Week 23, kita punya "lingering question": **What the heck is a JOIN?**

Let's answer it once and for all! 🎯

### Analogi Real-World

Bayangkan kamu punya 2 buku catatan:

**📕 Buku 1: Daftar Penulis**
```
ID | Nama         | Email
---|--------------|------------------
1  | John Doe     | john@example.com
2  | Jane Smith   | jane@example.com
```

**📗 Buku 2: Daftar Artikel**
```
ID | Judul                | Penulis_ID
---|----------------------|-----------
1  | Intro to Prisma      | 1
2  | NestJS Best Practice | 2
3  | Database Relations   | 1
```

**Pertanyaan:** Siapa yang menulis "Intro to Prisma"?

**Manual way (tanpa JOIN):**
1. Cari artikel dengan judul "Intro to Prisma" → dapat `Penulis_ID = 1`
2. Cari penulis dengan ID 1 → dapat "John Doe"

**With JOIN:**
Gabungkan kedua buku jadi satu tabel:
```
Artikel_ID | Judul                | Penulis_ID | Nama      | Email
-----------|----------------------|------------|-----------|------------------
1          | Intro to Prisma      | 1          | John Doe  | john@example.com
2          | NestJS Best Practice | 2          | Jane Smith| jane@example.com
3          | Database Relations   | 1          | John Doe  | john@example.com
```

Sekarang bisa langsung lihat: "Intro to Prisma" ditulis oleh John Doe! ✅

### JOIN in SQL

**Traditional SQL:**
```sql
-- INNER JOIN: Gabungkan 2 tabel
SELECT 
  posts.title,
  users.name AS author
FROM posts
INNER JOIN users ON posts.author_id = users.id
WHERE posts.title = 'Intro to Prisma';

-- Result:
-- title            | author
-- -----------------|----------
-- Intro to Prisma  | John Doe
```

**With Prisma (No manual JOIN needed!):**
```typescript
const post = await prisma.post.findFirst({
  where: { title: 'Intro to Prisma' },
  include: {
    author: true  // ← Prisma handles the JOIN automatically!
  }
});

// Result:
// {
//   id: 1,
//   title: 'Intro to Prisma',
//   author: {
//     id: 1,
//     name: 'John Doe',
//     email: 'john@example.com'
//   }
// }
```

**🎉 That's what JOIN is:** Menggabungkan data dari multiple tables!

### Visual Representation

```
┌─────────────────────────────────────────────────────────┐
│                    WITHOUT JOIN                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Query 1: SELECT * FROM posts WHERE id = 1             │
│  Result:  { id: 1, title: '...', author_id: 5 }       │
│                                                         │
│  Query 2: SELECT * FROM users WHERE id = 5             │
│  Result:  { id: 5, name: 'John' }                     │
│                                                         │
│  Total: 2 database queries                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     WITH JOIN                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Query: SELECT * FROM posts                             │
│         JOIN users ON posts.author_id = users.id        │
│         WHERE posts.id = 1                              │
│                                                         │
│  Result: {                                              │
│    id: 1,                                               │
│    title: '...',                                        │
│    author: { id: 5, name: 'John' }                     │
│  }                                                      │
│                                                         │
│  Total: 1 database query (faster!)                      │
└─────────────────────────────────────────────────────────┘
```

### Types of JOINs (FYI)

```
┌─────────────────────────────────────────────────────────┐
│                   TYPES OF JOINS                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. INNER JOIN (most common)                            │
│     └─ Return only matching records                     │
│                                                         │
│  2. LEFT JOIN                                           │
│     └─ Return all from left table + matches from right  │
│                                                         │
│  3. RIGHT JOIN                                          │
│     └─ Return all from right table + matches from left  │
│                                                         │
│  4. FULL OUTER JOIN                                     │
│     └─ Return all records from both tables              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Good news:** Prisma handles all this automatically! 🎉

---

## 📊 Types of Relationships

### 3 Main Types

```
┌─────────────────────────────────────────────────────────┐
│                  RELATIONSHIP TYPES                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. One-to-One (1:1)                                    │
│     User ↔ Profile                                      │
│     └─ One user has one profile                         │
│                                                         │
│  2. One-to-Many (1:N)                                   │
│     User → Posts                                        │
│     └─ One user has many posts                          │
│                                                         │
│  3. Many-to-Many (M:N)                                  │
│     Posts ↔ Tags                                        │
│     └─ One post has many tags                           │
│     └─ One tag belongs to many posts                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Visual Examples

**One-to-One:**
```
User 1 ─── Profile 1
User 2 ─── Profile 2
User 3 ─── Profile 3
```

**One-to-Many:**
```
User 1 ─┬─ Post 1
        ├─ Post 2
        └─ Post 3

User 2 ─┬─ Post 4
        └─ Post 5
```

**Many-to-Many:**
```
Post 1 ─┬─ Tag 1
        └─ Tag 2

Post 2 ─┬─ Tag 1
        ├─ Tag 2
        └─ Tag 3

Post 3 ─── Tag 2
```

---

## 👤 One-to-One Relationship

### Concept

**One-to-One:** Setiap record di tabel A berhubungan dengan **maksimal 1** record di tabel B.

**Real-world examples:**
- User ↔ Profile
- Person ↔ Passport
- Employee ↔ EmployeeDetail
- Country ↔ Capital

### Prisma Schema

```prisma
// User has one Profile
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String
  
  profile Profile? // ← Optional: user might not have profile yet
  
  @@map("users")
}

// Profile belongs to one User
model Profile {
  id        Int     @id @default(autoincrement())
  bio       String?
  avatar    String?
  website   String?
  location  String?
  
  userId    Int     @unique  // ← Foreign key (MUST be unique for 1:1)
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("profiles")
}
```

**📝 Key Points:**

```prisma
profile Profile?
// ? means optional (user bisa exist tanpa profile)

userId Int @unique
// @unique ensures 1:1 relationship (1 user = 1 profile only)

@relation(fields: [userId], references: [id], onDelete: Cascade)
// fields: [userId] → foreign key di model ini
// references: [id] → primary key di User model
// onDelete: Cascade → hapus profile kalau user dihapus
```

### Migration

```bash
npx prisma migrate dev --name add_user_profile
```

**Generated SQL:**
```sql
-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "website" TEXT,
    "location" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### CRUD Operations

**Create User with Profile:**

```typescript
// profiles.service.ts
async createWithUser(createDto: CreateProfileWithUserDto) {
  return this.prisma.profile.create({
    data: {
      bio: createDto.bio,
      avatar: createDto.avatar,
      website: createDto.website,
      user: {
        create: {  // ← Nested create
          email: createDto.email,
          name: createDto.name,
          password: createDto.password,
        }
      }
    },
    include: {
      user: true  // ← Return with user data
    }
  });
}
```

**Create Profile for Existing User:**

```typescript
async create(userId: number, createDto: CreateProfileDto) {
  // Check if user exists
  const user = await this.prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new NotFoundException('User not found');
  }
  
  // Check if profile already exists
  const existingProfile = await this.prisma.profile.findUnique({
    where: { userId }
  });
  
  if (existingProfile) {
    throw new ConflictException('Profile already exists');
  }
  
  // Create profile
  return this.prisma.profile.create({
    data: {
      ...createDto,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        }
      }
    }
  });
}
```

**Get User with Profile:**

```typescript
async findUserWithProfile(userId: number) {
  return this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true  // ← Include related profile
    }
  });
}

// Result:
// {
//   id: 1,
//   email: 'john@example.com',
//   name: 'John Doe',
//   profile: {
//     id: 1,
//     bio: 'Software developer',
//     avatar: 'https://...',
//     website: 'https://johndoe.com',
//     location: 'Jakarta',
//     userId: 1
//   }
// }
```

**Update Profile:**

```typescript
async update(userId: number, updateDto: UpdateProfileDto) {
  // Check if profile exists
  const profile = await this.prisma.profile.findUnique({
    where: { userId }
  });
  
  if (!profile) {
    throw new NotFoundException('Profile not found');
  }
  
  return this.prisma.profile.update({
    where: { userId },
    data: updateDto,
    include: {
      user: true
    }
  });
}
```

**Delete Profile (keep user):**

```typescript
async remove(userId: number) {
  const profile = await this.prisma.profile.findUnique({
    where: { userId }
  });
  
  if (!profile) {
    throw new NotFoundException('Profile not found');
  }
  
  await this.prisma.profile.delete({
    where: { userId }
  });
  
  return { message: 'Profile deleted' };
}
```

---

## 📚 One-to-Many Relationship

### Concept

**One-to-Many:** Setiap record di tabel A berhubungan dengan **banyak** records di tabel B.

**Real-world examples:**
- User → Posts (1 user, many posts)
- Category → Products
- Author → Books
- Department → Employees

### Prisma Schema

```prisma
// User has many Posts
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  
  posts Post[] // ← Array: user has many posts
  
  @@map("users")
}

// Post belongs to one User
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String   @db.Text
  published Boolean  @default(false)
  
  authorId  Int      // ← Foreign key
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([authorId])  // ← Index for performance
  @@map("posts")
}
```

**📝 Key Points:**

```prisma
posts Post[]
// Array notation: one user has many posts

authorId Int
// Foreign key (NOT unique, because multiple posts can have same author)

@@index([authorId])
// Index untuk speed up queries yang filter by authorId
```

### Migration

```bash
npx prisma migrate dev --name add_posts
```

### CRUD Operations

**Create Post:**

```typescript
async create(createDto: CreatePostDto) {
  return this.prisma.post.create({
    data: {
      title: createDto.title,
      content: createDto.content,
      published: createDto.published,
      authorId: createDto.authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });
}
```

**Get All Posts with Authors:**

```typescript
async findAll() {
  return this.prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

// Result:
// [
//   {
//     id: 1,
//     title: 'Intro to Prisma',
//     content: '...',
//     published: true,
//     authorId: 1,
//     author: {
//       id: 1,
//       name: 'John Doe',
//       email: 'john@example.com'
//     }
//   },
//   // ...
// ]
```

**Get User with All Posts:**

```typescript
async findUserWithPosts(userId: number) {
  return this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

// Result:
// {
//   id: 1,
//   email: 'john@example.com',
//   name: 'John Doe',
//   posts: [
//     { id: 1, title: 'Post 1', ... },
//     { id: 2, title: 'Post 2', ... },
//     { id: 3, title: 'Post 3', ... },
//   ]
// }
```

**Get User with Published Posts Only:**

```typescript
async findUserWithPublishedPosts(userId: number) {
  return this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        where: {
          published: true  // ← Filter nested relation
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}
```

**Count User Posts:**

```typescript
async countUserPosts(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          posts: true  // ← Count posts
        }
      }
    }
  });
  
  return {
    userId: user.id,
    name: user.name,
    postCount: user._count.posts
  };
}
```

---

## 🔀 Many-to-Many Relationship

### Concept

**Many-to-Many:** Records di tabel A berhubungan dengan **banyak** records di tabel B, dan sebaliknya.

**Real-world examples:**
- Posts ↔ Tags (1 post has many tags, 1 tag belongs to many posts)
- Students ↔ Courses
- Actors ↔ Movies
- Products ↔ Categories

### Two Approaches

**1. Implicit Many-to-Many** (Prisma handles join table)
**2. Explicit Many-to-Many** (You define join table) ← Recommended!

### Approach 1: Implicit Many-to-Many

```prisma
model Post {
  id    Int    @id @default(autoincrement())
  title String
  
  tags  Tag[]  // ← Many-to-many
  
  @@map("posts")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  
  posts Post[] // ← Many-to-many
  
  @@map("tags")
}
```

**Generated join table by Prisma:**
```sql
CREATE TABLE "_PostToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);
```

**⚠️ Limitation:** Can't add extra fields to join table (e.g., `createdAt`, `order`)

### Approach 2: Explicit Many-to-Many (Recommended!)

```prisma
model Post {
  id    Int    @id @default(autoincrement())
  title String
  
  tags  TagsOnPosts[] // ← Relation through join table
  
  @@map("posts")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  
  posts TagsOnPosts[] // ← Relation through join table
  
  @@map("tags")
}

// Join table (explicit)
model TagsOnPosts {
  postId    Int
  tagId     Int
  
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  assignedAt DateTime @default(now()) // ← Extra field!
  
  @@id([postId, tagId]) // ← Composite primary key
  @@index([postId])
  @@index([tagId])
  @@map("tags_on_posts")
}
```

**📝 Key Points:**

```prisma
@@id([postId, tagId])
// Composite primary key: combination of postId + tagId must be unique
// Prevents duplicate: same tag can't be added to same post twice

assignedAt DateTime @default(now())
// Extra field in join table (not possible with implicit M:N)
```

### Migration

```bash
npx prisma migrate dev --name add_tags_many_to_many
```

**Generated SQL:**
```sql
-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags_on_posts" (
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_on_posts_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- AddForeignKey
ALTER TABLE "tags_on_posts" ADD CONSTRAINT "tags_on_posts_postId_fkey" 
  FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE;

ALTER TABLE "tags_on_posts" ADD CONSTRAINT "tags_on_posts_tagId_fkey" 
  FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE;
```

### CRUD Operations

**Create Post with Tags:**

```typescript
async createPostWithTags(createDto: CreatePostWithTagsDto) {
  return this.prisma.post.create({
    data: {
      title: createDto.title,
      content: createDto.content,
      authorId: createDto.authorId,
      tags: {
        create: createDto.tagIds.map(tagId => ({
          tag: {
            connect: { id: tagId }
          }
        }))
      }
    },
    include: {
      author: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });
}
```

**Add Tags to Existing Post:**

```typescript
async addTagsToPost(postId: number, tagIds: number[]) {
  // Check if post exists
  const post = await this.prisma.post.findUnique({
    where: { id: postId }
  });
  
  if (!post) {
    throw new NotFoundException('Post not found');
  }
  
  // Add tags
  await this.prisma.tagsOnPosts.createMany({
    data: tagIds.map(tagId => ({
      postId,
      tagId,
    })),
    skipDuplicates: true, // ← Ignore if already exists
  });
  
  // Return updated post with tags
  return this.prisma.post.findUnique({
    where: { id: postId },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    }
  });
}
```

**Get Post with Tags:**

```typescript
async findPostWithTags(postId: number) {
  return this.prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        }
      },
      tags: {
        include: {
          tag: true
        }
      }
    }
  });
}

// Result:
// {
//   id: 1,
//   title: 'Intro to Prisma',
//   content: '...',
//   author: {
//     id: 1,
//     name: 'John Doe'
//   },
//   tags: [
//     {
//       postId: 1,
//       tagId: 1,
//       assignedAt: '2024-01-01T10:00:00Z',
//       tag: {
//         id: 1,
//         name: 'Prisma',
//         slug: 'prisma'
//       }
//     },
//     {
//       postId: 1,
//       tagId: 2,
//       assignedAt: '2024-01-01T10:00:00Z',
//       tag: {
//         id: 2,
//         name: 'NestJS',
//         slug: 'nestjs'
//       }
//     }
//   ]
// }
```

**Get All Posts by Tag:**

```typescript
async findPostsByTag(tagSlug: string) {
  return this.prisma.post.findMany({
    where: {
      tags: {
        some: {
          tag: {
            slug: tagSlug
          }
        }
      }
    },
    include: {
      author: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });
}
```

**Remove Tag from Post:**

```typescript
async removeTagFromPost(postId: number, tagId: number) {
  await this.prisma.tagsOnPosts.delete({
    where: {
      postId_tagId: {
        postId,
        tagId,
      }
    }
  });
  
  return { message: 'Tag removed from post' };
}
```

---

## 🔍 Relation Queries

### Include vs Select

**`include`:** Add related data

```typescript
// Include: Get user + add posts
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true  // ← Add posts
  }
});

// Result: All user fields + posts
// {
//   id: 1,
//   email: '...',
//   name: '...',
//   password: '...',  ← Still included
//   posts: [...]
// }
```

**`select`:** Choose specific fields

```typescript
// Select: Choose fields explicitly
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    email: true,
    // password excluded!
    posts: true  // ← Include posts
  }
});

// Result: Only selected fields
// {
//   id: 1,
//   email: '...',
//   name: '...',
//   posts: [...]
// }
```

**⚠️ Cannot use `include` and `select` together!**

### Nested Include

```typescript
// Get post with author and author's profile
const post = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    author: {
      include: {
        profile: true  // ← Nested include
      }
    },
    tags: {
      include: {
        tag: true
      }
    }
  }
});

// Result:
// {
//   id: 1,
//   title: '...',
//   author: {
//     id: 1,
//     name: 'John',
//     profile: {
//       bio: '...',
//       avatar: '...'
//     }
//   },
//   tags: [...]
// }
```

### Filtered Relations

```typescript
// Get user with only published posts
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: {
        published: true  // ← Filter
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5  // ← Limit
    }
  }
});
```

### Relation Filters

```typescript
// Find users who have at least 1 published post
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {  // ← At least one
        published: true
      }
    }
  }
});

// Find users who have no posts
const usersWithoutPosts = await prisma.user.findMany({
  where: {
    posts: {
      none: {}  // ← Zero posts
    }
  }
});

// Find users where all posts are published
const usersAllPublished = await prisma.user.findMany({
  where: {
    posts: {
      every: {  // ← All must match
        published: true
      }
    }
  }
});
```

### Count Relations

```typescript
// Get users with post count
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: {
        posts: true
      }
    }
  }
});

// Result:
// [
//   {
//     id: 1,
//     name: 'John',
//     _count: { posts: 5 }
//   },
//   {
//     id: 2,
//     name: 'Jane',
//     _count: { posts: 3 }
//   }
// ]
```

---

## ✍️ Nested Writes

### Create with Relations

**Create User + Profile:**

```typescript
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
    password: 'hashed_password',
    profile: {
      create: {  // ← Nested create
        bio: 'Software developer',
        avatar: 'https://...',
        website: 'https://johndoe.com'
      }
    }
  },
  include: {
    profile: true
  }
});
```

**Create Post + Tags:**

```typescript
const post = await prisma.post.create({
  data: {
    title: 'Intro to Prisma',
    content: 'Prisma is...',
    author: {
      connect: { id: 1 }  // ← Connect to existing user
    },
    tags: {
      create: [
        {
          tag: {
            connectOrCreate: {  // ← Connect if exists, create if not
              where: { slug: 'prisma' },
              create: {
                name: 'Prisma',
                slug: 'prisma'
              }
            }
          }
        },
        {
          tag: {
            connectOrCreate: {
              where: { slug: 'nestjs' },
              create: {
                name: 'NestJS',
                slug: 'nestjs'
              }
            }
          }
        }
      ]
    }
  },
  include: {
    author: true,
    tags: {
      include: {
        tag: true
      }
    }
  }
});
```

### Update with Relations

**Update Post + Add Tags:**

```typescript
const post = await prisma.post.update({
  where: { id: 1 },
  data: {
    title: 'Updated Title',
    tags: {
      create: [
        {
          tag: {
            connect: { id: 3 }
          }
        }
      ]
    }
  },
  include: {
    tags: {
      include: {
        tag: true
      }
    }
  }
});
```

### Delete with Relations

**Delete will cascade (if configured):**

```typescript
// Delete user → also deletes profile (if onDelete: Cascade)
await prisma.user.delete({
  where: { id: 1 }
});

// Delete post → also deletes tags_on_posts entries
await prisma.post.delete({
  where: { id: 1 }
});
```

---

## 🔄 Cascade Operations

### onDelete Options

```prisma
model Post {
  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  //                                                           ↑
  //                                                What happens when user deleted?
}
```

**Options:**

```
1. Cascade
   └─ Delete post when user deleted

2. Restrict (default)
   └─ Prevent user deletion if has posts

3. NoAction
   └─ Database handles it (usually same as Restrict)

4. SetNull
   └─ Set authorId to NULL when user deleted
   
5. SetDefault
   └─ Set authorId to default value when user deleted
```

### Example with Different Options

```prisma
model Profile {
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  // ← Delete profile when user deleted
}

model Post {
  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Restrict)
  // ← PREVENT user deletion if has posts (must delete posts first)
}

model Comment {
  authorId Int?
  author   User? @relation(fields: [authorId], references: [id], onDelete: SetNull)
  // ← Set authorId to NULL when user deleted (keep comment, mark as deleted user)
}
```

### Best Practices

```
✅ Cascade for dependent data:
   User → Profile (delete profile when user deleted)
   Post → Comments (delete comments when post deleted)
   
✅ Restrict for important data:
   User → Posts (prevent accidental user deletion)
   
✅ SetNull for audit trail:
   User → Comments (keep comments but mark user as deleted)
```

---

## 🎯 Best Practices

### 1. Always Index Foreign Keys

✅ **Good:**
```prisma
model Post {
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
  
  @@index([authorId])  // ← Index for fast lookups
}
```

### 2. Use Select to Exclude Sensitive Data

✅ **Good:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    email: true,
    // password excluded!
  }
});
```

❌ **Bad:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 }
  // Returns ALL fields including password!
});
```

### 3. Use Explicit M:N for Extra Fields

✅ **Good:**
```prisma
model TagsOnPosts {
  postId     Int
  tagId      Int
  assignedAt DateTime @default(now())  // ← Extra field
  assignedBy Int?
  
  @@id([postId, tagId])
}
```

### 4. Be Careful with Cascade

```prisma
// ⚠️ Think twice before using Cascade
model User {
  posts Post[]
}

model Post {
  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  // Deleting user will delete ALL their posts!
  // Is this what you want?
}

// ✅ Maybe Restrict is better:
model Post {
  author User @relation(fields: [authorId], references: [id], onDelete: Restrict)
  // Prevent accidental data loss
}
```

### 5. Optimize Nested Queries

❌ **Bad (N+1 problem):**
```typescript
const users = await prisma.user.findMany();

for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { authorId: user.id }
  });
  // N queries for posts!
}
```

✅ **Good (1 query with include):**
```typescript
const users = await prisma.user.findMany({
  include: {
    posts: true
  }
});
// 1 query, includes all posts!
```

### 6. Use Pagination for Large Datasets

```typescript
async findAll(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  
  const [posts, total] = await Promise.all([
    this.prisma.post.findMany({
      skip,
      take: limit,
      include: {
        author: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    this.prisma.post.count()
  ]);
  
  return {
    data: posts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

---

## 📚 Kesimpulan

### Yang Sudah Dipelajari

✅ **JOIN explained** - Menggabungkan data dari multiple tables  
✅ **One-to-One** - User ↔ Profile  
✅ **One-to-Many** - User → Posts  
✅ **Many-to-Many** - Posts ↔ Tags  
✅ **Relation queries** - include, select, filters  
✅ **Nested writes** - Create/update with relations  
✅ **Cascade operations** - onDelete behaviors  
✅ **Best practices** - Indexing, optimization  

### Relationship Types Summary

```
┌─────────────────────────────────────────────────────────┐
│                 RELATIONSHIP SUMMARY                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  One-to-One (1:1)                                       │
│  ├─ Foreign key with @unique                            │
│  ├─ Example: User ↔ Profile                             │
│  └─ userId Int @unique                                  │
│                                                         │
│  One-to-Many (1:N)                                      │
│  ├─ Foreign key without @unique                         │
│  ├─ Example: User → Posts                               │
│  └─ authorId Int (+ @@index)                            │
│                                                         │
│  Many-to-Many (M:N)                                     │
│  ├─ Join table with composite primary key              │
│  ├─ Example: Posts ↔ Tags                               │
│  └─ @@id([postId, tagId])                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Query Patterns

```typescript
// 1. Simple include
{ include: { author: true } }

// 2. Nested include
{ include: { author: { include: { profile: true } } } }

// 3. Select specific fields
{ select: { id: true, name: true, posts: true } }

// 4. Filter relations
{ include: { posts: { where: { published: true } } } }

// 5. Count relations
{ include: { _count: { select: { posts: true } } } }

// 6. Relation filters
{ where: { posts: { some: { published: true } } } }
```

---

**🎉 Selamat! Anda sudah menguasai Database Relations dengan Prisma!**

**📖 Next:** Material 3 - Authentication dengan JWT, Passport.js, dan Guards
