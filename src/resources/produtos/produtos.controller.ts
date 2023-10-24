import { Controller, Get, Query } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutoDto } from './entities/dto/produto.dto';
import { FilterProdutoDto } from './entities/dto/filter-produto.dto';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtoService: ProdutosService) {}

  @Get()
  async findAll(@Query() filtro: FilterProdutoDto): Promise<ProdutoDto[]> {
    return await this.produtoService.findAll(filtro);
  }
}
