import { Injectable } from '@nestjs/common';
import { LojaDto } from './dto/loja.dto';
import { LojaRepository } from './loja.repository';

@Injectable()
export class LojasService {
  constructor(private lojaRepository: LojaRepository) {}

  async findAll(): Promise<LojaDto[]> {
    return await this.lojaRepository.findAll();
  }
}
