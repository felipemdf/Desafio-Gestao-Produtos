import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loja } from './entities/loja.entity';
import { LojaDto } from './dto/loja.dto';

@Injectable()
export class LojasService {
  constructor(
    @InjectRepository(Loja)
    private lojaRepository: Repository<Loja>,
  ) {}

  async findAll(): Promise<LojaDto[]> {
    return await this.lojaRepository
      .createQueryBuilder('l')
      .select(['l.id AS id', `CONCAT(l.id,'-',l.descricao) AS descricao`])
      .getRawMany();
  }
}
