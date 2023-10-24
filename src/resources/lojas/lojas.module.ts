import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loja } from './entities/loja.entity';
import { LojasController } from './lojas.controller';
import { LojasService } from './lojas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Loja])],
  controllers: [LojasController],
  providers: [LojasService],
})
export class LojasModule {}
