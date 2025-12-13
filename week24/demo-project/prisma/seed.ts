import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.postTag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@blog.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      profile: {
        create: {
          bio: 'System administrator with full access to all features.',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          website: 'https://admin.blog.com',
          location: 'Jakarta, Indonesia',
        },
      },
    },
  });

  const author1 = await prisma.user.create({
    data: {
      email: 'john@blog.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'AUTHOR',
      profile: {
        create: {
          bio: 'Tech enthusiast and full-stack developer. Love writing about JavaScript, TypeScript, and modern web development.',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
          website: 'https://johndoe.dev',
          location: 'Bandung, Indonesia',
        },
      },
    },
  });

  const author2 = await prisma.user.create({
    data: {
      email: 'jane@blog.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'AUTHOR',
      profile: {
        create: {
          bio: 'Backend engineer passionate about API design, security, and database optimization.',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
          website: 'https://janesmith.dev',
          location: 'Surabaya, Indonesia',
        },
      },
    },
  });

  const reader = await prisma.user.create({
    data: {
      email: 'reader@blog.com',
      name: 'Regular Reader',
      password: hashedPassword,
      role: 'READER',
      profile: {
        create: {
          bio: 'Learning web development and enjoying reading tech articles.',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reader',
          location: 'Yogyakarta, Indonesia',
        },
      },
    },
  });

  console.log('✅ Created users with profiles');

  // Create Categories
  const webDev = await prisma.category.create({
    data: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Articles about modern web development, frameworks, and best practices.',
    },
  });

  const backend = await prisma.category.create({
    data: {
      name: 'Backend',
      slug: 'backend',
      description: 'Server-side development, APIs, databases, and architecture.',
    },
  });

  const security = await prisma.category.create({
    data: {
      name: 'Security',
      slug: 'security',
      description: 'Web security, authentication, authorization, and best practices.',
    },
  });

  const database = await prisma.category.create({
    data: {
      name: 'Database',
      slug: 'database',
      description: 'Database design, ORM, queries, and optimization.',
    },
  });

  console.log('✅ Created categories');

  // Create Tags
  const nestjs = await prisma.tag.create({
    data: { name: 'NestJS', slug: 'nestjs' },
  });

  const prismaTag = await prisma.tag.create({
    data: { name: 'Prisma', slug: 'prisma' },
  });

  const typescript = await prisma.tag.create({
    data: { name: 'TypeScript', slug: 'typescript' },
  });

  const jwt = await prisma.tag.create({
    data: { name: 'JWT', slug: 'jwt' },
  });

  const postgresql = await prisma.tag.create({
    data: { name: 'PostgreSQL', slug: 'postgresql' },
  });

  const authentication = await prisma.tag.create({
    data: { name: 'Authentication', slug: 'authentication' },
  });

  const restApi = await prisma.tag.create({
    data: { name: 'REST API', slug: 'rest-api' },
  });

  console.log('✅ Created tags');

  // Create Posts with Tags
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with NestJS and Prisma',
      slug: 'getting-started-nestjs-prisma',
      content: `# Introduction to NestJS and Prisma

NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. Combined with Prisma, a next-generation ORM, you get type-safety and excellent developer experience.

## Why Choose NestJS?

1. **TypeScript Support** - Built with TypeScript from the ground up
2. **Modular Architecture** - Organize code into modules
3. **Dependency Injection** - Powerful IoC container
4. **Extensive Ecosystem** - Integrations with many libraries

## Why Choose Prisma?

1. **Type Safety** - Auto-generated TypeScript types
2. **Intuitive API** - Easy to read and write queries
3. **Migration System** - Version control for database schema
4. **Prisma Studio** - GUI for database management

## Getting Started

First, install the required packages:

\`\`\`bash
npm install @nestjs/core @nestjs/common prisma @prisma/client
\`\`\`

Then initialize Prisma:

\`\`\`bash
npx prisma init
\`\`\`

This will create a \`prisma\` directory with a schema file. You can define your models here.

## Conclusion

NestJS and Prisma are excellent choices for building modern, type-safe backend applications. Stay tuned for more tutorials!`,
      excerpt: 'Learn how to start building type-safe APIs with NestJS and Prisma ORM.',
      published: true,
      viewCount: 150,
      authorId: author1.id,
      categoryId: webDev.id,
      tags: {
        create: [
          { tagId: nestjs.id },
          { tagId: prismaTag.id },
          { tagId: typescript.id },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Building Secure REST APIs with JWT Authentication',
      slug: 'secure-rest-api-jwt-authentication',
      content: `# Building Secure REST APIs

Security is paramount when building REST APIs. In this guide, we'll implement JWT authentication from scratch.

## What is JWT?

JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties.

### JWT Structure

A JWT consists of three parts:
1. **Header** - Token type and hashing algorithm
2. **Payload** - Claims (user data)
3. **Signature** - Verification signature

## Implementation Steps

### 1. Install Dependencies

\`\`\`bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
\`\`\`

### 2. Create Auth Module

Generate the auth module:

\`\`\`bash
nest g module auth
nest g service auth
nest g controller auth
\`\`\`

### 3. Hash Passwords

Always hash passwords before storing:

\`\`\`typescript
import * as bcrypt from 'bcrypt';

async hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
\`\`\`

### 4. Generate JWT Tokens

Create tokens after successful login:

\`\`\`typescript
async login(user: User) {
  const payload = { sub: user.id, email: user.email };
  return {
    access_token: this.jwtService.sign(payload),
  };
}
\`\`\`

## Best Practices

1. Use strong secrets (at least 256 bits)
2. Set short expiration times (15 minutes for access tokens)
3. Implement refresh tokens for long sessions
4. Store tokens securely on the client side

## Conclusion

JWT authentication provides a stateless, scalable solution for securing your REST APIs.`,
      excerpt: 'A comprehensive guide to implementing JWT authentication in your REST API.',
      published: true,
      viewCount: 230,
      authorId: author1.id,
      categoryId: security.id,
      tags: {
        create: [
          { tagId: jwt.id },
          { tagId: authentication.id },
          { tagId: restApi.id },
          { tagId: nestjs.id },
        ],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Database Relations Explained: One-to-One, One-to-Many, Many-to-Many',
      slug: 'database-relations-explained',
      content: `# Understanding Database Relations

Database relationships are fundamental to relational database design. Let's explore the three main types.

## One-to-One (1:1)

A one-to-one relationship means one record in Table A relates to exactly one record in Table B.

**Example:** User ↔ Profile

\`\`\`prisma
model User {
  id      Int      @id
  profile Profile?
}

model Profile {
  id     Int  @id
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id])
}
\`\`\`

## One-to-Many (1:N)

One record in Table A can relate to many records in Table B.

**Example:** User → Posts

\`\`\`prisma
model User {
  id    Int    @id
  posts Post[]
}

model Post {
  id       Int  @id
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
\`\`\`

## Many-to-Many (M:N)

Multiple records in Table A can relate to multiple records in Table B.

**Example:** Posts ↔ Tags

\`\`\`prisma
model Post {
  id   Int       @id
  tags PostTag[]
}

model Tag {
  id    Int       @id
  posts PostTag[]
}

model PostTag {
  postId Int
  tagId  Int
  post   Post @relation(fields: [postId], references: [id])
  tag    Tag  @relation(fields: [tagId], references: [id])
  @@id([postId, tagId])
}
\`\`\`

## What is a JOIN?

A JOIN combines rows from two or more tables based on a related column. Instead of making multiple queries, JOIN retrieves related data in a single query.

### Without JOIN (2 queries):
\`\`\`sql
SELECT * FROM users WHERE id = 1;
SELECT * FROM posts WHERE author_id = 1;
\`\`\`

### With JOIN (1 query):
\`\`\`sql
SELECT users.*, posts.* 
FROM users 
LEFT JOIN posts ON users.id = posts.author_id 
WHERE users.id = 1;
\`\`\`

## Prisma Relations

Prisma abstracts JOINs with the \`include\` and \`select\` options:

\`\`\`typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,
    profile: true,
  },
});
\`\`\`

## Conclusion

Understanding database relations is crucial for designing efficient, normalized databases.`,
      excerpt: 'A deep dive into database relationships and how to implement them with Prisma.',
      published: true,
      viewCount: 180,
      authorId: author2.id,
      categoryId: database.id,
      tags: {
        create: [
          { tagId: prismaTag.id },
          { tagId: postgresql.id },
        ],
      },
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Implementing RBAC: Role-Based Access Control in NestJS',
      slug: 'implementing-rbac-nestjs',
      content: `# Role-Based Access Control (RBAC)

RBAC is a method of restricting system access based on user roles. Let's implement it in NestJS.

## Defining Roles

First, define your roles:

\`\`\`typescript
export enum Role {
  ADMIN = 'admin',
  AUTHOR = 'author',
  READER = 'reader',
}
\`\`\`

## Creating the Roles Decorator

Create a custom decorator:

\`\`\`typescript
import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
\`\`\`

## Creating the Roles Guard

Implement the guard logic:

\`\`\`typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
\`\`\`

## Using RBAC in Controllers

Apply guards to routes:

\`\`\`typescript
@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  @Get()
  @Roles(Role.ADMIN, Role.AUTHOR, Role.READER)
  findAll() {
    return this.postsService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN, Role.AUTHOR)
  create(@Body() createDto: CreatePostDto) {
    return this.postsService.create(createDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
\`\`\`

## Best Practices

1. Keep role definitions centralized
2. Use guards consistently
3. Test authorization logic thoroughly
4. Log authorization failures

## Conclusion

RBAC provides a flexible, maintainable approach to managing user permissions in your application.`,
      excerpt: 'Learn how to implement role-based access control to secure your NestJS application.',
      published: true,
      viewCount: 95,
      authorId: author2.id,
      categoryId: security.id,
      tags: {
        create: [
          { tagId: nestjs.id },
          { tagId: typescript.id },
          { tagId: authentication.id },
        ],
      },
    },
  });

  const post5 = await prisma.post.create({
    data: {
      title: 'Advanced Prisma Queries: Filters, Sorting, and Pagination',
      slug: 'advanced-prisma-queries',
      content: `# Advanced Prisma Queries

Master advanced querying techniques with Prisma ORM.

## Filtering

Filter results with where clauses:

\`\`\`typescript
const posts = await prisma.post.findMany({
  where: {
    published: true,
    author: {
      email: {
        contains: '@blog.com',
      },
    },
  },
});
\`\`\`

## Sorting

Sort results with orderBy:

\`\`\`typescript
const posts = await prisma.post.findMany({
  orderBy: [
    { createdAt: 'desc' },
    { viewCount: 'desc' },
  ],
});
\`\`\`

## Pagination

Implement cursor-based pagination:

\`\`\`typescript
const posts = await prisma.post.findMany({
  skip: 10,
  take: 10,
  cursor: {
    id: lastPostId,
  },
});
\`\`\`

## Aggregations

Perform calculations:

\`\`\`typescript
const stats = await prisma.post.aggregate({
  _count: true,
  _avg: {
    viewCount: true,
  },
  _sum: {
    viewCount: true,
  },
});
\`\`\`

## Conclusion

Prisma's query API is powerful and type-safe, making complex queries easier to write and maintain.`,
      excerpt: 'Deep dive into Prisma advanced queries including filtering, sorting, and pagination.',
      published: true,
      viewCount: 67,
      authorId: author1.id,
      categoryId: database.id,
      tags: {
        create: [
          { tagId: prismaTag.id },
          { tagId: typescript.id },
        ],
      },
    },
  });

  // Draft post (not published)
  const post6 = await prisma.post.create({
    data: {
      title: 'Building Real-time Features with WebSockets',
      slug: 'realtime-websockets',
      content: 'Coming soon... This article will cover WebSocket implementation in NestJS.',
      excerpt: 'Learn how to add real-time features to your NestJS application.',
      published: false,
      viewCount: 0,
      authorId: author2.id,
      categoryId: webDev.id,
      tags: {
        create: [{ tagId: nestjs.id }, { tagId: typescript.id }],
      },
    },
  });

  console.log('✅ Created posts with tags');

  // Create Comments
  await prisma.comment.create({
    data: {
      content:
        'Great introduction! I was looking for a NestJS + Prisma tutorial. Very helpful!',
      postId: post1.id,
      authorId: reader.id,
    },
  });

  await prisma.comment.create({
    data: {
      content:
        'Thanks for this guide. The explanation of JWT structure is very clear.',
      postId: post2.id,
      authorId: author2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content:
        'I always struggle with database relations. This article finally made it click for me!',
      postId: post3.id,
      authorId: reader.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Excellent explanation of RBAC! Will implement this in my project.',
      postId: post4.id,
      authorId: author1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content:
        'The pagination examples are really useful. Saved me hours of reading docs!',
      postId: post5.id,
      authorId: reader.id,
    },
  });

  console.log('✅ Created comments');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 4 (1 admin, 2 authors, 1 reader)`);
  console.log(`   - Profiles: 4`);
  console.log(`   - Categories: 4`);
  console.log(`   - Tags: 7`);
  console.log(`   - Posts: 6 (5 published, 1 draft)`);
  console.log(`   - Comments: 5`);
  console.log('\n🔐 Test Credentials:');
  console.log(`   Admin:  admin@blog.com / password123`);
  console.log(`   Author: john@blog.com / password123`);
  console.log(`   Author: jane@blog.com / password123`);
  console.log(`   Reader: reader@blog.com / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
