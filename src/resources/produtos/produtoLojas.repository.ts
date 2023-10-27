import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoLoja } from './entities/produtoLoja.entity';

@Injectable()
export class ProdutolojaRepository extends Repository<ProdutoLoja> {
  constructor(
    @InjectRepository(ProdutoLoja)
    repository: Repository<ProdutoLoja>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findProdutoLojasPorProduto(id: number): Promise<ProdutoLoja[]> {
    return await this.find({
      select: { idLoja: true },
      where: { idProduto: id },
    });
  }
}
