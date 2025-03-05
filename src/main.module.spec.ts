import { Test, TestingModule } from '@nestjs/testing';
import { MainModule } from './main.module';
import { ProducersModule } from './modules/producers/producers.module';
import { FarmsModule } from './modules/farms/farms.module';

describe('MainModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();
  });

  it('ProducersModule need to be defined', () => {
    const producersModule = testingModule.get<ProducersModule>(ProducersModule);

    expect(producersModule).toBeDefined();
  });

  it('ProducersModule need to be defined', () => {
    const farmsModule = testingModule.get<FarmsModule>(FarmsModule);

    expect(farmsModule).toBeDefined();
  });
});
