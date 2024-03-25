import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDTO {
  @IsNumber()
  categoryId: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsString()
  descricao: string;
}
