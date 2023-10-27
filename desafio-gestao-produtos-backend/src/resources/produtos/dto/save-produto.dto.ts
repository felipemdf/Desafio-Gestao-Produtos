import {
  IsNotEmpty,
  Length,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Produto } from '../entities/produto.entity';
import { ProdutoLojaDto } from './produtoLoja.dto';

export class SaveProdutoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O campo id deve ser um inteiro' })
  id?: number;

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
  imagem?: string;

  @IsArray({ message: 'O campo produtoLojas deve ser uma lista' })
  @ArrayNotEmpty({ message: 'O campo produtoLojas não deve estar vazio' })
  @ValidateNested({ each: true })
  @Type(() => ProdutoLojaDto)
  produtoLojas: ProdutoLojaDto[];

  static saveProdutoDtoProduto(dto: SaveProdutoDto): Produto {
    const produto: Produto = new Produto();

    produto.id = dto.id;
    produto.descricao = dto.descricao;
    produto.custo = dto.custo;
    produto.imagem = dto.imagem
      ? Buffer.from(
          SaveProdutoDto.getBase64StringFromDataURL(dto.imagem),
          'base64',
        )
      : null;

    produto.produtoLojas = ProdutoLojaDto.produtoLojaDtoToProdutoLoja(
      dto.produtoLojas,
    );

    return produto;
  }

  private static getBase64StringFromDataURL(base64: string): string {
    return base64.split(',')[1];
  }
}
