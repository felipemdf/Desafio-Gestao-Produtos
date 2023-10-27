import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { Produto } from './entities/produto.entity';
import { ProdutoDto } from './dto/produto.dto';
import { DetailsProdutoDto } from './dto/details-produto.dto';
import { DetailsProdutoLojaDto } from './dto/details-produtoLoja.dto';
import { SaveProdutoDto } from './dto/save-produto.dto';
import { ProdutoRepository } from './produtos.repository';
import { ProdutolojaRepository } from './produtoLojas.repository';

@Injectable()
export class ProdutosService {
  constructor(
    private produtoRepository: ProdutoRepository,
    private produtoLojaRepository: ProdutolojaRepository,
  ) {}

  async findAll(): Promise<ProdutoDto[]> {
    const produtos: Produto[] = await this.produtoRepository.findAll();

    if (!produtos || produtos.length == 0) return [];

    return ProdutoDto.produtoToProdutoDto(produtos);
  }

  async findOne(id: number): Promise<DetailsProdutoDto> {
    const produto: Produto = await this.produtoRepository.findById(id);

    if (!produto) {
      throw new HttpException(`Produto não encontrado`, HttpStatus.NOT_FOUND);
    }
    const response = DetailsProdutoDto.produtoToDetailsProdutoDto(produto);

    response.produtoLojas =
      DetailsProdutoLojaDto.produtoLojasToDetailsProdutoLojaDto(
        produto.produtoLojas,
      );

    return response;
  }

  async remove(id: number): Promise<void> {
    this.produtoRepository.delete(id);
  }

  async save(saveProdutoDto: SaveProdutoDto): Promise<void> {
    const idsProdutoLojas = saveProdutoDto.produtoLojas.map((pl) => pl.idLoja);

    await this.validarProdutoLojas(idsProdutoLojas);

    let listaProdutoLojasRemovidos: number[] = [];
    if (saveProdutoDto.id) {
      listaProdutoLojasRemovidos = await this.verificaProdutoLojasRemovidos(
        saveProdutoDto.id,
        idsProdutoLojas,
      );
    }

    const produto: Produto =
      SaveProdutoDto.saveProdutoDtoProduto(saveProdutoDto);

    this.produtoRepository.saveProduto(produto, listaProdutoLojasRemovidos);
  }

  private async validarProdutoLojas(novaListaLojas: number[]): Promise<void> {
    if (await this.verificaLojasRepetidas(novaListaLojas)) {
      throw new HttpException(
        'Não é permitido mais que um preço de venda para a mesma loja.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async verificaLojasRepetidas(listaLojas: number[]): Promise<boolean> {
    const lojasValidas = new Set<number>();

    return listaLojas.some((loja) => {
      if (lojasValidas.has(loja)) return true;
      lojasValidas.add(loja);
      return false;
    });
  }

  public async verificaProdutoLojasRemovidos(
    produtoId: number,
    novaListaProdutoLoja: number[],
  ) {
    const listaProdutoLojasRemovidos: number[] = [];

    const idsLojasExistentes: number[] = (
      await this.produtoLojaRepository.findProdutoLojasPorProduto(produtoId)
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
