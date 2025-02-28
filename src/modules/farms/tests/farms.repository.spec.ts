import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { FarmsRepository } from '../farms.repository';
import { SaveFarmDto } from './../dto/saveFarm.dto';
import { Farm, Prisma } from '@prisma/client';
import { FarmEntityDto } from 'src/modules/prisma/dto/farm.entity.dto';

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

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [PrismaService, FarmsRepository],
    }).compile();

    prismaService = testingModule.get<PrismaService>(PrismaService);
    farmsRepository = testingModule.get<FarmsRepository>(FarmsRepository);
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

      const farmCreateResult: FarmEntityDto = {
        ...farmsList[0],
        totalArea: Number(farmsList[0].totalArea),
        cultivableArea: Number(farmsList[0].cultivableArea),
        preservedArea: Number(farmsList[0].preservedArea),
      };

      jest.spyOn(prismaService.farm, 'create').mockResolvedValue(farmsList[0]);

      const farmData = farmsRepository.createFarm(saveFarmDto);

      await expect(farmData).resolves.toBeDefined();
      await expect(farmData).resolves.toStrictEqual(farmCreateResult);
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

      jest.spyOn(prismaService.farm, 'create').mockRejectedValue(new Error());

      const farmData = farmsRepository.createFarm(saveFarmDto);

      await expect(farmData).rejects.toBeDefined();
      await expect(farmData).rejects.toThrow();
    });
  });

  describe('Find farm by id', () => {
    it(`The method findFarmById need to return a valid farm data when it has been found successfully`, async () => {
      const farmId: number = 1;

      const mockResultFindFarmData = mockFindFarmById(farmId) as Farm;

      jest
        .spyOn(prismaService.farm, 'findUnique')
        .mockResolvedValue(mockResultFindFarmData);

      const farmData: Promise<FarmEntityDto | null> =
        farmsRepository.findFarmById(farmId);

      const resultFindFarmData: FarmEntityDto = {
        ...mockResultFindFarmData,
        totalArea: Number(mockResultFindFarmData.totalArea),
        cultivableArea: Number(mockResultFindFarmData.cultivableArea),
        preservedArea: Number(mockResultFindFarmData.preservedArea),
      };

      await expect(farmData).resolves.toBeDefined();
      await expect(farmData).resolves.toStrictEqual(resultFindFarmData);
    });

    it(`The method findFarmById need to return null when it has been found successfully`, async () => {
      const farmId: number = -1;

      const mockResultFindFarmData = mockFindFarmById(farmId);

      jest
        .spyOn(prismaService.farm, 'findUnique')
        .mockResolvedValue(mockResultFindFarmData);

      const farmData: Promise<FarmEntityDto | null> =
        farmsRepository.findFarmById(farmId);

      await expect(farmData).resolves.toBeDefined();
      await expect(farmData).resolves.toBeNull();
    });

    it(`The method findFarmById need to throw an error due Prisma thrown an error`, async () => {
      const farmId: number = -1;

      jest.spyOn(prismaService.farm, 'findUnique').mockImplementation(() => {
        throw new Error();
      });

      const farmData: Promise<FarmEntityDto | null> =
        farmsRepository.findFarmById(farmId);

      await expect(farmData).rejects.toBeDefined();
      await expect(farmData).rejects.toThrow();
    });
  });

  describe(`Find farm's cultivable area by id`, () => {
    it(`The method findCultivatedAreaByFarmId need to return a valid farm data when it has been found successfully`, async () => {
      const farmId: number = 1;

      const mockResultSumFarmData = [
        { _sum: { cultivatedArea: new Prisma.Decimal(208.33) } },
      ];

      const resultSumFarmData: Prisma.Decimal = new Prisma.Decimal(208.33);

      prismaService.farmCultivation.groupBy = jest
        .fn()
        .mockResolvedValue(mockResultSumFarmData);

      const result = farmsRepository.findCultivatedAreaByFarmId(farmId);

      await expect(result).resolves.toBeDefined();
      await expect(result).resolves.toStrictEqual(resultSumFarmData);
    });

    it(`The method findCultivatedAreaByFarmId need to throw an error due Prisma thrown an error`, async () => {
      const farmId: number = -1;

      jest
        .spyOn(prismaService.farmCultivation, 'groupBy')
        .mockImplementation(() => {
          throw new Error();
        });

      const farmData: Promise<Prisma.Decimal> =
        farmsRepository.findCultivatedAreaByFarmId(farmId);

      await expect(farmData).rejects.toBeDefined();
      await expect(farmData).rejects.toThrow();
    });
  });
});
