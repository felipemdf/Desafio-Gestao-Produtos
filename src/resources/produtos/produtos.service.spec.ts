import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { ProdutoRepository } from './produtos.repository';
import { ProdutolojaRepository } from './produtoLojas.repository';
import { ProdutoDto } from './dto/produto.dto';
import { DetailsProdutoDto } from './dto/details-produto.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SaveProdutoDto } from './dto/save-produto.dto';

const findAllMock: ProdutoDto[] = [
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

const findOneMock: DetailsProdutoDto = {
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

const produtoRepositoryFindByIdMock = {
  id: 113,
  descricao: 'Produto teste',
  custo: 10.0,
  imagem: null,
  produtoLojas: [
    {
      precoVenda: 1.5,
      loja: {
        id: 3,
        descricao: 'LOJA 3',
      },
    },
  ],
};

const produtoLojaRepositoryfindProdutoLojasPorProduto = [
  { idLoja: 1 },
  { idLoja: 2 },
];

describe('ProdutosService', () => {
  let service: ProdutosService;
  let produtoRepository: ProdutoRepository;
  let produtoLojaRepository: ProdutolojaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: ProdutoRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue(findAllMock),
            findById: jest
              .fn()
              .mockResolvedValue(produtoRepositoryFindByIdMock),
            saveProduto: jest.fn().mockReturnValue(undefined),
            delete: jest.fn().mockReturnValue(undefined),
          },
        },
        {
          provide: ProdutolojaRepository,
          useValue: {
            findProdutoLojasPorProduto: jest
              .fn()
              .mockResolvedValue(
                produtoLojaRepositoryfindProdutoLojasPorProduto,
              ),
          },
        },
      ],
    }).compile();

    service = module.get<ProdutosService>(ProdutosService);
    produtoRepository = module.get<ProdutoRepository>(ProdutoRepository);
    produtoLojaRepository = module.get<ProdutolojaRepository>(
      ProdutolojaRepository,
    );
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
    expect(produtoRepository).toBeDefined();
    expect(produtoLojaRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de produtos com sucesso', async () => {
      const result = await service.findAll();
      expect(result).toEqual(findAllMock);
    });

    it('deve retornar uma lista de produtos vazia com sucesso', async () => {
      jest.spyOn(produtoRepository, 'findAll').mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('deve gerar um exceção', () => {
      jest
        .spyOn(produtoRepository, 'findAll')
        .mockRejectedValueOnce(new Error());
      expect(service.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('deve retornar um produto com sucesso', async () => {
      const result = await service.findOne(113);

      expect(result).toEqual(findOneMock);
      expect(produtoRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('deve gerar um HttpException', async () => {
      jest.spyOn(produtoRepository, 'findById').mockResolvedValue(null);

      try {
        await service.findOne(113);
      } catch (error) {
        expect(produtoRepository.findById).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(404);
        expect(error.message).toBe('Produto não encontrado');
      }
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

    const produtoComLojaRepetida: SaveProdutoDto = {
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
      const result = await service.save(produto);

      expect(result).toBeUndefined();
      expect(produtoRepository.saveProduto).toHaveBeenCalledTimes(1);
    });

    it('deve salvar um produto novo com sucesso', async () => {
      const result = await service.save({ id: 114, ...produto });

      expect(result).toBeUndefined();
      expect(produtoRepository.saveProduto).toHaveBeenCalledTimes(1);
    });

    it('deve falhar ao salvar um novo produto com loja repetida', async () => {
      try {
        const result = await service.save({ ...produtoComLojaRepetida });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(400);
        expect(error.message).toBe(
          'Não é permitido mais que um preço de venda para a mesma loja.',
        );
      }

      expect(produtoRepository.saveProduto).toHaveBeenCalledTimes(1);
    });

    it('valida lojas com sucesso', async () => {
      const result = await service.verificaLojasRepetidas([1, 3]);
      expect(result).toBe(false);
    });

    it('valida lojas com erro', async () => {
      const result = await service.verificaLojasRepetidas([1, 3, 3]);
      expect(result).toBe(true);
    });

    it('Gera lista de produtos removidos', async () => {
      const produtoId = 114;
      const novaListaProdutoLojas = [1, 3];

      const result = await service.verificaProdutoLojasRemovidos(
        produtoId,
        novaListaProdutoLojas,
      );

      expect(result).toEqual([2]);
    });
  });

  describe('remove', () => {
    it('deve remover um produto com sucesso', async () => {
      const result = await service.remove(113);

      expect(result).toBeUndefined();
      expect(produtoRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
