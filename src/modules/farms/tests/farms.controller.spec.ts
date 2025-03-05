import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FarmsController } from '../farms.controller';
import { FarmsService } from '../farms.service';
import { SaveFarmDto } from '../dto/saveFarm.dto';
import { FarmEntityDto } from './../../../modules/prisma/dto/farm.entity.dto';
import { SaveFarmCultivationDto } from '../dto/saveFarmCultivation.dto';
import { ListFarmsCultivationsDto } from '../dto/listFarmsCultivations.dto';
import { FarmCultivationEntityDto } from './../../../modules/prisma/dto/farmCultivation.entity.dto';

describe('FarmsController', () => {
  let farmsController: FarmsController;
  let farmsService: FarmsService;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [FarmsController],
      providers: [
        {
          provide: FarmsService,
          useValue: {
            createProducer: jest.fn(),
            createFarmCultivation: jest.fn(),
            listFarmsCultivationsStatistics: jest.fn(),
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

    farmsController = testingModule.get<FarmsController>(FarmsController);
    farmsService = testingModule.get<FarmsService>(FarmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Farms controller need to be defined', () => {
    expect(farmsController).toBeDefined();
  });

  it('Logger need to be defined', () => {
    expect(Logger).toBeDefined();
  });

  describe(`Create Farm`, () => {
    it(`The method createFarm need to throw a BadRequestException when service's method return a BadRequestException`, async () => {
      const saveFarmDto = new SaveFarmDto();

      farmsService.createFarm = jest
        .fn()
        .mockRejectedValue(new BadRequestException());

      const resultFarmsController = farmsController.createFarm(saveFarmDto);

      await expect(resultFarmsController).rejects.toBeDefined();
      await expect(resultFarmsController).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultFarmsController).rejects.toThrow();
    });

    it(`The method createFarm need to throw a InternalServerErrorException when service's method return a InternalServerErrorException`, async () => {
      const saveFarmDto = new SaveFarmDto();

      farmsService.createFarm = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const resultFarmsController = farmsController.createFarm(saveFarmDto);

      await expect(resultFarmsController).rejects.toBeDefined();
      await expect(resultFarmsController).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultFarmsController).rejects.toThrow();
    });

    it(`The method createFarm need to return farms's saved data when it is created successfully`, async () => {
      const saveFarmDto = new SaveFarmDto();
      const farmEntityDto = new FarmEntityDto();

      farmsService.createFarm = jest
        .fn()
        .mockResolvedValue(new FarmEntityDto());

      const resultFarmsController = farmsController.createFarm(saveFarmDto);

      await expect(resultFarmsController).resolves.toBeDefined();
      await expect(resultFarmsController).resolves.toStrictEqual(farmEntityDto);
    });
  });

  describe(`Create Farm Cultivation`, () => {
    it(`The method createFarmCultivation need to throw a BadRequestException when service's method return a BadRequestException`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      farmsService.createFarmCultivation = jest
        .fn()
        .mockRejectedValue(new BadRequestException());

      const resultFarmsController = farmsController.createFarmCultivation(
        saveFarmCultivationDto,
      );

      await expect(resultFarmsController).rejects.toBeDefined();
      await expect(resultFarmsController).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultFarmsController).rejects.toThrow();
    });

    it(`The method createFarmCultivation need to throw a InternalServerErrorException when service's method return a InternalServerErrorException`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      farmsService.createFarmCultivation = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const resultFarmsController = farmsController.createFarmCultivation(
        saveFarmCultivationDto,
      );

      await expect(resultFarmsController).rejects.toBeDefined();
      await expect(resultFarmsController).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultFarmsController).rejects.toThrow();
    });

    it(`The method createFarmCultivation need to return farms's saved data when it is created successfully`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();
      const farmCultivationEntityDto = new FarmCultivationEntityDto();

      farmsService.createFarmCultivation = jest
        .fn()
        .mockResolvedValue(new FarmCultivationEntityDto());

      const resultFarmsController = farmsController.createFarmCultivation(
        saveFarmCultivationDto,
      );

      await expect(resultFarmsController).resolves.toBeDefined();
      await expect(resultFarmsController).resolves.toStrictEqual(
        farmCultivationEntityDto,
      );
    });
  });

  describe(`List Farms Statistics`, () => {
    it(`The method listFarmsCultivationsStatistics need to throw a BadRequestException when service's method return a BadRequestException`, async () => {
      farmsService.listFarmsCultivationsStatistics = jest
        .fn()
        .mockRejectedValue(new BadRequestException());

      const resultFarmsController =
        farmsController.listFarmsCultivationsStatistics();

      await expect(resultFarmsController).rejects.toBeDefined();
      await expect(resultFarmsController).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(resultFarmsController).rejects.toThrow();
    });

    it(`The method listFarmsCultivationsStatistics need to throw a InternalServerErrorException when service's method return a InternalServerErrorException`, async () => {
      farmsService.listFarmsCultivationsStatistics = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const resultFarmsController =
        farmsController.listFarmsCultivationsStatistics();

      await expect(resultFarmsController).rejects.toBeDefined();
      await expect(resultFarmsController).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(resultFarmsController).rejects.toThrow();
    });

    it(`The method listFarmsCultivationsStatistics need to return farms statistics when operation ocurred successfully`, async () => {
      const farmCultivationEntityDto = new ListFarmsCultivationsDto();

      farmsService.listFarmsCultivationsStatistics = jest
        .fn()
        .mockResolvedValue(new ListFarmsCultivationsDto());

      const resultFarmsController =
        farmsController.listFarmsCultivationsStatistics();

      await expect(resultFarmsController).resolves.toBeDefined();
      await expect(resultFarmsController).resolves.toStrictEqual(
        farmCultivationEntityDto,
      );
    });
  });
});
