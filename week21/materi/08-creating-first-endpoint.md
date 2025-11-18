# Creating Your First Endpoint

## Step-by-Step Guide

### Step 1: Create Project

```bash
nest new my-api
cd my-api
```

### Step 2: Test Default Endpoint

```bash
npm run start:dev
```

Visit `http://localhost:3000` - You should see "Hello World!"

### Step 3: Create Your First Custom Endpoint

Edit `src/app.controller.ts`:

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('welcome')
  getWelcome(): string {
    return 'Welcome to my API!';
  }

  @Get('about')
  getAbout() {
    return {
      name: 'My First API',
      version: '1.0.0',
      description: 'Learning NestJS',
    };
  }
}
```

### Step 4: Test Your Endpoints

```bash
# Visit in browser or use curl:
curl http://localhost:3000
curl http://localhost:3000/welcome
curl http://localhost:3000/about
```

### Step 5: Create Products Endpoint

```bash
nest g resource products --no-spec
```

Choose "REST API" and "Yes" for CRUD.

### Step 6: Add Sample Data

Edit `src/products/products.service.ts`:

```typescript
@Injectable()
export class ProductsService {
  private products = [
    { id: 1, name: 'Laptop', price: 15000000 },
    { id: 2, name: 'Mouse', price: 150000 },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products.find(p => p.id === id);
  }
}
```

### Step 7: Test Products Endpoint

```bash
curl http://localhost:3000/products
curl http://localhost:3000/products/1
```

### Step 8: Add POST Endpoint

Edit `src/products/products.controller.ts`:

```typescript
@Post()
create(@Body() createProductDto: CreateProductDto) {
  return this.productsService.create(createProductDto);
}
```

Edit `src/products/products.service.ts`:

```typescript
create(createProductDto: CreateProductDto) {
  const newProduct = {
    id: this.products.length + 1,
    ...createProductDto,
  };
  this.products.push(newProduct);
  return newProduct;
}
```

### Step 9: Test POST Request

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","price":500000}'
```

## Congratulations! 🎉

You've created your first NestJS API with GET and POST endpoints!

## Next Steps

- Add validation (see next chapter)
- Add error handling
- Test with Postman
