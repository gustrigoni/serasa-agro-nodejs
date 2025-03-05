import { Test, TestingModule } from '@nestjs/testing';
import { FarmsController } from '../farms.controller';
import { FarmsService } from '../farms.service';
import { ProducersRepository } from '../../producers/producers.repository';
import { FarmsRepository } from '../farms.repository';
import { Logger } from '@nestjs/common';
import { FarmsModule } from '../farms.module';

describe('FarmsModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [FarmsModule],
    }).compile();
  });

  it('Module need to be defined', () => {
    expect(testingModule).toBeDefined();
  });

  it('FarmsController need to be defined', () => {
    const controller = testingModule.get<FarmsController>(FarmsController);

    expect(controller).toBeDefined();
  });

  it('FarmsService need to be defined', () => {
    const farmsService = testingModule.get<FarmsService>(FarmsService);

    expect(farmsService).toBeDefined();
  });

  it('ProducersRepository need to be defined', () => {
    const producersRepository =
      testingModule.get<ProducersRepository>(ProducersRepository);

    expect(producersRepository).toBeDefined();
  });

  it('FarmsRepository need to be defined', () => {
    const farmsRepository = testingModule.get<FarmsRepository>(FarmsRepository);

    expect(farmsRepository).toBeDefined();
  });

  it('Logger need to be defined', () => {
    const logger = testingModule.get<Logger>(Logger);

    expect(logger).toBeDefined();
  });
});
