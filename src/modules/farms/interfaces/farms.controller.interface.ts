import { FarmEntityDto } from "./../../../modules/prisma/dto/farm.entity.dto";
import { ListFarmsCultivationsDto } from "../dto/listFarmsCultivations.dto";
import { SaveFarmCultivationDto } from "../dto/saveFarmCultivation.dto";
import { FarmCultivationEntityDto } from "./../../../modules/prisma/dto/farmCultivation.entity.dto";
import { SaveFarmDto } from "../dto/saveFarm.dto";

export interface FarmsControllerInterface {
  createFarm(saveFarmDto: SaveFarmDto): Promise<FarmEntityDto>;
  createFarmCultivation(saveFarmCultivationDto: SaveFarmCultivationDto): Promise<FarmCultivationEntityDto>;
  listFarmsCultivationsStatistics(): Promise<ListFarmsCultivationsDto>
}