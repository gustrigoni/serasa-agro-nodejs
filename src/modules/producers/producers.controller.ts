import { Controller, Get, Version } from '@nestjs/common';
import { ProducersService } from './producers.service';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Get()
  @Version('1')
  getHello(): string {
    return this.producersService.getHello();
  }
}
