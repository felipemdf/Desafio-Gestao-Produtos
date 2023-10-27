import { ProdutoLoja } from '../entities/produtoLoja.entity';

export class DetailsProdutoLojaDto {
  idLoja: number;
  descricao: string;
  precoVenda: number;

  static produtoLojasToDetailsProdutoLojaDto(
    produtoLojas: ProdutoLoja[],
  ): DetailsProdutoLojaDto[] {
    const dtos: DetailsProdutoLojaDto[] = [];

    for (const produtoLoja of produtoLojas) {
      const dto = new DetailsProdutoLojaDto();

      dto.idLoja = produtoLoja.loja.id;
      dto.precoVenda = produtoLoja.precoVenda;
      dto.descricao = `${produtoLoja.loja.id}-${produtoLoja.loja.descricao}`;

      dtos.push(dto);
    }

    return dtos;
  }
}
