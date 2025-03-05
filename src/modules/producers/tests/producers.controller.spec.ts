import { Test } from '@nestjs/testing';
import { ProducersService } from '../producers.service';
import { ProducersController } from '../producers.controller';
import { SaveProducerDto } from '../dto/saveProducer.dto';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Producer } from '@prisma/client';
import { ProducerEntityDto } from 'src/modules/prisma/dto/producer.entity.dto';

describe('ProducersController', () => {
  let producersController: ProducersController;
  let producersService: ProducersService;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [
        {
          provide: ProducersService,
          useValue: {
            createProducer: jest.fn(),
            updateProducer: jest.fn(),
            removeProducer: jest.fn(),
          },
        },
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
      ],
    }).compile();

    producersController =
      testingModule.get<ProducersController>(ProducersController);
    producersService = testingModule.get<ProducersService>(ProducersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Producers controller need to be defined', () => {
    expect(producersController).toBeDefined();
  });

  it('Producers service need to be defined', () => {
    expect(producersService).toBeDefined();
  });

  describe('Create Producer', () => {
    it(`The method createProducer need to throw a BadRequestException when service's method return a BadRequestException`, async () => {
      const createProducerDto: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '00012398755',
      };

      producersService.createProducer = jest
        .fn()
        .mockRejectedValue(
          new BadRequestException(
            'Já existe um produtor cadastrado com este CPF/CNPJ.',
          ),
        );

      const createProducer =
        producersController.createProducer(createProducerDto);
      await expect(createProducer).rejects.toBeInstanceOf(BadRequestException);
      await expect(createProducer).rejects.toThrow(
        'Já existe um produtor cadastrado com este CPF/CNPJ.',
      );
    });

    it(`The method createProducer need to throw a InternalServerErrorException when service's method return a InternalServerErrorException`, async () => {
      const createProducerDto: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '00012398755',
      };

      producersService.createProducer = jest
        .fn()
        .mockRejectedValue(
          new InternalServerErrorException(
            'Não foi possível criar este produtor, tente novamente.',
          ),
        );

      const createProducer =
        producersController.createProducer(createProducerDto);

      await expect(createProducer).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(createProducer).rejects.toThrow(
        'Não foi possível criar este produtor, tente novamente.',
      );
    });

    it(`The method createProducer need to return producer's saved data when the producer's info is valid`, async () => {
      const createProducerDto: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '00012398755',
      };

      const resultCreateProducer = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createProducerDto,
      };

      producersService.createProducer = jest
        .fn()
        .mockResolvedValue(resultCreateProducer);

      const createProducer =
        producersController.createProducer(createProducerDto);

      await expect(createProducer).resolves.toBe(resultCreateProducer);
      await expect(createProducer).resolves.not.toBeInstanceOf(
        BadRequestException,
      );
      await expect(createProducer).resolves.not.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('Update Producer', () => {
    it(`The method updateProducer need to throw a BadRequestException when service's method return a BadRequestException`, async () => {
      const producerId: string = '1';

      const updateProducerDto: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '00012398755',
      };

      producersService.updateProducer = jest
        .fn()
        .mockRejectedValue(
          new BadRequestException(
            'Já existe um produtor cadastrado com este CPF/CNPJ.',
          ),
        );

      const createProducer = producersController.updateProducer(
        updateProducerDto,
        { producerId },
      );

      await expect(createProducer).rejects.toBeInstanceOf(BadRequestException);
      await expect(createProducer).rejects.toThrow(
        'Já existe um produtor cadastrado com este CPF/CNPJ.',
      );
    });

    it(`The method updateProducer need to throw a InternalServerErrorException when service's method return a InternalServerErrorException`, async () => {
      const producerId: string = '1';

      const updateProducerDto: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '00012398755',
      };

      producersService.updateProducer = jest
        .fn()
        .mockRejectedValue(
          new InternalServerErrorException('O produtor informado não existe.'),
        );

      const createProducer = producersController.updateProducer(
        updateProducerDto,
        { producerId },
      );

      await expect(createProducer).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(createProducer).rejects.toThrow(
        'O produtor informado não existe.',
      );
    });

    it(`The method updateProducer need to return producer's saved data when the producer's info is valid`, async () => {
      const producerId: string = '1';

      const updateProducerDto: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '00012398755',
      };

      const resultUpdateProducerDto: Producer = {
        id: Number(producerId),
        fullName: updateProducerDto.fullName,
        document: updateProducerDto.document,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      producersService.updateProducer = jest
        .fn()
        .mockResolvedValue(resultUpdateProducerDto);

      const createProducer = producersController.updateProducer(
        updateProducerDto,
        { producerId },
      );

      await expect(createProducer).resolves.toBe(resultUpdateProducerDto);
      await expect(createProducer).resolves.not.toBeInstanceOf(
        BadRequestException,
      );
      await expect(createProducer).resolves.not.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('Remove Producer', () => {
    it(`The method removeProducer need to throw a BadRequestException when service's method return a BadRequestException`, async () => {
      const producerId: string = '1';

      producersService.removeProducer = jest
        .fn()
        .mockRejectedValue(new BadRequestException());

      const resultRemoveProducer: Promise<ProducerEntityDto> =
        producersController.removeProducer({ producerId });

      await expect(resultRemoveProducer).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultRemoveProducer).rejects.toThrow();
    });

    it(`The method removeProducer need to throw a InternalServerErrorException when service's method return a InternalServerErrorException`, async () => {
      const producerId: string = '1';

      producersService.removeProducer = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const resultRemoveProducer: Promise<ProducerEntityDto> =
        producersController.removeProducer({ producerId });

      await expect(resultRemoveProducer).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultRemoveProducer).rejects.toThrow();
    });

    it(`The method removeProducer need to return producer's saved data when the producer's info is valid`, async () => {
      const producerId: string = '1';

      const resultServiceRemoveProducerEntityDto: Producer = {
        id: Number(producerId),
        fullName: 'Gustavo Egidio Rigoni',
        document: '00012398755',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      producersService.removeProducer = jest
        .fn()
        .mockResolvedValue(resultServiceRemoveProducerEntityDto);

      const resultRemoveProducer: Promise<ProducerEntityDto> =
        producersController.removeProducer({ producerId });

      await expect(resultRemoveProducer).resolves.toBe(
        resultServiceRemoveProducerEntityDto,
      );
      await expect(resultRemoveProducer).resolves.not.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultRemoveProducer).resolves.not.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });
});
