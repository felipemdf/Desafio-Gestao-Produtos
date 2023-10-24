import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ProdutoLoja } from '../entities/produtoLoja.entity';

export class ProdutoLojaDto {
  @IsNotEmpty({ message: 'O campo idLoja deve ser preenchida' })
  @Type(() => Number)
  @IsInt({ message: 'O campo idLoja deve ser um inteiro' })
  idLoja: number;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'O campo precoVenda deve ser um numero decimal com duas casas decimais',
    },
  )
  precoVenda: number;

  static produtoLojaDtoToProdutoLoja(
    idProduto: number,
    dto: ProdutoLojaDto[],
  ): ProdutoLoja[] {
    const produtoLojas = dto.map((produtoLojaDto: ProdutoLojaDto) => {
      const produtoLoja: ProdutoLoja = new ProdutoLoja();

      produtoLoja.idProduto = idProduto;
      produtoLoja.idLoja = produtoLojaDto.idLoja;
      produtoLoja.precoVenda = produtoLojaDto.precoVenda;

      return produtoLoja;
    });

    return produtoLojas;
  }
}
