import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import { Response } from 'express';

import { ProdutosService } from './produtos.service';

import { ProdutoDto } from './dto/produto.dto';
import { DetailsProdutoDto } from './dto/details-produto.dto';
import { CreateProdutoDto } from './dto/create-produto.dto';

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
  @HttpCode(303)
  async create(
    @Body() createProdutoDto: CreateProdutoDto,
    @Res() res: Response,
  ) {
    const produtoId = await this.produtoService.create(createProdutoDto);

    res.redirect(`/produtos/${produtoId}`);
  }
}
