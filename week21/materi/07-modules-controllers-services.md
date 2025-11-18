# Modules, Controllers, and Services

## Modules

### Creating a Module

```bash
# Using NestJS CLI
nest generate module products
# or
nest g mo products
```

**Generated file:**
```typescript
// products/products.module.ts
import { Module } from '@nestjs/common';

@Module({})
export class ProductsModule {}
```

### Complete Module Example

```typescript
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [],                       // Other modules
  controllers: [ProductsController], // Controllers
  providers: [ProductsService],      // Services
  exports: [ProductsService],        // Export for other modules
})
export class ProductsModule {}
```

## Controllers

### Creating a Controller

```bash
# Using CLI
nest generate controller products
# or
nest g co products
```

### Basic Controller

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get()
  findAll() {
    return 'This returns all products';
  }
}
```

### Complete CRUD Controller

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.productsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
```

## Services

### Creating a Service

```bash
# Using CLI
nest generate service products
# or
nest g s products
```

### Complete CRUD Service

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private products = [
    { id: '1', name: 'Laptop', price: 15000000, category: 'Electronics' },
    { id: '2', name: 'Mouse', price: 150000, category: 'Electronics' },
    { id: '3', name: 'Book', price: 85000, category: 'Books' },
  ];

  findAll(category?: string) {
    if (category) {
      return this.products.filter((p) => p.category === category);
    }
    return this.products;
  }

  findOne(id: string) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto) {
    const newProduct = {
      id: Date.now().toString(),
      ...createProductDto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products[index] = {
      ...this.products[index],
      ...updateProductDto,
    };
    return this.products[index];
  }

  remove(id: string) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
  }
}
```

## DTOs

### Create DTO

```typescript
// dto/create-product.dto.ts
export class CreateProductDto {
  name: string;
  price: number;
  category: string;
  description?: string;
}
```

### Update DTO

```typescript
// dto/update-product.dto.ts
export class UpdateProductDto {
  name?: string;
  price?: number;
  category?: string;
  description?: string;
}
```

## Quick Generate Resource

```bash
# Generate complete CRUD resource
nest generate resource products

# CLI will ask:
# ? What transport layer do you use? REST API
# ? Would you like to generate CRUD entry points? Yes

# This creates:
# - products.module.ts
# - products.controller.ts
# - products.service.ts
# - dto/create-product.dto.ts
# - dto/update-product.dto.ts
# - entities/product.entity.ts
```

## Testing

```bash
# Start server
npm run start:dev

# Test endpoints with curl:
# GET all
curl http://localhost:3000/products

# GET one
curl http://localhost:3000/products/1

# POST
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","price":500000,"category":"Electronics"}'

# PUT
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":16000000}'

# DELETE
curl -X DELETE http://localhost:3000/products/1
```

## Next: Add Validation

See `09-dto-and-validation.md` for adding class-validator.
