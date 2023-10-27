import { Repository } from 'typeorm';
import { Loja } from './entities/loja.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LojaRepository extends Repository<Loja> {
  constructor(
    @InjectRepository(Loja)
    repository: Repository<Loja>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAll(): Promise<Loja[]> {
    return await this.createQueryBuilder('l')
      .select(['l.id AS id', `CONCAT(l.id, '-', l.descricao) AS descricao`])
      .getRawMany();
  }
}
