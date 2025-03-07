import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveProducerDto } from './dto/saveProducer.dto';
import { ProducerEntityDto } from '../prisma/dto/producer.entity.dto';
import { ProducersRepositoryInterface } from './interfaces/producers.repository.interface';

@Injectable()
export class ProducersRepository implements ProducersRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async createProducer({
    fullName,
    document,
  }: SaveProducerDto): Promise<ProducerEntityDto> {
    const producerData = this.prisma.producer.create({
      data: {
        fullName: fullName,
        document: document,
      },
    });

    return producerData;
  }

  async updateProducer(
    producerId: number,
    { fullName: producerFullName, document: producerDocument }: SaveProducerDto,
  ): Promise<ProducerEntityDto> {
    const producerData = await this.prisma.producer.update({
      data: {
        fullName: producerFullName,
        document: producerDocument,
      },
      where: {
        id: producerId,
      },
    });

    return producerData;
  }

  async removeProducer(producerId: number): Promise<ProducerEntityDto> {
    const producerData = this.prisma.producer.delete({
      where: {
        id: producerId,
      },
    });

    return producerData;
  }

  async findProducerById(
    producerId: number,
  ): Promise<ProducerEntityDto | null> {
    const producerData = await this.prisma.producer.findUnique({
      where: {
        id: producerId,
      },
    });

    return producerData;
  }

  async findProducerDocumetHasAlreadyUsed(
    producerId: number | undefined = undefined,
    producerDocument: string,
  ): Promise<ProducerEntityDto | null> {
    const findProducerParameters = {
      document: producerDocument,
    };

    if (producerId) {
      findProducerParameters['NOT'] = {
        id: producerId,
      };
    }

    const producerData = await this.prisma.producer.findUnique({
      where: findProducerParameters,
    });

    return producerData;
  }
}
