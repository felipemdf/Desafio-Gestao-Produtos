import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProdutoLoja } from './entities/produtoLoja.entity';
import { Produto } from './entities/produto.entity';
import { FilterProdutoDto } from './entities/dto/filter-produto.dto';
import { ProdutoDto } from './entities/dto/produto.dto';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,

    @InjectRepository(ProdutoLoja)
    private produtoLojaRepository: Repository<ProdutoLoja>,
  ) {}

  async findAll(filtro: FilterProdutoDto): Promise<ProdutoDto[]> {
    const query = this.produtoRepository
      .createQueryBuilder('produto')
      .innerJoin('produto.produtoLojas', 'produtoLoja');

    if (filtro.codigo)
      query.andWhere('produto.id = :codigo', { codigo: filtro.codigo });

    if (filtro.descricao)
      query.andWhere('produto.descricao LIKE :descricao', {
        descricao: `%${filtro.descricao}%`,
      });

    if (filtro.custo)
      query.andWhere('produto.custo = :custo', { custo: filtro.custo });

    if (filtro.precoVenda)
      query.andWhere('produtoLoja.precoVenda = :precoVenda', {
        precoVenda: filtro.precoVenda,
      });

    query.addOrderBy('produto.id');
    query.distinctOn(['produto.id']);

    query.skip((filtro.page - 1) * filtro.limit);
    query.take(filtro.limit);

    const produtos: Produto[] = await query.getMany();

    const result: ProdutoDto[] = ProdutoDto.ProdutoToProdutoDto(produtos);

    return result;
  }
}
