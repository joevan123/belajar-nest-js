import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { response } from 'src/utils/response.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}
  
  async create(createCategoryDto: CreateCategoryDto) {
    if (createCategoryDto.name === '') {
      throw new BadRequestException(
        response(false, 'Please fill your fields correctly', null),
      );
    }

    const alreadyExistCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (alreadyExistCategory) {
      throw new ConflictException(
        response(false, 'Category already in database', null),
      );
    }

    const category = new Category();
    Object.assign(category, createCategoryDto);
    const result = await this.categoriesRepository.save(category);

    return response(true, 'Data created!', result);
  }

  async findAll() {
    const result = await this.categoriesRepository.find({
      relations:{
        product: true,
      }
    });

    return response(true, 'Data fetched!', result);
  }

  async findOne(id: number) {
    const result = await this.categoriesRepository.findOne({
      where: { id },
      relations:{
        product: true,
      }
    });

    if (!result) {
      throw new NotFoundException(response(false, 'Data not found!', null));
    }

    return response(true, 'Data fetched', result);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.name === '') {
      throw new BadRequestException(
        response(false, 'Please fill your fields correctly', null),
      );
    }

    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(
        response(false, 'Category is not found!', null),
      );
    }

    category.name = updateCategoryDto.name;

    const result = await this.categoriesRepository.save(category);

    return response(true, 'Category updated!', result);
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(
        response(false, 'Category is not found!', null),
      );
    }

    const result = await this.categoriesRepository.remove(category);

    return response(true, 'Data deleted!', result);
  }
}