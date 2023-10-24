import { Produto } from '../produto.entity';

export class ProdutoDto {
  id: number;
  descricao: string;
  custo?: number;
  imagem?: Buffer;

  static produtoToProdutoDto(produtos: Produto[]): ProdutoDto[] {
    const produtosDto: ProdutoDto[] = [];

    for (const produto of produtos) {
      const produtoDto: ProdutoDto = new ProdutoDto();

      produtoDto.id = produto.id;
      produtoDto.descricao = produto.descricao;
      produtoDto.custo = produto.custo;
      produtoDto.imagem = produto.imagem;

      produtosDto.push(produtoDto);
    }

    return produtosDto;
  }
}
