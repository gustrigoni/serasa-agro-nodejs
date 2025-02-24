import { Body, Controller, Post, Version } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/createProducer.dto';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @Version('1')
  createProducer(
    @Body() createProducerDto: CreateProducerDto,
  ): Promise<string> {
    return this.producersService.createProducer(createProducerDto);
  }
}
