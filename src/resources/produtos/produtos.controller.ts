import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';

import { ProdutosService } from './produtos.service';

import pako from 'pako';
import { ProdutoDto } from './dto/produto.dto';
import { DetailsProdutoDto } from './dto/details-produto.dto';
import { SaveProdutoDto } from './dto/save-produto.dto';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtoService: ProdutosService) {}

  @Get()
  async findAll(): Promise<ProdutoDto[]> {
    return await this.produtoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<DetailsProdutoDto> {
    return await this.produtoService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.produtoService.remove(id);
  }

  @Post()
  async save(@Body() createProdutoDto: SaveProdutoDto) {
    return await this.produtoService.save(createProdutoDto);
  }
}
