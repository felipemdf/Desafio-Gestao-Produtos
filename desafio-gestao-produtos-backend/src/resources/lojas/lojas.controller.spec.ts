import { Test, TestingModule } from '@nestjs/testing';
import { LojasController } from './lojas.controller';
import { LojasService } from './lojas.service';
import { LojaDto } from './dto/loja.dto';

const lojasList: LojaDto[] = [
  { id: 1, descricao: '1-LOJA 1' },
  { id: 2, descricao: '2-LOJA 2' },
  { id: 3, descricao: '3-LOJA 3' },
];

describe('LojasController', () => {
  let controller: LojasController;
  let lojaService: LojasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LojasController],
      providers: [
        {
          provide: LojasService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(lojasList),
          },
        },
      ],
    }).compile();

    controller = module.get<LojasController>(LojasController);
    lojaService = module.get<LojasService>(LojasService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
    expect(lojaService).toBeDefined();
  });

  describe('teste findAll', () => {
    it('deve retornar uma lista de lojas com sucesso', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(lojasList);
      expect(typeof result).toEqual('object');
      expect(lojaService.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve gerar um exceção', () => {
      jest.spyOn(lojaService, 'findAll').mockRejectedValueOnce(new Error());

      expect(controller.findAll()).rejects.toThrowError();
    });
  });
});
