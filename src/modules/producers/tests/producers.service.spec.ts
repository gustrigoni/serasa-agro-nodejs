import { Test } from '@nestjs/testing';
import { ProducersService } from '../producers.service';
import { BadRequestException } from '@nestjs/common';
import { SaveProducerDto } from '../dto/saveProducer.dto';
import { PrismaService } from './../../../prisma.service';
import { Producer } from '@prisma/client';

interface SpyProdutoServiceMethods {
  throwExceptionIfUserAlreadyExistsByDocument(): Promise<jest.Mock>;
  throwExceptionIfUserNotExistsByProducerId(): Promise<jest.Mock>;
}

describe('ProducersService', () => {
  let producersService: ProducersService;
  let prismaService: PrismaService;

  const producersList = [
    {
      id: 1,
      fullName: 'Gustavo Egidio Rigoni',
      document: '74311717000190',
      createdAt: new Date(),
      updatedAt: new Date(),
      farms: null,
    },
    {
      id: 2,
      fullName: 'Maria Graça de Souza',
      document: '59035178033',
      createdAt: new Date(),
      updatedAt: new Date(),
      farms: null,
    },
  ];

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: PrismaService,
          useValue: {
            producer: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    producersService = testingModule.get<ProducersService>(ProducersService);
    prismaService = testingModule.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Producers service need to be defined', () => {
    expect(producersService).toBeDefined();
  });

  it('Prisma service need to be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('Create Producer', () => {
    it(`The method createProducer need to throw an error when producer's document already exists`, async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '59035178033',
      };

      jest
        .spyOn(prismaService.producer as any, 'findFirst')
        .mockImplementation(() => {
          const producer =
            producersList.find(
              (producer) => producer.document === producerData.document,
            ) || null;

          return Promise.resolve(producer);
        });

      const createProducer = producersService.createProducer(producerData);

      await expect(createProducer).rejects.toBeInstanceOf(BadRequestException);
      await expect(createProducer).rejects.toThrow(
        'Já existe um produtor cadastrado com este CPF/CNPJ.',
      );
    });

    it(`The method createProducer need to save a producer when producer's info is correct`, async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '20718888000100',
      };

      const resultProducerData: Producer = {
        id: 99,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...producerData,
      };

      jest
        .spyOn(prismaService.producer as any, 'findFirst')
        .mockImplementation(() => {
          const producer =
            producersList.find(
              (producer) => producer.document === producerData.document,
            ) || null;

          return Promise.resolve(producer);
        });

      jest
        .spyOn(prismaService.producer as any, 'create')
        .mockImplementation(() => {
          return Promise.resolve(resultProducerData);
        });

      const createProducer = producersService.createProducer(producerData);

      await expect(createProducer).resolves.toBe(resultProducerData);
      await expect(createProducer).resolves.not.toBeInstanceOf(
        BadRequestException,
      );
    });

    it(`The method createProducer need to throw an error when prisma can't remove the data`, async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '20718888000100',
      };

      jest
        .spyOn(
          producersService as unknown as SpyProdutoServiceMethods,
          'throwExceptionIfUserAlreadyExistsByDocument',
        )
        .mockImplementation();

      jest
        .spyOn(
          producersService as unknown as SpyProdutoServiceMethods,
          'throwExceptionIfUserAlreadyExistsByDocument',
        )
        .mockImplementation();

      jest
        .spyOn(prismaService.producer as any, 'create')
        .mockImplementation(() => {
          return Promise.reject(new Error('Ops!'));
        });

      const createProducer = producersService.createProducer(producerData);

      await expect(createProducer).rejects.toBeInstanceOf(BadRequestException);
      await expect(createProducer).rejects.toThrow(
        'Não foi possível criar este produtor, tente novamente.',
      );
    });
  });

  describe('Update Producer', () => {
    it(`The method updateProducer need to throw an error when producer's id not exists`, async () => {
      const producerId: number = -1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '74311717000190',
      };

      jest
        .spyOn(
          producersService as unknown as SpyProdutoServiceMethods,
          'throwExceptionIfUserAlreadyExistsByDocument',
        )
        .mockImplementation();

      jest
        .spyOn(prismaService.producer as any, 'findUnique')
        .mockImplementation(() => {
          const producer =
            producersList.find((producer) => producer.id === producerId) ||
            null;

          return Promise.resolve(producer);
        });

      const updateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(updateProducer).rejects.toBeInstanceOf(BadRequestException);
      await expect(updateProducer).rejects.toThrow(
        'O produtor informado não existe.',
      );
    });

    it(`The method updateProducer need to throw an error when producer's id exists but document already used`, async () => {
      const producerId: number = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '59035178033',
      };

      jest
        .spyOn(
          producersService as unknown as SpyProdutoServiceMethods,
          'throwExceptionIfUserNotExistsByProducerId',
        )
        .mockImplementation();

      jest
        .spyOn(prismaService.producer as any, 'findFirst')
        .mockImplementation(() => {
          const producer =
            producersList.find(
              (producer) =>
                producer.document === producerData.document &&
                producer.id !== producerId,
            ) || null;

          return Promise.resolve(producer);
        });

      const updateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(updateProducer).rejects.toBeInstanceOf(BadRequestException);
      await expect(updateProducer).rejects.toThrow(
        'Já existe um produtor cadastrado com este CPF/CNPJ.',
      );
    });

    it(`The method updateProducer need to update producer's data when info is correct`, async () => {
      const producerId: number = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '21823562563',
      };

      jest
        .spyOn(
          producersService as unknown as SpyProdutoServiceMethods,
          'throwExceptionIfUserNotExistsByProducerId',
        )
        .mockImplementation();

      jest
        .spyOn(
          producersService as unknown as SpyProdutoServiceMethods,
          'throwExceptionIfUserAlreadyExistsByDocument',
        )
        .mockImplementation();

      const resultProducerData: Producer = {
        id: producerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...producerData,
      };

      jest
        .spyOn(prismaService.producer as any, 'update')
        .mockImplementation(() => {
          return Promise.resolve(resultProducerData);
        });

      const updateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(updateProducer).resolves.toBe(resultProducerData);
      await expect(updateProducer).resolves.not.toBeInstanceOf(
        BadRequestException,
      );
    });

    it(`The method updateProducer need to throw an error when prisma can't remove the data`, async () => {
      const producerId: number = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '21823562563',
      };

      jest
        .spyOn(
          producersService as unknown as SpyProdutoServiceMethods,
          'throwExceptionIfUserNotExistsByProducerId',
        )
        .mockImplementation();

      jest
        .spyOn(
          producersService as unknown as SpyProdutoServiceMethods,
          'throwExceptionIfUserAlreadyExistsByDocument',
        )
        .mockImplementation();

      jest
        .spyOn(prismaService.producer as any, 'update')
        .mockImplementation(() => {
          return Promise.reject(new Error('Ops!'));
        });

      const updateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(updateProducer).rejects.toBeInstanceOf(BadRequestException);
      await expect(updateProducer).rejects.toThrow(
        'Não foi possível atualizar este produtor, tente novamente.',
      );
    });
  });

  describe('Remove Producer', () => {
    it(`The method removeProducer need to throw an error when producer's id not exists`, async () => {
      const producerId: number = -1;

      const producerData = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '21823562563',
      };

      jest
        .spyOn(prismaService.producer as any, 'findUnique')
        .mockImplementation(() => {
          const producer =
            producersList.find((producer) => producer.id === producerId) ||
            null;

          return Promise.resolve(producer);
        });

      const updateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(updateProducer).rejects.toBeInstanceOf(BadRequestException);
      await expect(updateProducer).rejects.toThrow(
        'O produtor informado não existe.',
      );
    });

    it(`The method removeProducer need to remove producer and return removed data when producer's id exists`, async () => {
      const producerId: number = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '21823562563',
      };

      jest
        .spyOn(
          producersService as unknown as SpyProdutoServiceMethods,
          'throwExceptionIfUserNotExistsByProducerId',
        )
        .mockImplementation();

      jest
        .spyOn(prismaService.producer as any, 'delete')
        .mockImplementation(() => {
          return Promise.resolve(resultProducerData);
        });

      const removeProducerProducer =
        producersService.removeProducer(producerId);

      const resultProducerData: Producer = {
        id: producerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...producerData,
      };

      await expect(removeProducerProducer).resolves.toBe(resultProducerData);
      await expect(removeProducerProducer).resolves.not.toBeInstanceOf(
        BadRequestException,
      );
    });

    it(`The method removeProducer need to throw an error when prisma can't remove the data`, async () => {
      const producerId: number = 1;

      jest
        .spyOn(
          producersService as unknown as SpyProdutoServiceMethods,
          'throwExceptionIfUserNotExistsByProducerId',
        )
        .mockImplementation();

      jest
        .spyOn(prismaService.producer as any, 'delete')
        .mockImplementation(() => {
          return Promise.reject(new Error('Ops!'));
        });

      const removeProducerProducer =
        producersService.removeProducer(producerId);

      await expect(removeProducerProducer).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(removeProducerProducer).rejects.toThrow(
        'Não foi possível remover este produtor, tente novamente.',
      );
    });
  });
});
