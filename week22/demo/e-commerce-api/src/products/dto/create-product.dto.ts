import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  categoryId: number;

  @IsArray()
  @IsOptional()
  images?: string[];
}
