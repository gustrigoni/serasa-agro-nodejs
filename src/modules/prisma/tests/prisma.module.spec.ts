import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma.module';
import { PrismaService } from '../prisma.service';

describe('PrismaModule', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    prismaService = testingModule.get<PrismaService>(PrismaService);
  });

  it('PrismaService need to be defined', () => {
    expect(prismaService).toBeDefined();
  });
});
