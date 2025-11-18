import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/**
 * Products Controller
 * Handles all HTTP requests related to products
 * 
 * @Controller('products') - sets base route to /products
 * All endpoints in this controller start with /products
 */
@Controller('products')
export class ProductsController {
  /**
   * Constructor - Dependency Injection
   * Inject ProductsService to use in controller methods
   */
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /products
   * Get all products
   * 
   * @returns Array of all products
   */
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  /**
   * GET /products/:id
   * Get single product by ID
   * 
   * @Param('id') - extracts 'id' parameter from route
   * Example: GET /products/1 -> id = '1'
   * 
   * @param id - Product ID from URL
   * @returns Single product object
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * POST /products
   * Create new product
   * 
   * @Body() - extracts request body and validates against DTO
   * @HttpCode(201) - sets response status code to 201 Created
   * 
   * Example request body:
   * {
   *   "name": "Laptop",
   *   "price": 15000000,
   *   "category": "Electronics",
   *   "stock": 10
   * }
   * 
   * @param createProductDto - Product data from request body
   * @returns Newly created product
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // 201 status code
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * PUT /products/:id
   * Update existing product
   * 
   * Combines @Param and @Body decorators
   * 
   * Example: PUT /products/1
   * Body: { "price": 16000000 }
   * 
   * @param id - Product ID from URL
   * @param updateProductDto - Updated data from request body
   * @returns Updated product
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * DELETE /products/:id
   * Delete product by ID
   * 
   * @HttpCode(204) - sets response status to 204 No Content
   * 
   * @param id - Product ID to delete
   * @returns Success message
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 status code
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
