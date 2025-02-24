import { Test, TestingModule } from '@nestjs/testing';
import { ProducersModule } from '../producers.module';
import { ProducersService } from '../producers.service';

describe('ProducersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProducersModule],
    }).compile();
  });

  it('Producers module need to be defined', () => {
    expect(module).toBeDefined();
  });

  it('ProducersService need to be defined', () => {
    const service = module.get<ProducersService>(ProducersService);
    expect(service).toBeDefined();
  });
});
