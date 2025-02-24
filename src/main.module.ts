import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FarmsModule } from './modules/farms/farms.module';
import { ProducersModule } from './modules/producers/producers.module';

@Module({
  imports: [ConfigModule.forRoot(), FarmsModule, ProducersModule],
})
export class MainModule {}
