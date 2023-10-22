import { Module } from '@nestjs/common';
import { Produto } from './entities/produto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoLoja } from './entities/produtoLoja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, ProdutoLoja])],
  controllers: [],
  providers: [],
})
export class ProdutosModule {}
