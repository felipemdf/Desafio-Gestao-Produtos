import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojasController } from './lojas.controller';
import { LojasService } from './lojas.service';
import { LojaRepository } from './loja.repository';
import { Loja } from './entities/loja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loja])],
  controllers: [LojasController],
  providers: [LojasService, LojaRepository],
})
export class LojasModule {}
