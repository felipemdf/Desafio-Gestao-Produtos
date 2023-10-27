import { Test, TestingModule } from '@nestjs/testing';
import { LojasService } from './lojas.service';
import { LojaDto } from './dto/loja.dto';
import { LojaRepository } from './loja.repository';

const lojasList: LojaDto[] = [
  { id: 1, descricao: '1-LOJA 1' },
  { id: 2, descricao: '2-LOJA 2' },
  { id: 3, descricao: '3-LOJA 3' },
];

describe('LojasService', () => {
  let service: LojasService;
  let lojaRepository: LojaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LojasService,
        {
          provide: LojaRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue(lojasList),
          },
        },
      ],
    }).compile();

    service = module.get<LojasService>(LojasService);
    lojaRepository = module.get<LojaRepository>(LojaRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
    expect(lojaRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de lojas com sucesso', async () => {
      const result = await service.findAll();

      expect(result).toEqual(lojasList);
    });

    it('deve gerar um exceção', () => {
      jest.spyOn(lojaRepository, 'findAll').mockRejectedValueOnce(new Error());

      expect(service.findAll()).rejects.toThrowError();
    });
  });
});
