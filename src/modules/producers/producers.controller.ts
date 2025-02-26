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
import { Producer } from '@prisma/client';
import { ApiParam } from '@nestjs/swagger';
import { ProducerIdParamDto } from './dto/producerIdParam.dto';

@Controller('producers')
export class ProducersController {
  private readonly logger = new Logger(ProducersService.name);

  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  createProducer(
    @Body() saveCreateProducerDto: SaveProducerDto,
  ): Promise<Producer> {
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
    description: 'Identificador único do produtor',
  })
  @Patch('/:producerId')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  updateProducer(
    @Body() saveUpdateProducerDto: SaveProducerDto,
    @Param(ValidationPipe) { producerId }: ProducerIdParamDto,
  ): Promise<Producer> {
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
    description: 'Identificador único do produtor',
  })
  @Delete('/:producerId')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  removeProducer(
    @Param(ValidationPipe) { producerId }: ProducerIdParamDto,
  ): Promise<Producer> {
    return this.producersService
      .removeProducer(Number(producerId))
      .catch((error) => {
        this.logger.warn('It was not possible to remove a producer!');

        throw error;
      });
  }
}
