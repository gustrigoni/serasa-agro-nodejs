import { Test } from '@nestjs/testing';
import { ProducersService } from '../producers.service';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SaveProducerDto } from '../dto/saveProducer.dto';
import { Producer } from '@prisma/client';
import { ProducersRepository } from '../producers.repository';
import { PrismaService } from './../../../modules/prisma/prisma.service';

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

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
        ProducersService,
        ProducersRepository,
        PrismaService,
      ],
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

  it('ProducersRepository need to be defined', () => {
    expect(producersRepository).toBeDefined();
  });

  describe('Create Producer', () => {
    it(`The method createProducer need to throw a BadRequestException when producer's document already exists`, async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '59035178033',
      };

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserAlreadyExistsByDocument' as any,
        )
        .mockRejectedValue(
          new BadRequestException(
            'Já existe um produtor cadastrado com este CPF/CNPJ.',
          ),
        );

      const createProducer = producersService.createProducer(producerData);

      await expect(createProducer).rejects.toBeInstanceOf(BadRequestException);
      await expect(createProducer).rejects.toThrow(
        'Já existe um produtor cadastrado com este CPF/CNPJ.',
      );
    });

    it('The method createProducer need to throw a InternalServerErrorException due an unexpected error in repository findProducerDocumetHasAlreadyUsed method', async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '20718888000100',
      };

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserAlreadyExistsByDocument' as any,
        )
        .mockRejectedValue(
          new InternalServerErrorException(
            'Não foi possível verificar se o documento informado é válido.',
          ),
        );

      const createProducer = producersService.createProducer(producerData);

      await expect(createProducer).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(createProducer).rejects.toThrow(
        'Não foi possível verificar se o documento informado é válido.',
      );
    });

    it('The method createProducer need to throw a InternalServerErrorException due an unexpected error in repository createProducer method', async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '20718888000100',
      };

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserAlreadyExistsByDocument' as any,
        )
        .mockResolvedValue(undefined);

      producersRepository.createProducer = jest
        .fn()
        .mockRejectedValue(new Error());

      const createProducer = producersService.createProducer(producerData);

      await expect(createProducer).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(createProducer).rejects.toThrow(
        'Não foi possível criar este produtor, tente novamente.',
      );
    });

    it('The method createProducer need to return the new producer data when it has been created successfully', async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '20718888000100',
      };

      const mockResultRepositoryProducerData: Producer = {
        id: 99,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...producerData,
      };

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserAlreadyExistsByDocument' as any,
        )
        .mockResolvedValue(undefined);

      producersRepository.createProducer = jest
        .fn()
        .mockResolvedValue(mockResultRepositoryProducerData);

      const resultCreateProducer =
        producersService.createProducer(producerData);

      await expect(resultCreateProducer).resolves.toBe(
        mockResultRepositoryProducerData,
      );
      await expect(resultCreateProducer).resolves.not.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('Update Producer', () => {
    it(`The method updateProducer need to throw a BadRequestException when producer's document already exists`, async () => {
      const producerId: number = -1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '74311717000190',
      };

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserAlreadyExistsByDocument' as any,
        )
        .mockResolvedValue(null);

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserNotExistsByProducerId' as any,
        )
        .mockRejectedValue(
          new BadRequestException('O produtor informado não existe.'),
        );

      const resultUpdateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(resultUpdateProducer).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultUpdateProducer).rejects.toThrow(
        'O produtor informado não existe.',
      );
    });

    it(`The method updateProducer need to throw a BadRequestException when producer's id exists but document is already used`, async () => {
      const producerId: number = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '59035178033',
      };

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserNotExistsByProducerId' as any,
        )
        .mockResolvedValue(undefined);

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserAlreadyExistsByDocument' as any,
        )
        .mockRejectedValue(
          new BadRequestException(
            'Já existe um produtor cadastrado com este CPF/CNPJ.',
          ),
        );

      const resultUpdateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(resultUpdateProducer).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultUpdateProducer).rejects.toThrow(
        'Já existe um produtor cadastrado com este CPF/CNPJ.',
      );
    });

    it('The method updateProducer need to throw a InternalServerErrorException due an unexpected error in repository findProducerById method', async () => {
      const producerId: number = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '74311717000190',
      };

      producersRepository.findProducerById = jest
        .fn()
        .mockRejectedValue(new Error());

      producersRepository.findProducerDocumetHasAlreadyUsed = jest
        .fn()
        .mockResolvedValue(undefined);

      const resultUpdateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(resultUpdateProducer).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultUpdateProducer).rejects.toThrow(
        'Não foi possível verificar se o produtor informado é válido.',
      );
    });

    it('The method updateProducer need to throw a InternalServerErrorException due an unexpected error in repository findProducerDocumetHasAlreadyUsed method', async () => {
      const producerId: number = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '74311717000190',
      };

      producersRepository.findProducerById = jest
        .fn()
        .mockResolvedValue(producersList[0]);

      producersRepository.findProducerDocumetHasAlreadyUsed = jest
        .fn()
        .mockRejectedValue(new Error());

      const resultUpdateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(resultUpdateProducer).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultUpdateProducer).rejects.toThrow(
        'Não foi possível verificar se o documento informado é válido.',
      );
    });

    it('The method updateProducer need to throw a InternalServerErrorException due an unexpected error in repository updateProducer method', async () => {
      const producerId: number = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '74311717000190',
      };

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserNotExistsByProducerId' as any,
        )
        .mockResolvedValue(undefined);

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserAlreadyExistsByDocument' as any,
        )
        .mockResolvedValue(undefined);

      producersRepository.updateProducer = jest
        .fn()
        .mockRejectedValue(new Error());

      const updateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(updateProducer).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(updateProducer).rejects.toThrow(
        'Não foi possível atualizar este produtor, tente novamente.',
      );
    });

    it('The method updateProducer need to return the new producer data when it has been updated successfully', async () => {
      const producerId: number = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '74311717000190',
      };

      const resultProducerData: Producer = {
        id: producerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...producerData,
      };

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserNotExistsByProducerId' as any,
        )
        .mockResolvedValue(undefined);

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserAlreadyExistsByDocument' as any,
        )
        .mockResolvedValue(undefined);

      producersRepository.updateProducer = jest
        .fn()
        .mockResolvedValue(resultProducerData);

      const updateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(updateProducer).resolves.toBe(resultProducerData);
      await expect(updateProducer).resolves.not.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('Remove Producer', () => {
    it(`The method removeProducer need to throw a BadRequestException when producer's id not exists`, async () => {
      const producerId: number = -1;

      const producerData = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '21823562563',
      };

      producersRepository.findProducerById = jest.fn().mockResolvedValue(null);

      const updateProducer = producersService.updateProducer(
        producerId,
        producerData,
      );

      await expect(updateProducer).rejects.toBeInstanceOf(BadRequestException);
      await expect(updateProducer).rejects.toThrow(
        'O produtor informado não existe.',
      );
    });

    it('The method removeProducer need to throw a InternalServerErrorException due an unexpected error in repository findProducerById method', async () => {
      const producerId: number = 1;

      producersRepository.findProducerById = jest
        .fn()
        .mockRejectedValue(new Error());

      const resultRemoveProducerData =
        producersService.removeProducer(producerId);

      await expect(resultRemoveProducerData).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultRemoveProducerData).rejects.toThrow(
        'Não foi possível verificar se o produtor informado é válido.',
      );
    });

    it('The method removeProducer need to throw a InternalServerErrorException due an unexpected error in repository removeProducer method', async () => {
      const producerId: number = 1;

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserNotExistsByProducerId' as any,
        )
        .mockResolvedValue(undefined);

      jest
        .spyOn(producersRepository, 'removeProducer')
        .mockRejectedValue(new Error());

      const removeProducerProducer =
        producersService.removeProducer(producerId);

      await expect(removeProducerProducer).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(removeProducerProducer).rejects.toThrow(
        'Não foi possível remover este produtor, tente novamente.',
      );
    });

    it('The method removeProducer need to return the new producer data when it has been removed successfully', async () => {
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

      jest
        .spyOn(
          producersService,
          'throwExceptionIfUserNotExistsByProducerId' as any,
        )
        .mockResolvedValue(undefined);

      jest
        .spyOn(producersRepository, 'removeProducer')
        .mockResolvedValue(resultProducerData);

      const removeProducerProducer =
        producersService.removeProducer(producerId);

      await expect(removeProducerProducer).resolves.toBe(resultProducerData);
      await expect(removeProducerProducer).resolves.not.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
