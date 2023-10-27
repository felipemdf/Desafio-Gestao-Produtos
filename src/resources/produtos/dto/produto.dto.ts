import { Produto } from '../entities/produto.entity';
import { ProdutoLojaDto } from './produtoLoja.dto';

export class ProdutoDto {
  id: number;
  descricao: string;
  custo?: number;
  produtoLojas: ProdutoLojaDto[] = [];

  static produtoToProdutoDto(produtos: Produto[]): ProdutoDto[] {
    const produtosDto: ProdutoDto[] = [];

    for (const produto of produtos) {
      const produtoDto: ProdutoDto = new ProdutoDto();

      produtoDto.id = produto.id;
      produtoDto.descricao = produto.descricao;
      produtoDto.custo = produto.custo;

      produtoDto.produtoLojas = ProdutoLojaDto.produtoLojaToProdutoLojaDto(
        produto.produtoLojas,
      );

      produtosDto.push(produtoDto);
    }

    return produtosDto;
  }
}
