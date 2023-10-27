import { Module } from '@nestjs/common';
import { Produto } from './entities/produto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoLoja } from './entities/produtoLoja.entity';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { ProdutoRepository } from './produtos.repository';
import { ProdutolojaRepository } from './produtoLojas.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, ProdutoLoja])],
  controllers: [ProdutosController],
  providers: [ProdutosService, ProdutoRepository, ProdutolojaRepository],
})
export class ProdutosModule {}
