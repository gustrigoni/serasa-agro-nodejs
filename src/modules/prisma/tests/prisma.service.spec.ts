import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = testingModule.get<PrismaService>(PrismaService);
  });

  it('PrismaService need to be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('Prisma need to connect to the database on module init', async () => {
    const connectSpy = jest
      .spyOn(prismaService, '$connect')
      .mockResolvedValue(undefined);

    await prismaService.onModuleInit();

    expect(connectSpy).toHaveBeenCalled();
  });
});
