import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ProducersRepository } from '../producers.repository';
import { Producer } from '@prisma/client';
import { SaveProducerDto } from '../dto/saveProducer.dto';

const producersList = [
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

describe('ProducersRepository', () => {
  let producersRepository: ProducersRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [ProducersRepository, PrismaService],
    }).compile();

    producersRepository =
      testingModule.get<ProducersRepository>(ProducersRepository);
    prismaService = testingModule.get<PrismaService>(PrismaService);
  });

  it('ProducersRepository need to be defined', () => {
    expect(producersRepository).toBeDefined();
  });

  describe('Create producer', () => {
    it(`The method createProducer need to return a valid producer's data`, async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '36339334091',
      };

      const resultCreatedProducerData: Producer = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...producerData,
      };

      jest
        .spyOn(prismaService.producer, 'create')
        .mockResolvedValue(resultCreatedProducerData);

      const createdProducerData = producersRepository.createProducer({
        fullName: producerData.fullName,
        document: producerData.document,
      });

      await expect(createdProducerData).resolves.toBeDefined();
      await expect(createdProducerData).resolves.toBe(
        resultCreatedProducerData,
      );
    });

    it(`The method createProducer need to throw an error when prisma throws an error`, async () => {
      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '36339334091',
      };

      jest
        .spyOn(prismaService.producer, 'create')
        .mockRejectedValue('Prisma throws an error');

      const createdProducerData = producersRepository.createProducer({
        fullName: producerData.fullName,
        document: producerData.document,
      });

      await expect(createdProducerData).rejects.toBeDefined();
      await expect(createdProducerData).rejects.toBe('Prisma throws an error');
    });
  });

  describe('Update producer', () => {
    it(`The method updateProducer need to return a valid new fresh producer's data`, async () => {
      const producerId: number | undefined = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '74311717000190',
      };

      const resultUpdatedProducerData: Producer = {
        id: producerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...producerData,
      };

      jest
        .spyOn(prismaService.producer, 'update')
        .mockResolvedValue(resultUpdatedProducerData);

      const updateProducerData = producersRepository.updateProducer(
        producerId,
        {
          fullName: producerData.fullName,
          document: producerData.document,
        },
      );

      expect(updateProducerData).toBeDefined();
      await expect(updateProducerData).resolves.toBe(resultUpdatedProducerData);
    });

    it(`The method updateProducer need to throw an error when prisma throws an error`, async () => {
      const producerId: number | undefined = 1;

      const producerData: SaveProducerDto = {
        fullName: 'Gustavo Egidio Rigoni',
        document: '36339334091',
      };

      jest
        .spyOn(prismaService.producer, 'update')
        .mockRejectedValue('Prisma throws an error');

      const updatedProducerData = producersRepository.updateProducer(
        producerId,
        {
          fullName: producerData.fullName,
          document: producerData.document,
        },
      );

      await expect(updatedProducerData).rejects.toBeDefined();
      await expect(updatedProducerData).rejects.toBe('Prisma throws an error');
    });
  });

  describe('Remove producer', () => {
    it(`The method removeProducer need to return a valid producer's data that was removed`, async () => {
      const producerId: number | undefined = 1;

      const resultRemovedProducerData: Producer = {
        id: producerId,
        fullName: 'Gustavo Egidio Rigoni',
        document: '74311717000190',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.producer, 'delete')
        .mockResolvedValue(resultRemovedProducerData);

      const removeProducerData = producersRepository.removeProducer(producerId);

      expect(removeProducerData).toBeDefined();
      await expect(removeProducerData).resolves.toBe(resultRemovedProducerData);
    });

    it(`The method removeProducer need to throw an error when prisma throws an error`, async () => {
      const producerId: number | undefined = 1;

      jest
        .spyOn(prismaService.producer, 'delete')
        .mockRejectedValue('Prisma throws an error');

      const removeProducerData = producersRepository.removeProducer(producerId);

      await expect(removeProducerData).rejects.toBeDefined();
      await expect(removeProducerData).rejects.toBe('Prisma throws an error');
    });
  });

  describe('Find producer by id', () => {
    it(`The method findProducerById need to return a producer's data when producer is found`, async () => {
      const producerId: number | undefined = 1;

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockResolvedValue(mockProducersRepositoryFindProducerById(producerId));

      const findProducerData = producersRepository.findProducerById(producerId);

      expect(findProducerData).toBeDefined();
      await expect(findProducerData).resolves.not.toBeNull();
    });

    it(`The method findProducerById need to return null when producer is not found`, async () => {
      const producerId: number | undefined = -1;

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockResolvedValue(mockProducersRepositoryFindProducerById(producerId));

      const findProducerData = producersRepository.findProducerById(producerId);

      expect(findProducerData).toBeDefined();
      await expect(findProducerData).resolves.toBeNull();
    });

    it(`The method findProducerById need to throw an error when prisma throws an error`, async () => {
      const producerId: number | undefined = 1;

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockRejectedValue('Prisma throws an error');

      const findProducerData = producersRepository.findProducerById(producerId);

      await expect(findProducerData).rejects.toBeDefined();
      await expect(findProducerData).rejects.toBe('Prisma throws an error');
    });
  });

  describe('Find producer by document', () => {
    it(`The method findProducerDocumetHasAlreadyUsed need to return a valid producer's data`, async () => {
      const producerId: number | undefined = undefined;
      const producerDocument: string = '74311717000190';

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockResolvedValue(
          mockProducersRepositoryFindProducerDocumetHasAlreadyUsed(
            producerId,
            producerDocument,
          ),
        );

      const findProducerData =
        producersRepository.findProducerDocumetHasAlreadyUsed(
          producerId,
          producerDocument,
        );

      expect(findProducerData).toBeDefined();
      await expect(findProducerData).resolves.not.toBeNull();
    });

    it(`The method findProducerDocumetHasAlreadyUsed need to return null when producer is not found`, async () => {
      const producerId: number | undefined = 1;
      const producerDocument = '74311717000190';

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockResolvedValue(
          mockProducersRepositoryFindProducerDocumetHasAlreadyUsed(
            producerId,
            producerDocument,
          ),
        );

      const findProducerData =
        producersRepository.findProducerDocumetHasAlreadyUsed(
          producerId,
          producerDocument,
        );

      expect(findProducerData).toBeDefined();
      await expect(findProducerData).resolves.toBeNull();
    });

    it(`The method findProducerDocumetHasAlreadyUsed need to throw an error when prisma throws an error`, async () => {
      const producerId: number | undefined = 1;
      const producerDocument = '74311717000190';

      jest
        .spyOn(prismaService.producer, 'findUnique')
        .mockRejectedValue('Prisma throws an error');

      const findProducerData =
        producersRepository.findProducerDocumetHasAlreadyUsed(
          producerId,
          producerDocument,
        );

      await expect(findProducerData).rejects.toBeDefined();
      await expect(findProducerData).rejects.toBe('Prisma throws an error');
    });
  });
});
