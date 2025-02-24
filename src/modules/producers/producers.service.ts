import { BadRequestException, Injectable } from '@nestjs/common';
import { Producer, PrismaClient } from '@prisma/client';
import { SaveProducerDto } from './dto/saveProducer.dto';

@Injectable()
export class ProducersService {
  private prisma = new PrismaClient();

  async createProducer({
    fullName,
    document,
  }: SaveProducerDto): Promise<Producer> {
    await this.throwExceptionIfUserAlreadyExistsByDocument(document);

    const producerData = await this.prisma.producer.create({
      data: {
        fullName,
        document,
      },
    });

    return producerData;
  }

  async updateProducer(
    producerId: number,
    { fullName, document }: SaveProducerDto,
  ): Promise<Producer> {
    await Promise.all([
      this.throwExceptionIfUserNotExistsByProducerId(producerId),
      this.throwExceptionIfUserAlreadyExistsByDocument(document),
    ]);

    const newProducerData = await this.prisma.producer
      .update({
        data: {
          fullName,
          document,
        },
        where: {
          id: producerId,
        },
      })
      .catch((error) => {
        throw new BadRequestException(
          'Não foi possível atualizar este produtor, tente novamente.',
          { cause: error },
        );
      });

    return newProducerData;
  }

  async removeProducer(producerId: number): Promise<Producer> {
    await this.throwExceptionIfUserNotExistsByProducerId(producerId);

    return await this.prisma.producer
      .delete({
        where: {
          id: producerId,
        },
      })
      .catch((error) => {
        throw new BadRequestException(
          'Não foi possível remover este produtor, tente novamente.',
          { cause: error },
        );
      });
  }

  private async throwExceptionIfUserAlreadyExistsByDocument(
    producerDocument: string,
  ): Promise<void> {
    const producerAlreadyExists = await this.prisma.producer.findUnique({
      where: {
        document: producerDocument,
      },
    });

    if (producerAlreadyExists) {
      throw new BadRequestException(
        'Já existe um produtor cadastrado com este CPF/CNPJ.',
      );
    }
  }

  private async throwExceptionIfUserNotExistsByProducerId(
    producerId: number,
  ): Promise<void> {
    const producerAlreadyExists = await this.prisma.producer.findUnique({
      where: {
        id: producerId,
      },
    });

    if (!producerAlreadyExists) {
      throw new BadRequestException('O produtor informado não existe.');
    }
  }
}
