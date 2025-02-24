import { Test, TestingModule } from '@nestjs/testing';
import { FarmsController } from '../farms.controller';
import { FarmsService } from '../farms.service';

describe('FarmsController', () => {
  let farmController: FarmsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FarmsController],
      providers: [FarmsService],
    }).compile();

    farmController = app.get<FarmsController>(FarmsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(farmController.getHello()).toBe('Hello World!');
    });
  });
});
