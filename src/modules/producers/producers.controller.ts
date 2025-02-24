import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
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
import { ProducerIdParam } from './dto/producerIdParam.dto';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  createProducer(
    @Body() saveCreateProducerDto: SaveProducerDto,
  ): Promise<Producer> {
    return this.producersService.createProducer(saveCreateProducerDto);
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
    @Param(ValidationPipe) { producerId }: ProducerIdParam,
  ): Promise<Producer> {
    return this.producersService.updateProducer(
      Number(producerId),
      saveUpdateProducerDto,
    );
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
    @Param(ValidationPipe) { producerId }: ProducerIdParam,
  ): Promise<Producer> {
    return this.producersService.removeProducer(Number(producerId));
  }
}
