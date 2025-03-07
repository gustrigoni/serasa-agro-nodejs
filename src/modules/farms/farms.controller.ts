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
import { FarmsControllerInterface } from './interfaces/farms.controller.interface';

@Controller('farms')
export class FarmsController implements FarmsControllerInterface {
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
    description: 'Cultivation has been created successfully',
    type: FarmCultivationEntityDto,
  })
  @ApiBadRequestResponse({
    description: `Was not possible validate the cultivtion's data informed`,
  })
  @ApiInternalServerErrorResponse({
    description: `Was not possible to create a cultivation due to an internal error`,
  })
  createFarmCultivation(
    @Body() saveFarmCultivationDto: SaveFarmCultivationDto,
  ): Promise<FarmCultivationEntityDto> {
    return this.farmService
      .createFarmCultivation(saveFarmCultivationDto)
      .catch((error) => {
        this.logger.warn('It was not possible to create a cultivation!', error);

        throw error;
      });
  }

  @Get('/statistics')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Cultivations statistics has been listed successfully',
    type: ListFarmsCultivationsDto,
  })
  @ApiInternalServerErrorResponse({
    description: `Was not possible to get cultivations' statistics due to an internal error`,
  })
  listFarmsCultivationsStatistics(): Promise<ListFarmsCultivationsDto> {
    return this.farmService.listFarmsCultivationsStatistics().catch((error) => {
      this.logger.warn(
        'It was not possible to get farms and cultivations statistics!',
        error,
      );

      throw error;
    });
  }
}
