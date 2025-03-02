import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { FarmsRepository } from '../farms.repository';
import { SaveFarmDto } from './../dto/saveFarm.dto';
import { Farm, FarmCultivation, Prisma } from '@prisma/client';
import { FarmEntityDto } from 'src/modules/prisma/dto/farm.entity.dto';
import { FarmCultivationEntityDto } from 'src/modules/prisma/dto/farmCultivation.entity.dto';
import { SaveFarmCultivationDto } from '../dto/saveFarmCultivation.dto';

describe('FarmsRepository', () => {
  let prismaService: PrismaService;
  let farmsRepository: FarmsRepository;

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

  const mockFindFarmById = (farmId: number): Farm | null => {
    const farmData = farmsList.find((farm) => farm.id === farmId);

    if (!farmData) {
      return null;
    }

    return farmData;
  };

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [PrismaService, FarmsRepository],
    }).compile();

    prismaService = testingModule.get<PrismaService>(PrismaService);
    farmsRepository = testingModule.get<FarmsRepository>(FarmsRepository);
  });

  it('PrismaService need to be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('FarmsRepository need to be defined', () => {
    expect(farmsRepository).toBeDefined();
  });

  describe('Create farm', () => {
    it(`The method createFarm need to return a valid farm data when it has been created successfully`, async () => {
      const saveFarmDto: SaveFarmDto = {
        producerId: 1,
        farmName: 'Fazenda Coração do Campo',
        city: 'Tubarão',
        state: 'SC',
        totalArea: 1000,
        cultivableArea: 500,
        preservedArea: 500,
      };

      const mockFarmCreateData: FarmEntityDto = {
        ...farmsList[0],
        totalArea: Number(farmsList[0].totalArea),
        cultivableArea: Number(farmsList[0].cultivableArea),
        preservedArea: Number(farmsList[0].preservedArea),
      };

      const farmData: Farm = farmsList[0];

      prismaService.farm.create = jest.fn().mockResolvedValue(farmData);

      const resultFarmCreateData = farmsRepository.createFarm(saveFarmDto);

      await expect(resultFarmCreateData).resolves.toBeDefined();
      await expect(resultFarmCreateData).resolves.toStrictEqual(
        mockFarmCreateData,
      );
    });

    it(`The method createFarm need to throw an error due Prisma thrown an error`, async () => {
      const saveFarmDto: SaveFarmDto = {
        producerId: 1,
        farmName: 'Fazenda Coração do Campo',
        city: 'Tubarão',
        state: 'SC',
        totalArea: 1000,
        cultivableArea: 500,
        preservedArea: 500,
      };

      prismaService.farm.create = jest.fn().mockRejectedValue(new Error());

      const resultFarmCreateData = farmsRepository.createFarm(saveFarmDto);

      await expect(resultFarmCreateData).rejects.toBeDefined();
      await expect(resultFarmCreateData).rejects.toThrow();
    });
  });

  describe('Find farm by id', () => {
    it(`The method findFarmById need to return a valid farm data when it has been found successfully`, async () => {
      const farmId: number = 1;

      const mockFindFarmData = mockFindFarmById(farmId) as Farm;

      const resultFindFarmDataMock: FarmEntityDto = {
        ...mockFindFarmData,
        totalArea: Number(mockFindFarmData.totalArea),
        cultivableArea: Number(mockFindFarmData.cultivableArea),
        preservedArea: Number(mockFindFarmData.preservedArea),
      };

      jest
        .spyOn(prismaService.farm, 'findUnique')
        .mockResolvedValue(mockFindFarmData);

      const resultFindFarmData: Promise<FarmEntityDto | null> =
        farmsRepository.findFarmById(farmId);

      await expect(resultFindFarmData).resolves.toBeDefined();
      await expect(resultFindFarmData).resolves.toStrictEqual(
        resultFindFarmDataMock,
      );
    });

    it(`The method findFarmById need to return null when it has been found successfully`, async () => {
      const farmId: number = -1;

      const mockFindFarmData = mockFindFarmById(farmId) as Farm;

      jest
        .spyOn(prismaService.farm, 'findUnique')
        .mockResolvedValue(mockFindFarmData);

      const resultFindFarmData: Promise<FarmEntityDto | null> =
        farmsRepository.findFarmById(farmId);

      await expect(resultFindFarmData).resolves.toBeDefined();
      await expect(resultFindFarmData).resolves.toBeNull();
    });

    it(`The method findFarmById need to throw an error due Prisma thrown an error`, async () => {
      const farmId: number = -1;

      jest
        .spyOn(prismaService.farm, 'findUnique')
        .mockRejectedValue(new Error());

      const resultFindFarmData: Promise<FarmEntityDto | null> =
        farmsRepository.findFarmById(farmId);

      await expect(resultFindFarmData).rejects.toBeDefined();
      await expect(resultFindFarmData).rejects.toThrow();
    });
  });

  describe(`Find farm's cultivable area by id`, () => {
    it(`The method findCultivatedAreaByFarmId need to return a valid farm data when it has been found successfully`, async () => {
      const farmId: number = 1;

      const mockResultSumFarmData = [
        { _sum: { cultivatedArea: new Prisma.Decimal(208.33) } },
      ];

      prismaService.farmCultivation.groupBy = jest
        .fn()
        .mockResolvedValue(mockResultSumFarmData);

      const resultSumFarmData =
        farmsRepository.findCultivatedAreaByFarmId(farmId);

      await expect(resultSumFarmData).resolves.toBeDefined();
      await expect(resultSumFarmData).resolves.toStrictEqual(
        new Prisma.Decimal(208.33),
      );
    });

    it(`The method findCultivatedAreaByFarmId need to throw an error due Prisma thrown an error`, async () => {
      const farmId: number = -1;

      jest
        .spyOn(prismaService.farmCultivation, 'groupBy')
        .mockRejectedValue(new Error());

      const resultSumFarmData: Promise<Prisma.Decimal> =
        farmsRepository.findCultivatedAreaByFarmId(farmId);

      await expect(resultSumFarmData).rejects.toBeDefined();
      await expect(resultSumFarmData).rejects.toThrow();
    });
  });

  describe(`Create cultivation`, () => {
    it(`The method createFarmCultivation need to return a valid farm's cultivation data when it has been found successfully`, async () => {
      const saveFarmCultivationDto: SaveFarmCultivationDto = {
        cultivationName: 'Feijão vermelho',
        farmId: 1,
        cultivatedArea: 3000,
        harvest: '2022',
      };

      const mockResultSumFarmData: FarmCultivation = {
        ...saveFarmCultivationDto,
        id: 1,
        cultivatedArea: new Prisma.Decimal(
          saveFarmCultivationDto.cultivatedArea,
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const resultSumFarmData: FarmCultivationEntityDto = {
        ...mockResultSumFarmData,
        cultivatedArea: Number(mockResultSumFarmData.cultivatedArea),
      };

      jest
        .spyOn(prismaService.farmCultivation, 'create')
        .mockResolvedValue(mockResultSumFarmData);

      const resultCreateFarmCultivationData =
        farmsRepository.createFarmCultivation(saveFarmCultivationDto);

      await expect(resultCreateFarmCultivationData).resolves.toBeDefined();
      await expect(resultCreateFarmCultivationData).resolves.toStrictEqual(
        resultSumFarmData,
      );
    });

    it(`The method createFarmCultivation need to throw an error due Prisma thrown an error`, async () => {
      const saveFarmCultivationDto: SaveFarmCultivationDto = {
        cultivationName: 'Feijão vermelho',
        farmId: 1,
        cultivatedArea: 3000,
        harvest: '2022',
      };

      jest
        .spyOn(prismaService.farmCultivation, 'create')
        .mockRejectedValue(new Error());

      const resultFarmCreateData: Promise<FarmCultivationEntityDto> =
        farmsRepository.createFarmCultivation(saveFarmCultivationDto);

      await expect(resultFarmCreateData).rejects.toBeDefined();
      await expect(resultFarmCreateData).rejects.toThrow();
    });
  });

  describe(`Count farm total rows`, () => {
    it(`The method countFarms need to return a number of total farm rows`, async () => {
      const mockResultCountFarmData: number = 0;

      jest
        .spyOn(prismaService.farm, 'count')
        .mockResolvedValue(mockResultCountFarmData);

      const resultCountFarmData: Promise<number> = farmsRepository.countFarms();

      await expect(resultCountFarmData).resolves.toBeDefined();
      await expect(resultCountFarmData).resolves.toStrictEqual(
        mockResultCountFarmData,
      );
    });

    it(`The method countFarms need to throw an error due Prisma thrown an error`, async () => {
      prismaService.farm.count = jest.fn().mockRejectedValue(new Error());

      const resultCountFarmData: Promise<number> = farmsRepository.countFarms();

      await expect(resultCountFarmData).rejects.toBeDefined();
      await expect(resultCountFarmData).rejects.toThrow();
    });
  });

  describe(`Sum farm rows total area`, () => {
    it(`The method sumFarmsTotalArea need to return a number of sum of total area of all rows`, async () => {
      const mockResultSumFarmTotalAreaData: Prisma.Decimal = new Prisma.Decimal(
        208.33,
      );

      const mockResultPrismaSumFarmTotalAreaData = {
        _sum: { totalArea: new Prisma.Decimal(208.33) },
      };

      prismaService.farm.aggregate = jest
        .fn()
        .mockResolvedValue(mockResultPrismaSumFarmTotalAreaData);

      const resultSumFarmTotalAreaData: Promise<Prisma.Decimal | null> =
        farmsRepository.sumFarmsTotalArea();

      await expect(resultSumFarmTotalAreaData).resolves.toBeDefined();
      await expect(resultSumFarmTotalAreaData).resolves.toStrictEqual(
        mockResultSumFarmTotalAreaData,
      );
    });

    it(`The method sumFarmsTotalArea need to throw an error due Prisma thrown an error`, async () => {
      jest
        .spyOn(prismaService.farm, 'aggregate')
        .mockRejectedValue(new Error());

      const resultCountFarmData = farmsRepository.sumFarmsTotalArea();

      await expect(resultCountFarmData).rejects.toBeDefined();
      await expect(resultCountFarmData).rejects.toThrow();
    });
  });

  describe(`Count farms rows by state`, () => {
    it(`The method countFarmsByState need to return a number of total farm rows by state`, async () => {
      const mockResultSumFarmTotalAreaData: Record<string, number>[] = [
        {
          SP: 1,
        },
      ];

      const mockResultPrismaSumFarmTotalAreaData = [
        {
          state: 'SP',
          _count: { id: 1 },
        },
      ];

      prismaService.farm.groupBy = jest
        .fn()
        .mockResolvedValue(mockResultPrismaSumFarmTotalAreaData);

      const resultSumFarmTotalAreaData: Promise<Record<string, number>[]> =
        farmsRepository.countFarmsByState();

      await expect(resultSumFarmTotalAreaData).resolves.toBeDefined();
      await expect(resultSumFarmTotalAreaData).resolves.toEqual(
        mockResultSumFarmTotalAreaData,
      );
    });

    it(`The method countFarmsByState need to throw an error due Prisma thrown an error`, async () => {
      prismaService.farm.groupBy = jest.fn().mockRejectedValue(new Error());

      const resultCountFarmData = farmsRepository.countFarmsByState();

      await expect(resultCountFarmData).rejects.toBeDefined();
      await expect(resultCountFarmData).rejects.toThrow();
    });
  });

  describe(`Count farms total cultivations rows`, () => {
    it(`The method countFarmsCultivations need to return a number of total cultivation rows`, async () => {
      const mockResultCountFarmCultivationData: Record<string, number>[] = [
        {
          'Feijão vermelho': 1,
        },
      ];

      const mockResultPrismaCountFarmCultivationData = [
        {
          cultivationName: 'Feijão vermelho',
          _count: { id: 1 },
        },
      ];

      prismaService.farmCultivation.groupBy = jest
        .fn()
        .mockResolvedValue(mockResultPrismaCountFarmCultivationData);

      const resultCountFarmCultivationData: Promise<Record<string, number>[]> =
        farmsRepository.countFarmsCultivations();

      await expect(resultCountFarmCultivationData).resolves.toBeDefined();
      await expect(resultCountFarmCultivationData).resolves.toEqual(
        mockResultCountFarmCultivationData,
      );
    });

    it(`The method countFarmsCultivations need to throw an error due Prisma thrown an error`, async () => {
      jest
        .spyOn(prismaService.farmCultivation, 'groupBy')
        .mockRejectedValue(new Error());

      const resultCountFarmCultivationData =
        farmsRepository.countFarmsCultivations();

      await expect(resultCountFarmCultivationData).rejects.toBeDefined();
      await expect(resultCountFarmCultivationData).rejects.toThrow();
    });
  });

  describe(`Sum farms rows cultivable areas and preservation areas`, () => {
    it(`The method sumFarmsCultivableAndPreservationAreas need to return a valid object`, async () => {
      const mockResultPrismaCountFarmCultivationData = {
        _sum: {
          cultivableArea: new Prisma.Decimal(10),
          preservedArea: new Prisma.Decimal(20),
        },
      };

      const mockResultCountFarmCultivationData: Pick<
        Prisma.FarmSumAggregateOutputType,
        'cultivableArea' | 'preservedArea'
      > = {
        cultivableArea: new Prisma.Decimal(10),
        preservedArea: new Prisma.Decimal(20),
      };

      prismaService.farm.aggregate = jest
        .fn()
        .mockResolvedValue(mockResultPrismaCountFarmCultivationData);

      const resultSumFarmsCultivableAndPreservationAreaData: Promise<
        Pick<
          Prisma.FarmSumAggregateOutputType,
          'cultivableArea' | 'preservedArea'
        >
      > = farmsRepository.sumFarmsCultivableAndPreservationAreas();

      await expect(
        resultSumFarmsCultivableAndPreservationAreaData,
      ).resolves.toBeDefined();
      await expect(
        resultSumFarmsCultivableAndPreservationAreaData,
      ).resolves.toEqual(mockResultCountFarmCultivationData);
    });

    it(`The method sumFarmsCultivableAndPreservationAreas need to throw an error due Prisma thrown an error`, async () => {
      jest
        .spyOn(prismaService.farm, 'aggregate')
        .mockRejectedValue(new Error());

      const resultSumFarmsCultivableAndPreservationAreaData =
        farmsRepository.sumFarmsCultivableAndPreservationAreas();

      await expect(
        resultSumFarmsCultivableAndPreservationAreaData,
      ).rejects.toBeDefined();
      await expect(
        resultSumFarmsCultivableAndPreservationAreaData,
      ).rejects.toThrow();
    });
  });
});
