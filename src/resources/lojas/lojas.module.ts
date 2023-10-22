import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loja } from './entities/loja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loja])],
  controllers: [],
  providers: [],
})
export class LojasModule {}
