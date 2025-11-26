import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      relations: ['category'],
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { categoryId, isActive: true },
      relations: ['category'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async checkStock(id: number, quantity: number): Promise<boolean> {
    const product = await this.findOne(id);
    return product.stock >= quantity;
  }

  async reduceStock(id: number, quantity: number): Promise<void> {
    const product = await this.findOne(id);

    if (product.stock < quantity) {
      throw new BadRequestException(`Insufficient stock for product ${product.name}`);
    }

    product.stock -= quantity;
    await this.productsRepository.save(product);
  }
}
