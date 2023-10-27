import { EntityManager, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutoLoja } from './entities/produtoLoja.entity';

@Injectable()
export class ProdutoRepository extends Repository<Produto> {
  constructor(
    @InjectRepository(Produto)
    repository: Repository<Produto>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAll(): Promise<Produto[]> {
    const produtos: Produto[] = await this.find({
      select: { produtoLojas: { precoVenda: true, idLoja: true } },
      relations: ['produtoLojas'],
    });

    return produtos;
  }

  async findById(id: number): Promise<Produto> {
    const produto: Produto = (
      await this.find({
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

    return produto;
  }

  async saveProduto(
    produto: Produto,
    listaProdutoLojasRemovidos: number[],
  ): Promise<void> {
    await this.manager.transaction(async (manager: EntityManager) => {
      const idProduto = (
        await this.manager.save(Produto, {
          id: produto.id,
          descricao: produto.descricao,
          custo: produto.custo,
          imagem: produto.imagem,
        })
      ).id;

      if (listaProdutoLojasRemovidos.length > 0)
        await manager.delete(ProdutoLoja, {
          idProduto: idProduto,
          idLoja: In(listaProdutoLojasRemovidos),
        });

      produto.produtoLojas.forEach((p) => (p.idProduto = idProduto));

      await manager.save(produto.produtoLojas);
    });
  }
}
