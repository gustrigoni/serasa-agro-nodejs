import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from '../producers.controller';
import { ProducersService } from '../producers.service';

describe('ProducersController', () => {
  let producersController: ProducersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [ProducersService],
    }).compile();

    producersController = app.get<ProducersController>(ProducersController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(producersController.getHello()).toBe('Hello World!');
    });
  });
});
