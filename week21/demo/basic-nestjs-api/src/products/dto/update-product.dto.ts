/**
 * Update Product DTO
 * 
 * DTO for updating existing product
 * All fields are optional since user may only want to update some fields
 * 
 * This is used in PUT /products/:id endpoint
 */
export class UpdateProductDto {
  /**
   * Product name (optional)
   */
  name?: string;

  /**
   * Product price (optional)
   */
  price?: number;

  /**
   * Product category (optional)
   */
  category?: string;

  /**
   * Stock quantity (optional)
   */
  stock?: number;

  /**
   * Product description (optional)
   */
  description?: string;
}

/**
 * Alternative approach using PartialType (will learn later):
 * 
 * import { PartialType } from '@nestjs/mapped-types';
 * import { CreateProductDto } from './create-product.dto';
 * 
 * export class UpdateProductDto extends PartialType(CreateProductDto) {}
 * 
 * This automatically makes all fields from CreateProductDto optional
 */
