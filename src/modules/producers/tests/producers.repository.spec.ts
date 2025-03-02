import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ProducersRepository } from '../producers.repository';
import { Producer } from '@prisma/client';
import { SaveProducerDto } from '../dto/saveProducer.dto';
import { ProducerEntityDto } from 'src/modules/prisma/dto/producer.entity.dto';

describe('ProducersRepository', () => {
  let producersRepository: ProducersRepository;
  let prismaService: PrismaService;

  const producersList: Producer[] = [
    {
      id: 1,
      fullName: 'Gustavo Egidio Rigoni',
      document: '74311717000190',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      fullName: 'Maria Graça de Souza',
      document: '59035178033',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockProducersRepositoryFindProducerById = (producerId: number) => {
    const producer =
      producersList.find((producer) => producer.id === producerId) || null;

    return producer;
  };

  const mockProducersRepositoryFindProducerDocumetHasAlreadyUsed = (
    producerId: number | undefined = undefined,
    producerDocument: string,
  ) => {
    const producer =
      producersList.find((producer) => {
        if (producerId) {
          return (
            producer.document === producerDocument && producer.id !== producerId
          );
        }
        return producer.document === producerDocument;
      }) || null;

    return producer;
  };

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [ProducersRepository, PrismaService],
    }).compile();

    producersRepository =
      testingModule.get<ProducersRepository>(ProducersRepository);
    prismaService = testingModule.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ProducersRepository need to be defined', () => {
    expect(producersRepository).toBeDefined();
  });

  describe('Create producer', () => {
    it(`The method createProducer need to return a valid producer's data when it has been created`, async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '74311717000190',
      };

      const resultCreateProducerData = {
        ...producersList[0],
        ...producerData,
      };

      jest
        .spyOn(prismaService.producer, 'create')
        .mockResolvedValue(producersList[0]);

      const createdProducerData: Promise<Producer> =
        producersRepository.createProducer({
          fullName: producerData.fullName,
          document: producerData.document,
        });

      await expect(createdProducerData).resolves.toBeDefined();
      await expect(createdProducerData).resolves.toStrictEqual(
        resultCreateProducerData,
      );
    });

    it(`The method createProducer need to throw an error due Prisma thrown an error`, async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '36339334091',
      };

      prismaService.producer.create = jest.fn().mockRejectedValue(new Error());

      const createdProducerData: Promise<Producer> =
        producersRepository.createProducer({
          fullName: producerData.fullName,
          document: producerData.document,
        });

      await expect(createdProducerData).rejects.toBeDefined();
      await expect(createdProducerData).rejects.toThrow();
    });
  });

  describe('Update producer', () => {
    it(`The method updateProducer need to return the producer data when it has updated successfully`, async () => {
      const producerId: number | undefined = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '36339334091',
      };

      const resultUpdatedProducerData: ProducerEntityDto = {
        ...producersList[0],
        ...producerData,
      };

      jest
        .spyOn(prismaService.producer, 'update')
        .mockResolvedValue(resultUpdatedProducerData);

      const updateProducerData: Promise<Producer> =
        producersRepository.updateProducer(producerId, {
          fullName: producerData.fullName,
          document: producerData.document,
        });

      await expect(updateProducerData).resolves.toBeDefined();
      await expect(updateProducerData).resolves.toStrictEqual(
        resultUpdatedProducerData,
      );
    });

    it(`The method updateProducer need to throw an error due Prisma thrown an error`, async () => {
      const producerId: number | undefined = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '36339334091',
      };

      prismaService.producer.update = jest.fn().mockRejectedValue(new Error());

      const updatedProducerData: Promise<Producer> =
        producersRepository.updateProducer(producerId, {
          fullName: producerData.fullName,
          document: producerData.document,
        });

      await expect(updatedProducerData).rejects.toBeDefined();
      await expect(updatedProducerData).rejects.toThrow();
    });
  });

  describe('Remove producer', () => {
    it(`The method removeProducer need to return the producer data when it has removed successfully`, async () => {
      const producerId: number | undefined = 1;

      const resultRemovedProducerData: ProducerEntityDto = {
        ...producersList[0],
      };

      jest
        .spyOn(prismaService.producer, 'delete')
        .mockResolvedValue(resultRemovedProducerData);

      const removeProducerData: Promise<Producer> =
        producersRepository.removeProducer(producerId);

      await expect(removeProducerData).resolves.toBeDefined();
      await expect(removeProducerData).resolves.toStrictEqual(
        resultRemovedProducerData,
      );
    });

    it(`The method removeProducer need to throw an error due Prisma thrown an error`, async () => {
      const producerId: number | undefined = 1;

      prismaService.producer.delete = jest.fn().mockRejectedValue(new Error());

      const removeProducerData: Promise<Producer> =
        producersRepository.removeProducer(producerId);

      await expect(removeProducerData).rejects.toBeDefined();
      await expect(removeProducerData).rejects.toThrow();
    });
  });

  describe('Find producer by id', () => {
    it(`The method findProducerById need to return a producer data when it has found`, async () => {
      const producerId: number | undefined = 1;

      const resultFindProducerData: ProducerEntityDto = {
        ...producersList[0],
      };

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockResolvedValue(mockProducersRepositoryFindProducerById(producerId));

      const findProducerData: Promise<Producer | null> =
        producersRepository.findProducerById(producerId);

      await expect(findProducerData).resolves.toBeDefined();
      await expect(findProducerData).resolves.not.toBeNull();
      await expect(findProducerData).resolves.toStrictEqual(
        resultFindProducerData,
      );
    });

    it(`The method findProducerById need to return null when it has not found`, async () => {
      const producerId: number | undefined = -1;

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockResolvedValue(mockProducersRepositoryFindProducerById(producerId));

      const findProducerData: Promise<Producer | null> =
        producersRepository.findProducerById(producerId);

      await expect(findProducerData).resolves.toBeDefined();
      await expect(findProducerData).resolves.toBeNull();
    });

    it(`The method findProducerById need to throw an error due Prisma thrown an error`, async () => {
      const producerId: number | undefined = 1;

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockRejectedValue(new Error());

      const findProducerData: Promise<Producer | null> =
        producersRepository.findProducerById(producerId);

      await expect(findProducerData).rejects.toBeDefined();
      await expect(findProducerData).rejects.toThrow();
    });
  });

  describe('Find producer by document', () => {
    it(`The method findProducerDocumetHasAlreadyUsed need to return a valid producer data when it has found`, async () => {
      const producerId: number | undefined = undefined;
      const producerDocument: string = '74311717000190';

      const resultFindProducersData: ProducerEntityDto = {
        ...producersList[0],
      };

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockResolvedValue(
          mockProducersRepositoryFindProducerDocumetHasAlreadyUsed(
            producerId,
            producerDocument,
          ),
        );

      const findProducerData: Promise<Producer | null> =
        producersRepository.findProducerDocumetHasAlreadyUsed(
          producerId,
          producerDocument,
        );

      await expect(findProducerData).resolves.toBeDefined();
      await expect(findProducerData).resolves.not.toBeNull();
      await expect(findProducerData).resolves.toStrictEqual(
        resultFindProducersData,
      );
    });

    it(`The method findProducerDocumetHasAlreadyUsed need to return null when it has not found`, async () => {
      const producerId: number | undefined = undefined;
      const producerDocument = '62236079036';

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockResolvedValue(
          mockProducersRepositoryFindProducerDocumetHasAlreadyUsed(
            producerId,
            producerDocument,
          ),
        );

      const findProducerData: Promise<Producer | null> =
        producersRepository.findProducerDocumetHasAlreadyUsed(
          producerId,
          producerDocument,
        );

      await expect(findProducerData).resolves.toBeDefined();
      await expect(findProducerData).resolves.toBeNull();
    });

    it(`The method findProducerDocumetHasAlreadyUsed need to throw an error due Prisma thrown an error`, async () => {
      const producerId: number | undefined = 1;
      const producerDocument = '74311717000190';

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockRejectedValue(new Error());

      const findProducerData =
        producersRepository.findProducerDocumetHasAlreadyUsed(
          producerId,
          producerDocument,
        );

      await expect(findProducerData).rejects.toBeDefined();
      await expect(findProducerData).rejects.toThrow();
    });
  });
});
