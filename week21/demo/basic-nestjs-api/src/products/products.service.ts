import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/**
 * Product interface
 * Defines the structure of a product object
 */
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

/**
 * Products Service
 * Contains business logic for products operations
 * 
 * @Injectable() - marks this class as a provider
 * Can be injected into controllers or other services
 */
@Injectable()
export class ProductsService {
  /**
   * In-memory storage for products
   * In real application, this would be database
   * Data will be lost when server restarts
   */
  private products: Product[] = [
    {
      id: '1',
      name: 'Laptop',
      price: 15000000,
      category: 'Electronics',
      stock: 10,
    },
    {
      id: '2',
      name: 'Mouse',
      price: 150000,
      category: 'Electronics',
      stock: 50,
    },
    {
      id: '3',
      name: 'Keyboard',
      price: 500000,
      category: 'Electronics',
      stock: 30,
    },
    {
      id: '4',
      name: 'Monitor',
      price: 2500000,
      category: 'Electronics',
      stock: 15,
    },
    {
      id: '5',
      name: 'Book - Clean Code',
      price: 250000,
      category: 'Books',
      stock: 20,
    },
  ];

  /**
   * Get all products
   * 
   * @returns Array of all products
   */
  findAll(): Product[] {
    return this.products;
  }

  /**
   * Find product by ID
   * 
   * Uses Array.find() to search for product
   * Returns undefined if not found (no error handling yet)
   * 
   * @param id - Product ID to search for
   * @returns Product object or undefined
   */
  findOne(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  /**
   * Create new product
   * 
   * Steps:
   * 1. Generate new ID (using timestamp)
   * 2. Combine ID with product data from DTO
   * 3. Add to products array
   * 4. Return newly created product
   * 
   * @param createProductDto - Product data from request
   * @returns Newly created product
   */
  create(createProductDto: CreateProductDto): Product {
    // Generate unique ID using timestamp
    const newProduct: Product = {
      id: Date.now().toString(),
      ...createProductDto, // Spread operator to copy all properties
    };

    // Add to array
    this.products.push(newProduct);

    return newProduct;
  }

  /**
   * Update existing product
   * 
   * Steps:
   * 1. Find product index in array
   * 2. If found, merge existing data with update data
   * 3. Return updated product
   * 4. Return undefined if not found
   * 
   * @param id - Product ID to update
   * @param updateProductDto - Update data
   * @returns Updated product or undefined
   */
  update(id: string, updateProductDto: UpdateProductDto): Product | undefined {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      return undefined; // Product not found
    }

    // Merge existing product with update data
    this.products[index] = {
      ...this.products[index],  // Existing data
      ...updateProductDto,      // New data (overwrites existing)
    };

    return this.products[index];
  }

  /**
   * Delete product by ID
   * 
   * Uses Array.splice() to remove element
   * Returns object with message
   * 
   * @param id - Product ID to delete
   * @returns Success message object
   */
  remove(id: string): { message: string } {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      return { message: 'Product not found' };
    }

    // Remove product from array
    this.products.splice(index, 1);

    return { message: 'Product deleted successfully' };
  }

  /**
   * Additional method: Get products count
   * Helper method to get total number of products
   * 
   * @returns Number of products
   */
  getCount(): number {
    return this.products.length;
  }

  /**
   * Additional method: Filter by category
   * Example of adding more functionality
   * 
   * @param category - Category to filter by
   * @returns Filtered products array
   */
  findByCategory(category: string): Product[] {
    return this.products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  }
}
