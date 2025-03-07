import { FarmEntityDto } from './../../../modules/prisma/dto/farm.entity.dto';
import { FarmCultivationEntityDto } from './../../../modules/prisma/dto/farmCultivation.entity.dto';
import { SaveFarmDto } from '../dto/saveFarm.dto';
import { Prisma } from '@prisma/client';
import { SaveFarmCultivationDto } from '../dto/saveFarmCultivation.dto';

export interface FarmsRepositoryInterface {
  createFarm(saveFarmDto: SaveFarmDto): Promise<FarmEntityDto>;
  findFarmById(farmId: number): Promise<FarmEntityDto | null>;
  findCultivatedAreaByFarmId(farmId: number): Promise<Prisma.Decimal>;
  createFarmCultivation(
    saveFarmCultivation: SaveFarmCultivationDto,
  ): Promise<FarmCultivationEntityDto>;
  countFarms(): Promise<number>;
  sumFarmsTotalArea(): Promise<Prisma.Decimal | null>;
  countFarmsByState(): Promise<Record<string, number>[]>;
  countFarmsCultivations(): Promise<Record<string, number>[]>;
  sumFarmsCultivableAndPreservationAreas(): Promise<
    Pick<Prisma.FarmSumAggregateOutputType, 'cultivableArea' | 'preservedArea'>
  >;
}
