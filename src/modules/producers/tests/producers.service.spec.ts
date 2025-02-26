import { Test } from '@nestjs/testing';
import { ProducersService } from '../producers.service';
import { BadRequestException } from '@nestjs/common';
import { SaveProducerDto } from '../dto/saveProducer.dto';
import { Producer } from '@prisma/client';
import { ProducersRepository } from '../producers.repository';
import { PrismaService } from './../../../prisma.service';

describe('ProducersService', () => {
  let producersService: ProducersService;
  let producersRepository: ProducersRepository;

  const producersList = [
    {
      id: 1,
      fullName: 'Gustavo Egidio Rigoni',
      document: '74311717000190',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      fullName: 'Maria Graça de Souza',
      document: '59035178033',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockProducersRepositoryFindProducerById = ({
    producersRepository,
    producerId,
  }) => {
    return jest
      .spyOn(producersRepository, 'findProducerById')
      .mockImplementation(() => {
        const producer =
          producersList.find((producer) => producer.id === producerId) || null;

        return Promise.resolve(producer);
      });
  };

  const mockProducersRepositoryFindProducerDocumetHasAlreadyUsed = (
    { producersRepository, producerDocument },
    producerId: number | undefined = undefined,
  ) => {
    return jest
      .spyOn(producersRepository, 'findProducerDocumetHasAlreadyUsed')
      .mockImplementation(() => {
        const producer =
          producersList.find((producer) => {
            if (producerId) {
              return (
                producer.document === producerDocument &&
                producer.id !== producerId
              );
            }
            return producer.document === producerDocument;
          }) || null;

        return Promise.resolve(producer);
      });
  };

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [ProducersService, ProducersRepository, PrismaService],
    }).compile();

    producersService = testingModule.get<ProducersService>(ProducersService);
    producersRepository =
      testingModule.get<ProducersRepository>(ProducersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ProducersService need to be defined', () => {
    expect(producersService).toBeDefined();
  });

  it('ProducersRepository nned to be defined', () => {
    expect(producersRepository).toBeDefined();
  });

  describe('Create Producer', () => {
    it(`The method createProducer need to throw an error when producer's document already exists`, async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '59035178033',
      };

      mockProducersRepositoryFindProducerDocumetHasAlreadyUsed({
        producersRepository,
        producerDocument: producerData.document,
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

      mockProducersRepositoryFindProducerDocumetHasAlreadyUsed({
        producersRepository,
        producerDocument: producerData.document,
      });

      jest
        .spyOn(producersRepository, 'createProducer')
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

      mockProducersRepositoryFindProducerDocumetHasAlreadyUsed({
        producersRepository,
        producerDocument: producerData.document,
      });

      jest
        .spyOn(producersRepository, 'createProducer')
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

      mockProducersRepositoryFindProducerDocumetHasAlreadyUsed(
        { producersRepository, producerDocument: producerData.document },
        producerId,
      );

      mockProducersRepositoryFindProducerById({
        producersRepository,
        producerId,
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

      mockProducersRepositoryFindProducerById({
        producersRepository,
        producerId,
      });

      mockProducersRepositoryFindProducerDocumetHasAlreadyUsed(
        { producersRepository, producerDocument: producerData.document },
        producerId,
      );

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
        document: '74311717000190',
      };

      mockProducersRepositoryFindProducerById({
        producersRepository,
        producerId,
      });

      mockProducersRepositoryFindProducerDocumetHasAlreadyUsed(
        { producersRepository, producerDocument: producerData.document },
        producerId,
      );

      const resultProducerData: Producer = {
        id: producerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...producerData,
      };

      jest
        .spyOn(producersRepository, 'updateProducer')
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
        document: '74311717000190',
      };

      mockProducersRepositoryFindProducerById({
        producersRepository,
        producerId,
      });

      mockProducersRepositoryFindProducerDocumetHasAlreadyUsed(
        { producersRepository, producerDocument: producerData.document },
        producerId,
      );

      jest
        .spyOn(producersRepository, 'updateProducer')
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

      mockProducersRepositoryFindProducerById({
        producersRepository,
        producerId,
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

      const resultProducerData: Producer = {
        id: producerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...producerData,
      };

      mockProducersRepositoryFindProducerById({
        producersRepository,
        producerId,
      });

      jest
        .spyOn(producersRepository, 'removeProducer')
        .mockImplementation(() => {
          return Promise.resolve(resultProducerData);
        });

      const removeProducerProducer =
        producersService.removeProducer(producerId);

      await expect(removeProducerProducer).resolves.toBe(resultProducerData);
      await expect(removeProducerProducer).resolves.not.toBeInstanceOf(
        BadRequestException,
      );
    });

    it(`The method removeProducer need to throw an error when prisma can't remove the data`, async () => {
      const producerId: number = 1;

      mockProducersRepositoryFindProducerById({
        producersRepository,
        producerId,
      });

      jest
        .spyOn(producersRepository, 'removeProducer')
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
