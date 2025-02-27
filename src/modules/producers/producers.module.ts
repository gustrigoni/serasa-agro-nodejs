import { Logger, Module } from '@nestjs/common';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { PrismaService } from './../../prisma.service';
import { ProducersRepository } from './producers.repository';

@Module({
  controllers: [ProducersController],
  providers: [ProducersService, PrismaService, ProducersRepository, Logger],
  exports: [ProducersService],
})
export class ProducersModule {}
