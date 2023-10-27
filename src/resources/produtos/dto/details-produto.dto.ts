import { Produto } from '../entities/produto.entity';
import { DetailsProdutoLojaDto } from './details-produtoLoja.dto';

export class DetailsProdutoDto {
  id: number;
  descricao: string;
  custo?: number;
  imagem?: string;
  produtoLojas: DetailsProdutoLojaDto[] = [];

  static produtoToDetailsProdutoDto(produto: Produto): DetailsProdutoDto {
    const dto = new DetailsProdutoDto();

    dto.id = produto.id;
    dto.descricao = produto.descricao;
    dto.custo = produto.custo;
    dto.imagem = produto.imagem
      ? DetailsProdutoDto.convertBufferToDataUrl(produto.imagem)
      : null;

    return dto;
  }

  private static convertBufferToDataUrl(base64: Buffer): string {
    return `data:image/png;base64,${base64.toString('base64')}`;
  }
}
