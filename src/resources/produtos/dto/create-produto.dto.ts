import {
  IsNotEmpty,
  Length,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Produto } from '../entities/produto.entity';
import { ProdutoLojaDto } from './produtoLoja.dto';

export class CreateProdutoDto {
  @IsNotEmpty({ message: 'Descrição deve ser preenchida' })
  @Length(3, 60, {
    message: 'O campo descrição precisa ter entre 3 e 60 caracteres',
  })
  descricao: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'O campo custo deve ser um número decimal com duas casas decimais',
    },
  )
  custo?: number;

  @IsOptional()
  imagem?: Buffer;

  @IsArray({ message: 'O campo produtoLojas deve ser uma lista' })
  @ArrayNotEmpty({ message: 'O campo produtoLojas não deve estar vazio' })
  @ValidateNested({ each: true })
  @Type(() => ProdutoLojaDto)
  produtoLojas: ProdutoLojaDto[];

  static createProdutoDtoToProduto(dto: CreateProdutoDto): Produto {
    const produto: Produto = new Produto();

    produto.descricao = dto.descricao;
    produto.custo = dto.custo;
    produto.imagem = dto.imagem;

    return produto;
  }
}
