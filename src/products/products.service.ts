
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { response } from 'src/utils/response.util';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    if (createProductDto.name === '' || createProductDto.price < 0 || createProductDto.stock < 0) {
      throw new BadRequestException(
        response(false, 'Please fill your fields correctly', null),
      );
    }

    const alreadyExistProduct = await this.productsRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (alreadyExistProduct) {
      throw new ConflictException(
        response(false, 'Product already in database', null),
      );
    }

    const category = await this.categoriesRepository.findOne({ where: { id: createProductDto.categoryId } });
    if (!category) {
        throw new NotFoundException(response(false, 'Category not found', null));
    }

    const product = new Product();
    Object.assign(product, createProductDto);
    const result = await this.productsRepository.save(product);

    return response(true, 'Data created!', result);
  }

  async findAll() {
    const result = await this.productsRepository.find({
      relations:{
        category: true,
      }
    });
    return response(true, 'Data fetched!', result);
  }

  async findOne(id: number) {
    const result = await this.productsRepository.findOne({
      where: { id },
      relations:{
        category: true,
      }
    });

    if (!result) {
      throw new NotFoundException(response(false, 'Data not found!', null));
    }

    return response(true, 'Data fetched', result);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.name === '' || (updateProductDto.price && updateProductDto.price < 0) || (updateProductDto.stock && updateProductDto.stock < 0)) {
      throw new BadRequestException(
        response(false, 'Please fill your fields correctly', null),
      );
    }

    const product = await this.productsRepository.findOne({
      where: { id },
      relations:{
        category: true,
      }
    });

    if (!product) {
      throw new NotFoundException(
        response(false, 'Product is not found!', null),
      );
    }

    Object.assign(product, updateProductDto);

    const result = await this.productsRepository.save(product);
    return response(true, 'Product updated!', result);
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(
        response(false, 'Product is not found!', null),
      );
    }

    const result = await this.productsRepository.remove(product);
    return response(true, 'Data deleted!', result);
  }
}
