import { Test, TestingModule } from '@nestjs/testing';
import { ProducersModule } from '../producers.module';
import { ProducersService } from '../producers.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ProducersModule', () => {
  let producersModule: TestingModule;

  beforeEach(async () => {
    producersModule = await Test.createTestingModule({
      imports: [ProducersModule],
    }).compile();
  });

  it('Producers module need to be defined', () => {
    expect(module).toBeDefined();
  });

  it('ProducersService need to be defined', () => {
    const service = producersModule.get<ProducersService>(ProducersService);
    expect(service).toBeDefined();
  });

  it('PrismaService need to be defined', () => {
    const service = producersModule.get<PrismaService>(PrismaService);
    expect(service).toBeDefined();
  });
});
