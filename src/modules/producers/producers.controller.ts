import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import { ProducersService } from './producers.service';
import { SaveProducerDto } from './dto/saveProducer.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProducerIdParamDto } from './dto/producerIdParam.dto';
import { ProducerEntityDto } from '../prisma/dto/producer.entity.dto';
import { ProducersControllerInterface } from './interfaces/producers.controller.interface';

@Controller('producers')
export class ProducersController implements ProducersControllerInterface {
  constructor(
    private readonly producersService: ProducersService,
    private readonly logger: Logger = new Logger(ProducersController.name),
  ) {}

  @Post()
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Producer has been created successfully',
    type: ProducerEntityDto,
  })
  @ApiBadRequestResponse({
    description: "Was not possible validate the producer's data informed",
  })
  @ApiInternalServerErrorResponse({
    description: `Was not possible to create a producer due to an internal error`,
  })
  createProducer(
    @Body() saveCreateProducerDto: SaveProducerDto,
  ): Promise<ProducerEntityDto> {
    return this.producersService
      .createProducer(saveCreateProducerDto)
      .catch((error) => {
        this.logger.warn('It was not possible to create a producer!', error);

        throw error;
      });
  }

  @ApiParam({
    name: 'producerId',
    example: 291,
    description: 'Unique producer identification number',
  })
  @Patch('/:producerId')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Producer has been updated successfully',
    type: ProducerEntityDto,
  })
  @ApiBadRequestResponse({
    description: "Was not possible validate the producer's data informed",
  })
  @ApiInternalServerErrorResponse({
    description: `Was not possible to update the producer due to an internal error`,
  })
  updateProducer(
    @Body() saveUpdateProducerDto: SaveProducerDto,
    @Param(ValidationPipe) { producerId }: ProducerIdParamDto,
  ): Promise<ProducerEntityDto> {
    return this.producersService
      .updateProducer(Number(producerId), saveUpdateProducerDto)
      .catch((error) => {
        this.logger.warn('It was not possible to update a producer!');

        throw error;
      });
  }

  @ApiParam({
    name: 'producerId',
    example: 291,
    description: 'Unique producer identification number',
  })
  @Delete('/:producerId')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Producer has been removed successfully',
    type: ProducerEntityDto,
  })
  @ApiBadRequestResponse({
    description: "Was not possible validate the producer's data informed",
  })
  @ApiInternalServerErrorResponse({
    description: `Was not possible to update the producer due to an internal error`,
  })
  removeProducer(
    @Param(ValidationPipe) { producerId }: ProducerIdParamDto,
  ): Promise<ProducerEntityDto> {
    return this.producersService
      .removeProducer(Number(producerId))
      .catch((error) => {
        this.logger.warn('It was not possible to remove a producer!');

        throw error;
      });
  }
}
