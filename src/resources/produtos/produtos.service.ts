import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { ProdutoLoja } from './entities/produtoLoja.entity';
import { Produto } from './entities/produto.entity';
import { FilterProdutoDto } from './dto/filter-produto.dto';
import { ProdutoDto } from './dto/produto.dto';
import { DetailsProdutoDto } from './dto/details-produto.dto';
import { DetailsProdutoLojaDto } from './dto/details-produtoLoja.dto';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { ProdutoLojaDto } from './dto/produtoLoja.dto';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,

    @InjectRepository(ProdutoLoja)
    private produtoLojaRepository: Repository<ProdutoLoja>,
  ) {}

  async findAll(): Promise<ProdutoDto[]> {
    const produtos: Produto[] = await this.produtoRepository.find({
      select: {
        produtoLojas: { precoVenda: true, idLoja: true },
      },
      relations: ['produtoLojas'],
    });

    if (!produtos || produtos.length == 0) return [];

    const produtosDto: ProdutoDto[] = ProdutoDto.produtoToProdutoDto(produtos);

    return produtosDto;
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

  async create(createProdutoDto: CreateProdutoDto) {
    let produtoId: number;

    await this.validarProdutoLojas(
      createProdutoDto.produtoLojas.map((pl) => pl.idLoja),
    );

    await this.produtoRepository.manager.transaction(
      async (manager: EntityManager) => {
        const produto: Produto =
          CreateProdutoDto.createProdutoDtoToProduto(createProdutoDto);

        produtoId = (await manager.save(produto)).id;

        const produtoLojas = ProdutoLojaDto.produtoLojaDtoToProdutoLoja(
          produtoId,
          createProdutoDto.produtoLojas,
        );

        await manager.save(produtoLojas);
      },
    );

    return produtoId;
  }

  private async validarProdutoLojas(
    lojasParaAtualizar: number[],
    isUpdate = false,
    produtoId?: number,
  ): Promise<void> {
    const lojasValidas = new Set<number>();

    if (await this.verificaLojasRepetidas(lojasValidas, lojasParaAtualizar)) {
      throw new HttpException(
        'Não é permitido mais que um preço de venda para a mesma loja.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isUpdate && produtoId) {
      const lojasExistentes: number[] = (
        await this.produtoLojaRepository.find({
          where: { idProduto: produtoId },
        })
      ).map((produtoLoja) => produtoLoja.idLoja);

      if (this.verificaLojasRepetidas(lojasValidas, lojasExistentes)) {
        throw new HttpException(
          'Não é permitido mais que um preço de venda para a mesma loja.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  private async verificaLojasRepetidas(
    lojasValidas: Set<number>,
    listaLojas: number[],
  ) {
    return listaLojas.some((loja) => {
      if (lojasValidas.has(loja)) return true;
      lojasValidas.add(loja);
      return false;
    });
  }
}
