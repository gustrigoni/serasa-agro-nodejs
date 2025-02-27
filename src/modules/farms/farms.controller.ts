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
import { SaveFarmCultivationDto } from './dto/saveFarmCultivation.dto';
import { ListFarmsCultivationsDto } from './dto/listFarmsCultivations.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { FarmEntityDto } from '../prisma/dto/farm.entity.dto';
import { FarmCultivationEntityDto } from '../prisma/dto/farmCultivation.entity.dto';

@Controller('farms')
export class FarmsController {
  constructor(
    private readonly farmService: FarmsService,
    private readonly logger: Logger = new Logger(FarmsController.name),
  ) {}

  @Post()
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Farm has been created successfully',
    type: FarmEntityDto,
  })
  @ApiBadRequestResponse({
    description: `Was not possible validate the farm data informed`,
  })
  @ApiInternalServerErrorResponse({
    description: `Was not possible to create a farm due to an internal error`,
  })
  createFarm(@Body() saveCreateFarmDto: SaveFarmDto): Promise<FarmEntityDto> {
    return this.farmService.createFarm(saveCreateFarmDto).catch((error) => {
      this.logger.warn('It was not possible to create a farm!', error);

      throw error;
    });
  }

  @Post('/cultivation')
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Farm cultivation has been created successfully',
    type: FarmCultivationEntityDto,
  })
  @ApiBadRequestResponse({
    description: `Was not possible validate the farm cultivtion's data informed`,
  })
  @ApiInternalServerErrorResponse({
    description: `Was not possible to create a farm cultivation due to an internal error`,
  })
  async createFarmCultivation(
    @Body() saveFarmCultivationDto: SaveFarmCultivationDto,
  ): Promise<FarmCultivationEntityDto> {
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
  @ApiOkResponse({
    description: 'Farm cultivations statistics has been listed successfully',
    type: ListFarmsCultivationsDto,
  })
  @ApiInternalServerErrorResponse({
    description: `Was not possible to get farms cultivations' statistics due to an internal error`,
  })
  listFarmsCultivations(): Promise<ListFarmsCultivationsDto> {
    return this.farmService.listFarmsCultivations().catch((error) => {
      this.logger.warn('It was not possible to create a farm!', error);

      throw error;
    });
  }
}
