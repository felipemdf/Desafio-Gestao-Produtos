import { Produto } from '../produto.entity';
import { DetailsProdutoLojaDto } from './details-produtoLoja.dto';

export class DetailsProdutoDto {
  id: number;
  descricao: string;
  custo?: number;
  imagem?: Buffer;
  produtoLojas: DetailsProdutoLojaDto[] = [];

  static produtoToDetailsProdutoDto(produto: Produto): DetailsProdutoDto {
    const dto = new DetailsProdutoDto();

    dto.id = produto.id;
    dto.descricao = produto.descricao;
    dto.custo = produto.custo;
    dto.imagem = produto.imagem;

    return dto;
  }
}
