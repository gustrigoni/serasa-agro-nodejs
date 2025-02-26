import { Injectable } from '@nestjs/common';
import { Producer } from '@prisma/client';
import { PrismaService } from './../../prisma.service';
import { SaveProducerDto } from './dto/saveProducer.dto';

@Injectable()
export class ProducersRepository {
  constructor(private prisma: PrismaService) {}

  async createProducer({
    fullName,
    document,
  }: SaveProducerDto): Promise<Producer> {
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
  ): Promise<Producer> {
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

  async removeProducer(producerId: number): Promise<Producer> {
    const producerData = this.prisma.producer.delete({
      where: {
        id: producerId,
      },
    });

    return producerData;
  }

  async findProducerById(producerId: number): Promise<Producer | null> {
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
  ): Promise<Producer | null> {
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
