import { Test } from '@nestjs/testing';
import { FarmsService } from '../farms.service';
import { FarmsRepository } from '../farms.repository';
import { Farm, Prisma, Producer } from '@prisma/client';
import { ProducersRepository } from './../../../modules/producers/producers.repository';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from './../../../modules/prisma/prisma.service';
import { FarmEntityDto } from './../../../modules/prisma/dto/farm.entity.dto';
import { SaveFarmCultivationDto } from '../dto/saveFarmCultivation.dto';
import { FarmCultivationEntityDto } from './../../../modules/prisma/dto/farmCultivation.entity.dto';
import { ListFarmsCultivationsDto } from '../dto/listFarmsCultivations.dto';
import { SaveFarmDto } from '../dto/saveFarm.dto';

describe('FarmsService', () => {
  let farmsService: FarmsService;
  let farmsRepository: FarmsRepository;
  let producersRepository: ProducersRepository;

  const producerData: Producer = {
    id: 1,
    fullName: 'Gustavo Egidio Rigoni',
    document: '74311717000190',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const farmsList: Farm[] = [
    {
      id: 1,
      producerId: 1,
      farmName: 'Fazenda Coração do Campo',
      city: 'Tubarão',
      state: 'SC',
      totalArea: new Prisma.Decimal(1000),
      cultivableArea: new Prisma.Decimal(500),
      preservedArea: new Prisma.Decimal(500),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        FarmsService,
        FarmsRepository,
        ProducersRepository,
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

    farmsService = testingModule.get<FarmsService>(FarmsService);
    farmsRepository = testingModule.get<FarmsRepository>(FarmsRepository);
    producersRepository =
      testingModule.get<ProducersRepository>(ProducersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('FarmsService need to be defined', () => {
    expect(farmsService).toBeDefined();
  });

  it('FarmsRepository need to be defined', () => {
    expect(farmsRepository).toBeDefined();
  });

  it('ProducersRepository need to be defined', () => {
    expect(producersRepository).toBeDefined();
  });

  describe('Create farm', () => {
    const mockFarm: Farm = farmsList[0];

    const mockResultFarmCreated: FarmEntityDto = {
      ...mockFarm,
      totalArea: Number(mockFarm.cultivableArea),
      cultivableArea: Number(mockFarm.cultivableArea),
      preservedArea: Number(mockFarm.preservedArea),
    };

    it('The method createFarm need to throw a BadRequestException when producer informed does not exists', async () => {
      const saveFarmDto: SaveFarmDto = {
        farmName: 'Fazenda Coração do Campo',
        producerId: -1,
        city: 'Tubarao',
        state: 'SC',
        totalArea: 1000,
        cultivableArea: 500,
        preservedArea: 500,
      };

      producersRepository.findProducerById = jest.fn().mockResolvedValue(null);

      farmsRepository.createFarm = jest
        .fn()
        .mockResolvedValue(mockResultFarmCreated);

      const resultCreateFarmDto: Promise<FarmEntityDto> =
        farmsService.createFarm(saveFarmDto);

      await expect(resultCreateFarmDto).rejects.toBeDefined();
      await expect(resultCreateFarmDto).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultCreateFarmDto).rejects.toThrow(
        'O produtor informado não existe.',
      );
    });

    it('The method createFarm need to throw a BadRequestException when farm cultivable area plus preservation area is higher than farm total area', async () => {
      const saveFarmDto: SaveFarmDto = {
        farmName: 'Fazenda Coração do Campo',
        producerId: -1,
        city: 'Tubarao',
        state: 'SC',
        totalArea: 1000,
        cultivableArea: 505,
        preservedArea: 499,
      };

      producersRepository.findProducerById = jest.fn().mockResolvedValue({
        id: 1,
        fullName: 'Gustavo Egidio Rigoni',
        document: '74311717000190',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const resultCreateFarmDto: Promise<FarmEntityDto> =
        farmsService.createFarm(saveFarmDto);

      await expect(resultCreateFarmDto).rejects.toBeDefined();
      await expect(resultCreateFarmDto).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultCreateFarmDto).rejects.toThrow(
        'A área em uso não coincide com a área total da propriedade.',
      );
    });

    it('The method createFarm need to throw a InternalServerErrorException due an unexpected error in repository createFarm method', async () => {
      const saveFarmDto: SaveFarmDto = {
        farmName: 'Fazenda Coração do Campo',
        producerId: -1,
        city: 'Tubarao',
        state: 'SC',
        totalArea: 1000,
        cultivableArea: 500,
        preservedArea: 500,
      };

      producersRepository.findProducerById = jest
        .fn()
        .mockResolvedValue(producerData);

      farmsRepository.createFarm = jest.fn().mockRejectedValue(new Error());

      const resultCreateFarmDto: Promise<FarmEntityDto> =
        farmsService.createFarm(saveFarmDto);

      await expect(resultCreateFarmDto).rejects.toBeDefined();
      await expect(resultCreateFarmDto).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultCreateFarmDto).rejects.toThrow(
        'Não foi possível criar esta propriedade, tente novamente.',
      );
    });

    it(`The method createProducer need to return the new farm data when it has been created successfully`, async () => {
      const saveFarmDto: SaveFarmDto = {
        farmName: 'Fazenda Coração do Campo',
        producerId: -1,
        city: 'Tubarao',
        state: 'SC',
        totalArea: 1000,
        cultivableArea: 500,
        preservedArea: 500,
      };

      producersRepository.findProducerById = jest
        .fn()
        .mockResolvedValue(producerData);

      farmsRepository.createFarm = jest
        .fn()
        .mockResolvedValue(mockResultFarmCreated);

      const resultCreateFarmDto: Promise<FarmEntityDto> =
        farmsService.createFarm(saveFarmDto);

      await expect(resultCreateFarmDto).resolves.toBeDefined();
      await expect(resultCreateFarmDto).resolves.toStrictEqual(
        mockResultFarmCreated,
      );
    });
  });

  describe('Crate cultivation', () => {
    const farmData: Farm = farmsList[0];

    const mockResultRepositoryCreateFarmCultivationData: FarmCultivationEntityDto =
      {
        id: 1,
        cultivationName: 'FEIJÃO VERMELHO',
        farmId: 1,
        cultivatedArea: new Prisma.Decimal(56.35).toNumber(),
        harvest: '2022',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

    it('The method createFarmCultivation need to throw a InternalServerErrorException due an unexpected error in repository findFarmById method', async () => {
      const saveFarmCultivationDto: SaveFarmCultivationDto = {
        farmId: 1,
        cultivationName: 'Feijão vermelho',
        cultivatedArea: 56.35,
        harvest: '2022',
      };

      farmsRepository.findFarmById = jest.fn().mockRejectedValue(new Error());

      const resultCreateFarmCultivationData: Promise<FarmCultivationEntityDto> =
        farmsService.createFarmCultivation(saveFarmCultivationDto);

      await expect(resultCreateFarmCultivationData).rejects.toBeDefined();
      await expect(resultCreateFarmCultivationData).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultCreateFarmCultivationData).rejects.toThrow(
        'Não foi possível verificar se a fazenda informada é válido.',
      );
    });

    it('The method createFarmCultivation need to throw a InternalServerErrorException due an unexpected error in repository findCultivatedAreaByFarmId method', async () => {
      const saveFarmCultivationDto: SaveFarmCultivationDto = {
        farmId: 1,
        cultivationName: 'Feijão vermelho',
        cultivatedArea: 56.35,
        harvest: '2022',
      };

      const farmData: Farm = farmsList[0];

      farmsRepository.findFarmById = jest.fn().mockResolvedValue(farmData);
      farmsRepository.findCultivatedAreaByFarmId = jest
        .fn()
        .mockRejectedValue(new Error());

      const resultCreateFarmCultivationData: Promise<FarmCultivationEntityDto> =
        farmsService.createFarmCultivation(saveFarmCultivationDto);

      await expect(resultCreateFarmCultivationData).rejects.toBeDefined();
      await expect(resultCreateFarmCultivationData).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultCreateFarmCultivationData).rejects.toThrow(
        'Não foi possível verificar a área usada é válido.',
      );
    });

    it('The method createFarmCultivation need to throw a BadRequestException when not exists a farm with informed farmId data', async () => {
      const saveFarmCultivationDto: SaveFarmCultivationDto = {
        farmId: 1,
        cultivationName: 'Feijão vermelho',
        cultivatedArea: 56.35,
        harvest: '2022',
      };

      farmsRepository.findFarmById = jest.fn().mockResolvedValue(null);
      farmsRepository.findCultivatedAreaByFarmId = jest
        .fn()
        .mockResolvedValue(new Prisma.Decimal(300));

      const resultCreateFarmCultivationData: Promise<FarmCultivationEntityDto> =
        farmsService.createFarmCultivation(saveFarmCultivationDto);

      await expect(resultCreateFarmCultivationData).rejects.toBeDefined();
      await expect(resultCreateFarmCultivationData).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultCreateFarmCultivationData).rejects.toThrow(
        'A propriedade informada não existe.',
      );
    });

    it('The method createFarmCultivation need to throw a BadRequestException when cultivable area is less than new cultivation used area', async () => {
      const saveFarmCultivationDto: SaveFarmCultivationDto = {
        farmId: 1,
        cultivationName: 'Feijão vermelho',
        cultivatedArea: 99999,
        harvest: '2022',
      };

      farmsRepository.findFarmById = jest.fn().mockResolvedValue(farmData);
      farmsRepository.findCultivatedAreaByFarmId = jest
        .fn()
        .mockResolvedValue(new Prisma.Decimal(0));

      const resultCreateFarmCultivationData: Promise<FarmCultivationEntityDto> =
        farmsService.createFarmCultivation(saveFarmCultivationDto);

      await expect(resultCreateFarmCultivationData).rejects.toBeDefined();
      await expect(resultCreateFarmCultivationData).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultCreateFarmCultivationData).rejects.toThrow(
        'A propriedade não possui esta área para cultivo.',
      );
    });

    it('The method createFarmCultivation need to return the new cultivation data when it has been created successfully', async () => {
      const saveFarmCultivationDto: SaveFarmCultivationDto = {
        farmId: 1,
        cultivationName: 'Feijão vermelho',
        cultivatedArea: 56.35,
        harvest: '2022',
      };

      farmsRepository.findFarmById = jest.fn().mockResolvedValue(farmData);
      farmsRepository.findCultivatedAreaByFarmId = jest
        .fn()
        .mockResolvedValue(new Prisma.Decimal(0));

      farmsRepository.createFarmCultivation = jest
        .fn()
        .mockResolvedValue(mockResultRepositoryCreateFarmCultivationData);

      const resultCreateFarmCultivationData: Promise<FarmCultivationEntityDto> =
        farmsService.createFarmCultivation(saveFarmCultivationDto);

      await expect(resultCreateFarmCultivationData).resolves.toBeDefined();
      await expect(resultCreateFarmCultivationData).resolves.toStrictEqual(
        mockResultRepositoryCreateFarmCultivationData,
      );
    });
  });

  describe('List farms statistics', () => {
    const resultCountFarms: number = 1;
    const resultCountFarmsByState: Record<string, number>[] = [{ SP: 1 }];
    const resultCountFarmsCultivations: Record<string, number>[] = [
      {
        'FEIJÃO VERMELHO': 1,
      },
    ];
    const resultSumFarmsTotalArea: number = 1000;
    const resultSumFarmsCultivableAndPreservationAreas: Pick<
      Prisma.FarmSumAggregateOutputType,
      'cultivableArea' | 'preservedArea'
    > = {
      cultivableArea: new Prisma.Decimal(500),
      preservedArea: new Prisma.Decimal(500),
    };

    it('The method listFarmsCultivationsStatistics need to throw a InternalServerErrorException due an unexpected error in repository countFarms method', async () => {
      farmsRepository.countFarmsByState = jest
        .fn()
        .mockResolvedValue(resultCountFarmsByState);

      farmsRepository.countFarmsCultivations = jest
        .fn()
        .mockResolvedValue(resultCountFarmsCultivations);

      farmsRepository.sumFarmsTotalArea = jest
        .fn()
        .mockResolvedValue(resultSumFarmsTotalArea);

      farmsRepository.sumFarmsCultivableAndPreservationAreas = jest
        .fn()
        .mockResolvedValue(resultSumFarmsCultivableAndPreservationAreas);

      farmsRepository.countFarms = jest.fn().mockRejectedValue(new Error());

      const resultListFarmsStatistics: Promise<ListFarmsCultivationsDto> =
        farmsService.listFarmsCultivationsStatistics();

      await expect(resultListFarmsStatistics).rejects.toBeDefined();
      await expect(resultListFarmsStatistics).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultListFarmsStatistics).rejects.toThrow(
        'Ocorreu um erro ao tentar contabilizar as propriedades criadas.',
      );
    });

    it('The method listFarmsCultivationsStatistics need to throw a InternalServerErrorException due an unexpected error in repository countFarmsByState method', async () => {
      farmsRepository.countFarms = jest
        .fn()
        .mockResolvedValue(resultCountFarms);

      farmsRepository.countFarmsCultivations = jest
        .fn()
        .mockResolvedValue(resultCountFarmsCultivations);

      farmsRepository.sumFarmsTotalArea = jest
        .fn()
        .mockResolvedValue(resultSumFarmsTotalArea);

      farmsRepository.sumFarmsCultivableAndPreservationAreas = jest
        .fn()
        .mockResolvedValue(resultSumFarmsCultivableAndPreservationAreas);

      farmsRepository.countFarmsByState = jest
        .fn()
        .mockRejectedValue(new Error());

      const resultListFarmsStatistics: Promise<ListFarmsCultivationsDto> =
        farmsService.listFarmsCultivationsStatistics();

      await expect(resultListFarmsStatistics).rejects.toBeDefined();
      await expect(resultListFarmsStatistics).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultListFarmsStatistics).rejects.toThrow(
        'Ocorreu um erro ao tentar contabilizar as propriedades criadas por estados.',
      );
    });

    it('The method listFarmsCultivationsStatistics need to throw a InternalServerErrorException due an unexpected error in repository countFarmsCultivations method', async () => {
      farmsRepository.countFarms = jest
        .fn()
        .mockResolvedValue(resultCountFarms);

      farmsRepository.countFarmsByState = jest
        .fn()
        .mockResolvedValue(resultCountFarmsByState);

      farmsRepository.sumFarmsTotalArea = jest
        .fn()
        .mockResolvedValue(resultSumFarmsTotalArea);

      farmsRepository.sumFarmsCultivableAndPreservationAreas = jest
        .fn()
        .mockResolvedValue(resultSumFarmsCultivableAndPreservationAreas);

      farmsRepository.countFarmsCultivations = jest
        .fn()
        .mockRejectedValue(new Error());

      const resultListFarmsStatistics: Promise<ListFarmsCultivationsDto> =
        farmsService.listFarmsCultivationsStatistics();

      await expect(resultListFarmsStatistics).rejects.toBeDefined();
      await expect(resultListFarmsStatistics).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultListFarmsStatistics).rejects.toThrow(
        'Ocorreu um erro ao tentar contabilizar as culturas de cultivo.',
      );
    });

    it('The method listFarmsCultivationsStatistics need to throw a InternalServerErrorException due an unexpected error in repository sumFarmsTotalArea method', async () => {
      farmsRepository.countFarms = jest
        .fn()
        .mockResolvedValue(resultCountFarms);

      farmsRepository.countFarmsByState = jest
        .fn()
        .mockResolvedValue(resultCountFarmsByState);

      farmsRepository.countFarmsCultivations = jest
        .fn()
        .mockResolvedValue(resultCountFarmsCultivations);

      farmsRepository.sumFarmsCultivableAndPreservationAreas = jest
        .fn()
        .mockResolvedValue(resultSumFarmsCultivableAndPreservationAreas);

      farmsRepository.sumFarmsTotalArea = jest
        .fn()
        .mockRejectedValue(new Error());

      const resultListFarmsStatistics: Promise<ListFarmsCultivationsDto> =
        farmsService.listFarmsCultivationsStatistics();

      await expect(resultListFarmsStatistics).rejects.toBeDefined();
      await expect(resultListFarmsStatistics).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultListFarmsStatistics).rejects.toThrow(
        'Ocorreu um erro ao tentar contabilizar área total das propriedades criadas.',
      );
    });

    it('The method listFarmsCultivationsStatistics need to throw a InternalServerErrorException due an unexpected error in repository sumFarmsCultivableAndPreservationAreas method', async () => {
      farmsRepository.countFarms = jest
        .fn()
        .mockResolvedValue(resultCountFarms);

      farmsRepository.countFarmsByState = jest
        .fn()
        .mockResolvedValue(resultCountFarmsByState);

      farmsRepository.countFarmsCultivations = jest
        .fn()
        .mockResolvedValue(resultCountFarmsCultivations);

      farmsRepository.sumFarmsTotalArea = jest
        .fn()
        .mockResolvedValue(resultSumFarmsTotalArea);

      farmsRepository.sumFarmsCultivableAndPreservationAreas = jest
        .fn()
        .mockRejectedValue(new Error());

      const resultListFarmsStatistics: Promise<ListFarmsCultivationsDto> =
        farmsService.listFarmsCultivationsStatistics();

      await expect(resultListFarmsStatistics).rejects.toBeDefined();
      await expect(resultListFarmsStatistics).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultListFarmsStatistics).rejects.toThrow(
        'Ocorreu um erro ao tentar contabilizar as áreas de cultivo e preservação das propriedades.',
      );
    });

    it('The method listFarmsCultivationsStatistics need to return a valid statistic object when it has been created successfully', async () => {
      farmsRepository.countFarms = jest
        .fn()
        .mockResolvedValue(resultCountFarms);

      farmsRepository.countFarmsByState = jest
        .fn()
        .mockResolvedValue(resultCountFarmsByState);

      farmsRepository.countFarmsCultivations = jest
        .fn()
        .mockResolvedValue(resultCountFarmsCultivations);

      farmsRepository.sumFarmsTotalArea = jest
        .fn()
        .mockResolvedValue(resultSumFarmsTotalArea);

      farmsRepository.sumFarmsCultivableAndPreservationAreas = jest
        .fn()
        .mockResolvedValue(resultSumFarmsCultivableAndPreservationAreas);

      const mockResultListFarmsStatistics: ListFarmsCultivationsDto = {
        totalFarmsCount: resultCountFarms,
        totalFarmsCountByState: resultCountFarmsByState,
        totalFarmsCountCultivations: resultCountFarmsCultivations,
        totalFarmsSumCultivableAreas: Number(
          resultSumFarmsCultivableAndPreservationAreas.cultivableArea,
        ),
        totalFarmsSumPreservationAreas: Number(
          resultSumFarmsCultivableAndPreservationAreas.preservedArea,
        ),
        totalFarmsSumTotalAreas: resultSumFarmsTotalArea,
      };

      const resultListFarmsStatistics: Promise<ListFarmsCultivationsDto> =
        farmsService.listFarmsCultivationsStatistics();

      await expect(resultListFarmsStatistics).resolves.toBeDefined();
      await expect(resultListFarmsStatistics).resolves.toStrictEqual(
        mockResultListFarmsStatistics,
      );
    });
  });
});
