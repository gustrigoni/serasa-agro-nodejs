import { FarmEntityDto } from './../../../modules/prisma/dto/farm.entity.dto';
import { SaveFarmDto } from '../dto/saveFarm.dto';
import { SaveFarmCultivationDto } from '../dto/saveFarmCultivation.dto';
import { ListFarmsCultivationsDto } from '../dto/listFarmsCultivations.dto';
import { FarmCultivationEntityDto } from './../../../modules/prisma/dto/farmCultivation.entity.dto';

export interface FarmsServiceInterface {
  createFarm(saveFarmDto: SaveFarmDto): Promise<FarmEntityDto>;
  createFarmCultivation(
    saveFarmCultivationDto: SaveFarmCultivationDto,
  ): Promise<FarmCultivationEntityDto>;
  listFarmsCultivationsStatistics(): Promise<ListFarmsCultivationsDto>;
}
