import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { ProdutoLoja } from './entities/produtoLoja.entity';
import { Produto } from './entities/produto.entity';
import { ProdutoDto } from './dto/produto.dto';
import { DetailsProdutoDto } from './dto/details-produto.dto';
import { DetailsProdutoLojaDto } from './dto/details-produtoLoja.dto';
import { SaveProdutoDto } from './dto/save-produto.dto';
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

  async save(saveProdutoDto: SaveProdutoDto): Promise<void> {
    let produtoId: number;

    const idsProdutoLojas = saveProdutoDto.produtoLojas.map((pl) => pl.idLoja);

    await this.validarProdutoLojas(idsProdutoLojas);

    const listaProdutoLojasRemovidos: number[] =
      await this.verificaProdutoLojasRemovidos(
        saveProdutoDto.id,
        idsProdutoLojas,
      );

    await this.produtoRepository.manager.transaction(
      async (manager: EntityManager) => {
        const produto: Produto =
          SaveProdutoDto.saveProdutoDtoProduto(saveProdutoDto);

        produtoId = (await manager.save(produto)).id;

        if (listaProdutoLojasRemovidos.length > 0)
          await manager.delete(ProdutoLoja, {
            idProduto: produto.id,
            idLoja: In(listaProdutoLojasRemovidos),
          });

        const produtoLojas = ProdutoLojaDto.produtoLojaDtoToProdutoLoja(
          produtoId,
          saveProdutoDto.produtoLojas,
        );

        await manager.save(produtoLojas);
      },
    );
  }

  private async validarProdutoLojas(novaListaLojas: number[]): Promise<void> {
    if (await this.verificaLojasRepetidas(novaListaLojas)) {
      throw new HttpException(
        'Não é permitido mais que um preço de venda para a mesma loja.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verificaLojasRepetidas(listaLojas: number[]) {
    const lojasValidas = new Set<number>();

    return listaLojas.some((loja) => {
      if (lojasValidas.has(loja)) return true;
      lojasValidas.add(loja);
      return false;
    });
  }

  private async verificaProdutoLojasRemovidos(
    produtoId: number,
    novaListaProdutoLoja: number[],
  ) {
    const listaProdutoLojasRemovidos: number[] = [];

    const idsLojasExistentes: number[] = (
      await this.produtoLojaRepository.find({
        select: { idLoja: true },
        where: { idProduto: produtoId },
      })
    ).map((produtoLoja) => produtoLoja.idLoja);

    for (const idLojaExistente of idsLojasExistentes) {
      const lojaRemovida = !novaListaProdutoLoja.some(
        (idLoja) => idLoja == idLojaExistente,
      );

      if (lojaRemovida) listaProdutoLojasRemovidos.push(idLojaExistente);
    }

    return listaProdutoLojasRemovidos;
  }
}
