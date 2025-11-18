/**
 * Create Product DTO (Data Transfer Object)
 * 
 * DTO defines the shape of data for creating a product
 * 
 * Purpose:
 * - Type safety: Define expected data structure
 * - Validation: Can add validators (next lesson)
 * - Documentation: Clear API contract
 * 
 * This is used in POST /products endpoint
 */
export class CreateProductDto {
  /**
   * Product name
   * Required field
   */
  name: string;

  /**
   * Product price in Indonesian Rupiah
   * Required field
   * Example: 15000000 for Rp 15,000,000
   */
  price: number;

  /**
   * Product category
   * Required field
   * Examples: "Electronics", "Books", "Clothing"
   */
  category: string;

  /**
   * Available stock quantity
   * Required field
   * Must be non-negative number
   */
  stock: number;

  /**
   * Optional: Product description
   * Not required, can be undefined
   */
  description?: string;
}
