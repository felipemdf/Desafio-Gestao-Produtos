import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { DetailsProdutoDto } from './dto/details-produto.dto';
import { ProdutoDto } from './dto/produto.dto';
import { SaveProdutoDto } from './dto/save-produto.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

const produtoServiceFindAll: ProdutoDto[] = [
  {
    produtoLojas: [
      {
        idLoja: 1,
        precoVenda: 10.5,
      },
    ],
    id: 112,
    descricao: 'Produto teste',
    custo: 10.0,
  },
  {
    produtoLojas: [
      {
        idLoja: 1,
        precoVenda: 10.5,
      },
    ],
    id: 113,
    descricao: 'Produto teste',
    custo: 10.0,
  },
  {
    produtoLojas: [
      {
        idLoja: 2,
        precoVenda: 2.5,
      },
    ],
    id: 114,
    descricao: 'Produto teste',
    custo: 10.0,
  },
];

const produtoServiceFindOne: DetailsProdutoDto = {
  produtoLojas: [
    {
      idLoja: 3,
      precoVenda: 1.5,
      descricao: '3-LOJA 3',
    },
  ],
  id: 113,
  descricao: 'Produto teste',
  custo: 10.0,
  imagem: null,
};

describe('ProdutosController', () => {
  let controller: ProdutosController;
  let produtoService: ProdutosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosController],
      providers: [
        {
          provide: ProdutosService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(produtoServiceFindAll),
            findOne: jest.fn().mockResolvedValue(produtoServiceFindOne),
            save: jest.fn().mockReturnValue(undefined),
            remove: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ProdutosController>(ProdutosController);
    produtoService = module.get<ProdutosService>(ProdutosService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de produtos com sucesso', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(produtoServiceFindAll);
      expect(typeof result).toEqual('object');
      expect(produtoService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma lista de produtos vazia com sucesso', async () => {
      jest.spyOn(produtoService, 'findAll').mockResolvedValue([]);
      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(produtoService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve gerar um exceção', () => {
      jest.spyOn(produtoService, 'findAll').mockRejectedValueOnce(new Error());

      expect(controller.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('deve retornar um produto com sucesso', async () => {
      const result = await controller.findOne(113);

      expect(result).toEqual(produtoServiceFindOne);
      expect(produtoService.findOne).toHaveBeenCalledTimes(1);
    });

    it('deve gerar um exceção', () => {
      jest.spyOn(produtoService, 'findOne').mockRejectedValueOnce(new Error());
      expect(controller.findOne(113)).rejects.toThrowError();
    });
  });

  describe('save', () => {
    const produto: SaveProdutoDto = {
      descricao: 'Produto teste',
      custo: 10.0,
      produtoLojas: [
        {
          idLoja: 3,
          precoVenda: 1.5,
        },
        {
          idLoja: 1,
          precoVenda: 3,
        },
      ],
    };

    it('deve salvar um produto com sucesso', async () => {
      const result = await controller.save(produto);

      expect(result).toBeUndefined();
      expect(produtoService.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve remover um produto com sucesso', async () => {
      const result = await controller.remove(113);

      expect(result).toBeUndefined();
      expect(produtoService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
