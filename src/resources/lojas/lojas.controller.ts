import { Controller, Get } from '@nestjs/common';
import { LojasService } from './lojas.service';
import { LojaDto } from './dto/loja.dto';

@Controller('lojas')
export class LojasController {
  constructor(private readonly lojaService: LojasService) {}

  @Get()
  async findAll(): Promise<LojaDto[]> {
    return await this.lojaService.findAll();
  }
}
