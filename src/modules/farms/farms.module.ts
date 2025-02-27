import { Logger, Module } from '@nestjs/common';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { ProducersRepository } from '../producers/producers.repository';
import { FarmsRepository } from './farms.repository';
import { PrismaService } from './../../prisma.service';

@Module({
  controllers: [FarmsController],
  providers: [
    PrismaService,
    FarmsService,
    ProducersRepository,
    FarmsRepository,
    Logger,
  ],
  exports: [FarmsService],
})
export class FarmsModule {}
