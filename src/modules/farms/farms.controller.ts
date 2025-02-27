import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Version,
} from '@nestjs/common';
import { FarmsService } from './farms.service';
import { SaveFarmDto } from './dto/saveFarm.dto';
import { Farm, FarmCultivation } from '@prisma/client';
import { SaveFarmCultivationDto } from './dto/saveFarmCultivation.dto';
import { ListFarmsCultivations } from './dto/listFarmsCultivations.dto';

@Controller('farms')
export class FarmsController {
  private readonly logger = new Logger(FarmsController.name);

  constructor(private readonly farmService: FarmsService) {}

  @Post()
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  createFarm(@Body() saveCreateFarmDto: SaveFarmDto): Promise<Farm> {
    return this.farmService.createFarm(saveCreateFarmDto).catch((error) => {
      this.logger.warn('It was not possible to create a farm!', error);

      throw error;
    });
  }

  @Post('/cultivation')
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  createFarmCultivation(
    @Body() saveFarmCultivationDto: SaveFarmCultivationDto,
  ): Promise<FarmCultivation> {
    return this.farmService
      .createFarmCultivation(saveFarmCultivationDto)
      .catch((error) => {
        this.logger.warn('It was not possible to create a farm!', error);

        throw error;
      });
  }

  @Get('/statistics')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  listFarmsCultivations(): Promise<ListFarmsCultivations> {
    return this.farmService.listFarmsCultivations().catch((error) => {
      this.logger.warn('It was not possible to create a farm!', error);

      throw error;
    });
  }
}
