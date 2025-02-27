import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProducersRepository } from '../producers/producers.repository';
import { SaveFarmDto } from './dto/saveFarm.dto';
import { Prisma, Farm, FarmCultivation } from '@prisma/client';
import { FarmsRepository } from './farms.repository';
import { SaveFarmCultivationDto } from './dto/saveFarmCultivation.dto';
import { ListFarmsCultivations } from './dto/listFarmsCultivations.dto';

@Injectable()
export class FarmsService {
  constructor(
    private producersRepository: ProducersRepository,
    private farmsRepository: FarmsRepository,
    private readonly logger: Logger = new Logger(FarmsService.name),
  ) {}

  async createFarm({
    farmName,
    producerId,
    city,
    state,
    totalArea,
    cultivableArea,
    preservedArea,
  }: SaveFarmDto): Promise<Farm> {
    const producersExists =
      await this.producersRepository.findProducerById(producerId);

    if (!producersExists) {
      throw new BadRequestException('O produtor informado não existe.');
    }

    const sumCultivableAreaAndPreserverdArea = new Prisma.Decimal(
      cultivableArea,
    ).plus(new Prisma.Decimal(preservedArea));

    const areaTotalIsLessThaSumCultivableAreaAndPreserverdArea =
      new Prisma.Decimal(sumCultivableAreaAndPreserverdArea).greaterThan(
        totalArea,
      );

    if (areaTotalIsLessThaSumCultivableAreaAndPreserverdArea) {
      throw new BadRequestException(
        'A área em uso não coincide com a área total da propriedade.',
      );
    }

    const createFarm = await this.farmsRepository
      .createFarm({
        farmName,
        producerId,
        city,
        state,
        totalArea,
        cultivableArea,
        preservedArea,
      })
      .catch((error) => {
        this.logger.error('There was an error trying to create a farm.');

        throw new BadRequestException(
          'Não foi possível criar esta propriedade, tente novamente.',
          { cause: error },
        );
      });

    return createFarm;
  }

  async createFarmCultivation({
    farmId,
    cultivationName,
    cultivatedArea,
    harvest,
  }: SaveFarmCultivationDto): Promise<FarmCultivation> {
    const [farm, farmCultivation] = await Promise.all([
      this.farmsRepository.findFarmById(farmId).catch((error) => {
        throw new BadRequestException(
          'Não foi possível verificar se a fazenda informada é válido.',
          { cause: error },
        );
      }),
      this.farmsRepository.findCultivatedAreaByFarmId(farmId).catch((error) => {
        throw new BadRequestException(
          'Não foi possível verificar a área usada é válido.',
          { cause: error },
        );
      }),
    ]);

    if (!farm) {
      throw new BadRequestException('A propriedade informada não existe.');
    }

    const sumCultivableAreaAndPreserverdArea = new Prisma.Decimal(
      farmCultivation,
    ).plus(new Prisma.Decimal(cultivatedArea));

    const areaTotalIsGreatherThaSumCultivableAreaAndPreserverdArea =
      new Prisma.Decimal(sumCultivableAreaAndPreserverdArea).greaterThan(
        farm.totalArea,
      );

    if (areaTotalIsGreatherThaSumCultivableAreaAndPreserverdArea) {
      throw new BadRequestException(
        'A propriedade não possui esta área para cultivo.',
      );
    }

    const farmCultivationData = await this.farmsRepository
      .createFarmCultivation({
        farmId,
        cultivationName: cultivationName.toUpperCase(),
        cultivatedArea,
        harvest,
      })
      .catch((error) => {
        this.logger.error(
          'There was an error trying to create a farm cultivation.',
        );

        throw new BadRequestException(
          'Não foi possível criar esta cultivação, tente novamente.',
          { cause: error },
        );
      });

    return farmCultivationData;
  }

  async listFarmsCultivations(): Promise<ListFarmsCultivations> {
    const promiseCountFarms = this.farmsRepository
      .countFarms()
      .catch((error) => {
        this.logger.error(
          'There was an error trying to count farms has been created.',
        );

        throw new BadRequestException(
          'Ocorreu um erro ao tentar contabilizar as propriedades criadas.',
          { cause: error },
        );
      });

    const promiseCountFarmsByState = this.farmsRepository
      .countFarmsByState()
      .catch((error) => {
        this.logger.error(
          'There was an error trying to count farms has been created by states.',
        );

        throw new BadRequestException(
          'Ocorreu um erro ao tentar contabilizar as propriedades criadas por estados.',
          { cause: error },
        );
      });

    const promiseCountFarmsCultivations = this.farmsRepository
      .countFarmsCultivations()
      .catch((error) => {
        this.logger.error(
          'There was an error trying to count farms cultivations.',
        );

        throw new BadRequestException(
          'Ocorreu um erro ao tentar contabilizar as culturas de cultivo.',
          { cause: error },
        );
      });

    const promiseSumFarmsTotalArea = this.farmsRepository
      .sumFarmsTotalArea()
      .catch((error) => {
        this.logger.error('There was an error trying to sum farms total area.');

        throw new BadRequestException(
          'Ocorreu um erro ao tentar contabilizar área total das propriedades criadas.',
          { cause: error },
        );
      });

    const promiseSumFarmsCultivableAndPreservationAreas = this.farmsRepository
      .sumFarmsCultivableAndPreservationAreas()
      .catch((error) => {
        this.logger.error(
          'There was an error trying to sum farms cultivable and preservation areas.',
        );

        throw new BadRequestException(
          'Ocorreu um erro ao tentar contabilizar as áreas de cultivo e preservação das propriedades.',
          { cause: error },
        );
      });

    const [
      totalFarmsCount,
      totalFarmsCountByState,
      totalFarmsCountCultivations,
      totalSumFarmsTotalArea,
      totalSumFarmsCultivableAndPreservationAreas,
    ] = await Promise.all([
      promiseCountFarms,
      promiseCountFarmsByState,
      promiseCountFarmsCultivations,
      promiseSumFarmsTotalArea,
      promiseSumFarmsCultivableAndPreservationAreas,
    ]);

    const { cultivableArea, preservedArea } =
      totalSumFarmsCultivableAndPreservationAreas;

    return {
      totalFarmsCount: totalFarmsCount ? totalFarmsCount : 0,
      totalFarmsCountByState: totalFarmsCountByState,
      totalFarmsCountCultivations: totalFarmsCountCultivations,
      totalFarmsSumTotalAreas: totalSumFarmsTotalArea
        ? Number(totalSumFarmsTotalArea)
        : 0,
      totalFarmsSumCultivableAreas: cultivableArea ? Number(cultivableArea) : 0,
      totalFarmsSumPreservationAreas: preservedArea ? Number(preservedArea) : 0,
    };
  }
}
