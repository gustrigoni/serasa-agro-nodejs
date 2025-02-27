import { Module } from '@nestjs/common';
import { FarmsModule } from './modules/farms/farms.module';
import { ProducersModule } from './modules/producers/producers.module';

@Module({
  imports: [ProducersModule, FarmsModule],
})
export class MainModule {}
