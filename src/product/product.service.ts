import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import { DeleteResult, ILike, In, Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { CountProduct } from './dtos/count-product.dto';
import { Pagination, PaginationMeta } from '../dtos/pagination.dto';

const DEFAULT_PAGE_SIZE = 10;
const FIRST_PAGE = 1;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  async findAllPage(
    search?: string,
    size = DEFAULT_PAGE_SIZE,
    page = FIRST_PAGE,
  ): Promise<Pagination<ProductEntity[]>> {
    const skip = (page - 1) * size;
    let findOptions = {};
    if (search) {
      findOptions = {
        where: {
          name: ILike(`%${search}%`),
        },
      };
    }
    const [products, total] = await this.productRepository.findAndCount({
      ...findOptions,
      take: size,
      skip,
    });

    return new Pagination(
      new PaginationMeta(
        Number(size),
        total,
        Number(page),
        Math.ceil(total / size),
      ),
      products,
    );
  }

  async findAll(
    productId?: number[],
    isFindRelations?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: productId,
        },
      };
    }

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true,
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products) {
      throw new NotFoundException('Not found products');
    }

    return products;
  }

  async createProduct(createProduct: CreateProductDTO): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProduct.categoryId);

    return this.productRepository.save({
      ...createProduct,
      descricao: createProduct.descricao,
    });
  }

  async findProductById(
    productId: number,
    isRelations?: boolean,
  ): Promise<ProductEntity> {
    const relations = isRelations
      ? {
          category: true,
        }
      : undefined;

    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations,
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }

    return product;
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);

    return this.productRepository.delete({ id: productId });
  }

  async updateProduct(
    updateProduct: UpdateProductDTO,
    productId: number,
  ): Promise<ProductEntity> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }

  async countProdutsByCategoryId(): Promise<CountProduct[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as total')
      .groupBy('product.category_id')
      .getRawMany();
  }
}
