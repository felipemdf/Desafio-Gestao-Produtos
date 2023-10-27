import { ProdutoLoja } from './produtoLoja.model';

export interface Produto {
  id: number;
  descricao: string;
  custo?: number;
  imagem?: string;

  produtoLojas: ProdutoLoja[];
}
