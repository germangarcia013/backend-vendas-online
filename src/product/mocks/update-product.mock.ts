import { categoryMock } from '../../category/mocks/category.mock';
import { UpdateProductDTO } from '../dtos/update-product.dto';

export const updateProductMock: UpdateProductDTO = {
  categoryId: categoryMock.id,
  image: 'kjbndabk',
  name: 'gdsaga',
  price: 43.0,
  descricao: 'dsadadad'
};
