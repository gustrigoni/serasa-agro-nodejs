import { Controller, Get, Version } from '@nestjs/common';
import { FarmsService } from './farms.service';

@Controller('farms')
export class FarmsController {
  constructor(private readonly farmService: FarmsService) {}

  @Get()
  @Version('1')
  getHello(): string {
    return this.farmService.getHello();
  }
}
