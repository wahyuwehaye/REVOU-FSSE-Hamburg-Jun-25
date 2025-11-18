# Week 21 Assignments

## Assignment 1: Blog API (Basic)

### Description
Create a simple Blog API with posts management.

### Requirements
- ✅ Create Posts module with CRUD operations
- ✅ Post structure: id, title, content, author, createdAt
- ✅ In-memory storage
- ✅ Basic validation
- ✅ Error handling

### Endpoints
```
GET    /posts           - Get all posts
GET    /posts/:id       - Get single post
POST   /posts           - Create post
PUT    /posts/:id       - Update post
DELETE /posts/:id       - Delete post
```

### Acceptance Criteria
- [ ] All CRUD operations working
- [ ] Proper HTTP status codes
- [ ] Basic validation (title required, min 5 chars)
- [ ] 404 error when post not found
- [ ] Clean code structure

### Submission
- Source code in GitHub
- README with API documentation
- Postman collection
- Demo video (optional)

---

## Assignment 2: E-commerce API (Intermediate)

### Description
Build a simple E-commerce API with products, categories, and cart.

### Requirements
- ✅ Products module (CRUD)
- ✅ Categories module (CRUD)
- ✅ Cart module (add/remove items)
- ✅ Relationship: products belong to categories
- ✅ Input validation with class-validator
- ✅ Error handling
- ✅ Query parameters (filter, sort, search)

### Product Structure
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl?: string;
}
```

### Category Structure
```typescript
{
  id: string;
  name: string;
  description: string;
}
```

### Cart Item Structure
```typescript
{
  id: string;
  productId: string;
  quantity: number;
  price: number;
}
```

### Endpoints

#### Products
```
GET    /products                  - Get all products (with filters)
GET    /products/:id              - Get single product
POST   /products                  - Create product
PUT    /products/:id              - Update product
DELETE /products/:id              - Delete product
GET    /products?category=:id     - Filter by category
GET    /products?search=:keyword  - Search products
```

#### Categories
```
GET    /categories                - Get all categories
GET    /categories/:id            - Get single category
POST   /categories                - Create category
PUT    /categories/:id            - Update category
DELETE /categories/:id            - Delete category
GET    /categories/:id/products   - Get products in category
```

#### Cart
```
GET    /cart                      - Get cart items
POST   /cart                      - Add item to cart
PUT    /cart/:id                  - Update item quantity
DELETE /cart/:id                  - Remove item from cart
DELETE /cart                      - Clear cart
GET    /cart/total                - Get cart total price
```

### Validation Rules
**Product:**
- name: required, min 3 chars, max 100 chars
- price: required, positive number, min 0.01
- categoryId: required, valid category
- stock: required, integer, min 0

**Category:**
- name: required, min 3 chars, unique
- description: optional, max 500 chars

**Cart Item:**
- productId: required, valid product
- quantity: required, integer, min 1

### Acceptance Criteria
- [ ] All modules working correctly
- [ ] Proper validation on all inputs
- [ ] Products can be filtered by category
- [ ] Search functionality works
- [ ] Cart calculates total correctly
- [ ] Proper error messages
- [ ] Clean code structure
- [ ] Well-documented API

### Bonus Features
- [ ] Pagination on products list
- [ ] Sort products (price, name)
- [ ] Stock management (decrease on cart add)
- [ ] Discount/promo code support
- [ ] Product reviews

---

## Assignment 3: Task Management API (Advanced)

### Description
Build a complete Task Management API with projects, tasks, and tags.

### Requirements
- ✅ Projects module
- ✅ Tasks module
- ✅ Tags module
- ✅ Users module (basic)
- ✅ Complex relationships
- ✅ Advanced validation
- ✅ Custom exceptions
- ✅ Filtering, sorting, pagination
- ✅ Search functionality

### Data Models

**User:**
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}
```

**Project:**
```typescript
{
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

**Task:**
```typescript
{
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

**Tag:**
```typescript
{
  id: string;
  name: string;
  color: string;
}
```

### Complete Endpoint List

#### Users
```
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
GET    /users/:id/projects
GET    /users/:id/tasks
```

#### Projects
```
GET    /projects
GET    /projects/:id
POST   /projects
PUT    /projects/:id
DELETE /projects/:id
GET    /projects/:id/tasks
POST   /projects/:id/tasks
GET    /projects?status=active
GET    /projects?owner=:userId
```

#### Tasks
```
GET    /tasks
GET    /tasks/:id
POST   /tasks
PUT    /tasks/:id
PATCH  /tasks/:id/status
DELETE /tasks/:id
GET    /tasks?project=:id
GET    /tasks?assignedTo=:userId
GET    /tasks?status=todo
GET    /tasks?priority=high
GET    /tasks?tag=:tagName
GET    /tasks?search=:keyword
GET    /tasks?sort=priority&order=desc
GET    /tasks?page=1&limit=10
```

#### Tags
```
GET    /tags
GET    /tags/:id
POST   /tags
PUT    /tags/:id
DELETE /tags/:id
GET    /tags/:id/tasks
```

### Validation Rules

**User:**
- name: required, min 3 chars
- email: required, valid email, unique
- role: must be 'admin' or 'user'

**Project:**
- name: required, min 3 chars, max 100 chars
- ownerId: required, valid user
- status: must be valid enum value

**Task:**
- title: required, min 5 chars
- projectId: required, valid project
- assignedTo: optional, valid user
- status: must be valid enum value
- priority: must be valid enum value
- dueDate: optional, future date
- tags: array of strings

**Tag:**
- name: required, unique, min 2 chars
- color: required, valid hex color

### Advanced Features

1. **Filtering**
   - Multiple filters can be combined
   - Example: `/tasks?status=todo&priority=high&assignedTo=user1`

2. **Sorting**
   - Sort by any field
   - Example: `/tasks?sort=dueDate&order=asc`

3. **Pagination**
   - Page and limit parameters
   - Return metadata (total, pages)
   - Example: `/tasks?page=2&limit=20`

4. **Search**
   - Search across multiple fields
   - Example: `/tasks?search=important`

5. **Statistics**
   ```
   GET /projects/:id/stats
   Response: {
     totalTasks: 50,
     todoTasks: 20,
     inProgressTasks: 15,
     doneTasks: 15,
     overdueTasks: 5
   }
   ```

### Acceptance Criteria
- [ ] All modules implemented correctly
- [ ] All relationships working
- [ ] Comprehensive validation
- [ ] Custom exception handling
- [ ] All filtering options working
- [ ] Sorting functionality
- [ ] Pagination implemented
- [ ] Search functionality
- [ ] Statistics endpoints
- [ ] Clean, well-organized code
- [ ] Comprehensive API documentation
- [ ] Postman collection with all endpoints
- [ ] README with setup instructions

### Bonus Features
- [ ] Soft delete functionality
- [ ] Activity log (who did what when)
- [ ] Task comments
- [ ] File attachments (just URL)
- [ ] Task dependencies
- [ ] Recurring tasks
- [ ] Email notifications (just console.log)
- [ ] Export tasks to JSON/CSV

---

## Submission Guidelines

### What to Submit
1. **Source Code**
   - GitHub repository URL
   - Clean, well-organized code
   - Follow NestJS conventions

2. **Documentation**
   - README.md with:
     - Project description
     - Setup instructions
     - API endpoints documentation
     - Environment variables
     - How to run/test
   - Code comments where needed

3. **API Testing**
   - Postman collection (exported JSON)
   - Include example requests
   - Add tests/assertions

4. **Demo (Optional)**
   - Video walkthrough
   - Screenshots of Postman tests
   - Deployed version (optional)

### Evaluation Criteria

| Criteria | Points | Description |
|----------|--------|-------------|
| **Functionality** | 40% | All features working correctly |
| **Code Quality** | 25% | Clean, organized, follows best practices |
| **Validation** | 15% | Proper input validation |
| **Error Handling** | 10% | Appropriate error messages |
| **Documentation** | 10% | Clear README and API docs |

### Grading

**Assignment 1 (Basic):**
- 80-100: All requirements met with good code quality
- 60-79: Most requirements met, minor issues
- Below 60: Incomplete or significant issues

**Assignment 2 (Intermediate):**
- 85-100: All requirements + bonus features
- 70-84: All requirements met well
- 55-69: Most requirements met, some issues
- Below 55: Incomplete

**Assignment 3 (Advanced):**
- 90-100: Excellent implementation, bonus features
- 80-89: All requirements met excellently
- 70-79: All requirements met, minor issues
- 60-69: Most requirements met
- Below 60: Incomplete

### Tips for Success

1. **Start Early**: Don't wait until last minute
2. **Test Frequently**: Test each endpoint as you build
3. **Commit Often**: Version control is your friend
4. **Read Requirements Carefully**: Make sure you understand everything
5. **Ask Questions**: Don't hesitate to ask for clarification
6. **Follow Best Practices**: Use what you learned
7. **Document As You Go**: Don't leave documentation for last
8. **Handle Errors**: Always validate input and handle errors

### Deadline

Check with your instructor for specific deadline.

### Questions?

If you have questions:
1. Review the course materials
2. Check demo projects
3. Search NestJS documentation
4. Ask in class discussion
5. Contact instructor

---

**Good luck with your assignments!** 🚀

**Remember:** The goal is to learn, not just to complete. Take your time to understand each concept.
