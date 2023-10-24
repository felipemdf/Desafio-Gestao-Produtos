import { Controller, Get, Param, Query } from '@nestjs/common';

import { ProdutosService } from './produtos.service';

import { ProdutoDto } from './entities/dto/produto.dto';
import { FilterProdutoDto } from './entities/dto/filter-produto.dto';
import { DetailsProdutoDto } from './entities/dto/details-produto.dto';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtoService: ProdutosService) {}

  @Get()
  async findAll(@Query() filtro: FilterProdutoDto): Promise<ProdutoDto[]> {
    return await this.produtoService.findAll(filtro);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<DetailsProdutoDto> {
    return await this.produtoService.findOne(id);
  }
}
