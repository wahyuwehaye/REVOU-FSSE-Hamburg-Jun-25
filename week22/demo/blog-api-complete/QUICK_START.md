# 🚀 Quick Start Guide - Blog API Complete

## ⚡ Fastest Way to Get Started (5 minutes)

### Step 1: Setup Database (1 min)
```bash
# Make sure PostgreSQL is running
# Create database
createdb blog_api_db
```

### Step 2: Install & Run (2 min)
```bash
cd blog-api-complete

# Install dependencies (if not done)
npm install

# Build project
./node_modules/.bin/nest build

# Run the application
node dist/main.js
```

**✅ Application running at: http://localhost:3000/api**

---

## 🧪 Test with cURL (2 minutes)

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123",
    "bio": "Test user bio"
  }'
```

**Save the `access_token` from response!**

### 2. Create a Category
```bash
# Replace YOUR_TOKEN with the token from step 1
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Technology",
    "description": "Tech articles and tutorials"
  }'
```

**Save the category `id`!**

### 3. Create Tags
```bash
# Create JavaScript tag
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "JavaScript"}'

# Create React tag
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "React"}'
```

**Save the tag `id`s!**

### 4. Create a Post
```bash
# Replace CATEGORY_ID and TAG_ID with IDs from steps 2 & 3
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Introduction to NestJS",
    "content": "NestJS is a progressive Node.js framework for building efficient and scalable server-side applications...",
    "excerpt": "Learn the basics of NestJS framework",
    "categoryId": "CATEGORY_ID",
    "tagIds": ["TAG_ID"],
    "status": "published"
  }'
```

**Save the post `id`!**

### 5. Create a Comment
```bash
# Replace POST_ID with ID from step 4
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": "Great article! Very informative.",
    "postId": "POST_ID"
  }'
```

### 6. View All Data
```bash
# Get all posts
curl http://localhost:3000/api/posts

# Get all users
curl http://localhost:3000/api/users

# Get all categories
curl http://localhost:3000/api/categories

# Get all tags
curl http://localhost:3000/api/tags

# Get comments for a post
curl http://localhost:3000/api/comments/post/POST_ID
```

---

## 🎯 Test with Postman (Recommended!)

### Import Collection
1. Open Postman
2. Click **Import** button
3. Select file: `postman/Blog-API-Complete.postman_collection.json`
4. Done! All endpoints ready to test

### Testing Flow in Postman
1. **Auth** → Register User
   - ✅ Token auto-saved
2. **Categories** → Create Category
   - ✅ Category ID auto-saved
3. **Tags** → Create Tag (JavaScript)
   - ✅ Tag ID auto-saved
4. **Tags** → Create Tag (React)
5. **Posts** → Create Post
   - ✅ Post ID auto-saved
6. **Comments** → Create Comment
7. Test all GET endpoints!

---

## 📊 What You'll See

After following the steps above, you'll have:

✅ **1 User** with authentication token  
✅ **1 Category** (Technology)  
✅ **2 Tags** (JavaScript, React)  
✅ **1 Post** with category and tags  
✅ **1 Comment** on the post  

All with proper relationships!

---

## 🎮 Interactive Testing

### Scenario 1: Blog Author Workflow
```bash
# 1. Register as author
POST /auth/register

# 2. Create categories
POST /categories (Technology, Lifestyle, etc.)

# 3. Create tags
POST /tags (JavaScript, React, Node.js, etc.)

# 4. Write posts
POST /posts (with category and multiple tags)

# 5. Check your stats
GET /users/{your_id}/stats
```

### Scenario 2: Reader Workflow
```bash
# 1. Browse published posts
GET /posts?status=published

# 2. Read a post by slug
GET /posts/slug/introduction-to-nestjs

# 3. View post with comments
GET /posts/{post_id}

# 4. Login to comment
POST /auth/login

# 5. Add comment
POST /comments
```

### Scenario 3: Admin Workflow
```bash
# 1. Login as admin
POST /auth/login

# 2. View all users
GET /users

# 3. Manage categories
GET /categories
POST /categories
PATCH /categories/{id}
DELETE /categories/{id}

# 4. Moderate comments
GET /comments
DELETE /comments/{id}
```

---

## 🔥 Advanced Testing

### Filter Posts by Status
```bash
# Draft posts only
curl "http://localhost:3000/api/posts?status=draft"

# Published posts only
curl "http://localhost:3000/api/posts?status=published"
```

### Filter Posts by Category
```bash
curl "http://localhost:3000/api/posts?categoryId=YOUR_CATEGORY_ID"
```

### Filter Posts by Tag
```bash
curl "http://localhost:3000/api/posts?tagId=YOUR_TAG_ID"
```

### Get Posts by Author
```bash
curl "http://localhost:3000/api/posts/author/YOUR_USER_ID"
```

### Get Post by Slug (increments view count)
```bash
curl "http://localhost:3000/api/posts/slug/your-post-slug"
```

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
psql --version

# Create database if not exists
createdb blog_api_db

# Check .env file has correct credentials
cat .env
```

### Application Won't Start
```bash
# Rebuild the project
rm -rf dist/
./node_modules/.bin/nest build

# Run again
node dist/main.js
```

### Port Already in Use
```bash
# Change PORT in .env file
echo "PORT=3001" >> .env

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Token Expired
```bash
# Just login again to get new token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

## 📝 Sample Data Script

Create a script `seed-data.sh`:

```bash
#!/bin/bash
BASE_URL="http://localhost:3000/api"

echo "1. Registering user..."
RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","username":"demouser","password":"demo123"}')

TOKEN=$(echo $RESPONSE | jq -r '.access_token')
echo "Token: $TOKEN"

echo "2. Creating category..."
CATEGORY=$(curl -s -X POST $BASE_URL/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Technology","description":"Tech articles"}')

CATEGORY_ID=$(echo $CATEGORY | jq -r '.id')
echo "Category ID: $CATEGORY_ID"

echo "3. Creating tags..."
TAG1=$(curl -s -X POST $BASE_URL/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"JavaScript"}')

TAG1_ID=$(echo $TAG1 | jq -r '.id')

TAG2=$(curl -s -X POST $BASE_URL/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"React"}')

TAG2_ID=$(echo $TAG2 | jq -r '.id')

echo "4. Creating post..."
POST=$(curl -s -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"title\":\"Getting Started with NestJS\",
    \"content\":\"Complete guide to NestJS framework...\",
    \"excerpt\":\"Learn NestJS basics\",
    \"categoryId\":\"$CATEGORY_ID\",
    \"tagIds\":[\"$TAG1_ID\",\"$TAG2_ID\"],
    \"status\":\"published\"
  }")

POST_ID=$(echo $POST | jq -r '.id')

echo "5. Creating comment..."
curl -s -X POST $BASE_URL/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"content\":\"Great article!\",\"postId\":\"$POST_ID\"}"

echo -e "\n✅ Sample data created successfully!"
echo "View posts: $BASE_URL/posts"
```

Run it:
```bash
chmod +x seed-data.sh
./seed-data.sh
```

---

## 🎓 Next Steps

After testing the API:

1. **Study the code structure** - Understand entities, services, controllers
2. **Read the relationships** - See how One-to-Many and Many-to-Many work
3. **Experiment with filters** - Try different query parameters
4. **Add new features** - Pagination, search, likes, etc.
5. **Deploy it** - Try deploying to Render, Railway, or Heroku

---

## 💡 Tips

- **Use Postman** for easier testing (collection included!)
- **Check terminal logs** to see SQL queries
- **Save your tokens** for authenticated requests
- **Test relationships** by checking nested data in responses
- **View count increases** when accessing posts by slug

---

**Enjoy testing! 🚀**

Any questions? Check the main README.md for full documentation.
