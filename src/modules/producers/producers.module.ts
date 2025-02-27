import { Logger, Module } from '@nestjs/common';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { ProducersRepository } from './producers.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProducersController],
  providers: [ProducersService, ProducersRepository, Logger],
  exports: [ProducersService],
})
export class ProducersModule {}
