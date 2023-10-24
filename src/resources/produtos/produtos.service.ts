import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProdutoLoja } from './entities/produtoLoja.entity';
import { Produto } from './entities/produto.entity';
import { FilterProdutoDto } from './entities/dto/filter-produto.dto';
import { ProdutoDto } from './entities/dto/produto.dto';
import { DetailsProdutoDto } from './entities/dto/details-produto.dto';
import { DetailsProdutoLojaDto } from './entities/dto/details-produtoLoja.dto';

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

    const result: ProdutoDto[] = ProdutoDto.produtoToProdutoDto(produtos);

    return result;
  }

  async findOne(id: number): Promise<DetailsProdutoDto> {
    const produto: Produto = (
      await this.produtoRepository.find({
        select: {
          produtoLojas: {
            precoVenda: true,
            loja: { id: true, descricao: true },
          },
        },
        where: { id: id },
        relations: ['produtoLojas', 'produtoLojas.loja'],
      })
    )[0];

    if (!produto) {
      throw new HttpException(`Produto não encontrado`, HttpStatus.NOT_FOUND);
    }
    const detailsProduto =
      DetailsProdutoDto.produtoToDetailsProdutoDto(produto);

    detailsProduto.produtoLojas =
      DetailsProdutoLojaDto.produtoLojasToDetailsProdutoLojaDto(
        produto.produtoLojas,
      );

    return detailsProduto;
  }

  async remove(id: number): Promise<void> {
    this.produtoRepository.delete(id);
  }
}
