import { BadRequestException, Injectable } from '@nestjs/common';
import { Producer } from '@prisma/client';
import { SaveProducerDto } from './dto/saveProducer.dto';
import { PrismaService } from './../../prisma.service';

@Injectable()
export class ProducersService {
  constructor(private prisma: PrismaService) {}

  async createProducer({
    fullName,
    document,
  }: SaveProducerDto): Promise<Producer> {
    await this.throwExceptionIfUserAlreadyExistsByDocument(document);

    const producerData = await this.prisma.producer
      .create({
        data: {
          fullName,
          document,
        },
      })
      .catch((error) => {
        throw new BadRequestException(
          'Não foi possível criar este produtor, tente novamente.',
          { cause: error },
        );
      });

    return producerData;
  }

  async updateProducer(
    producerId: number,
    { fullName, document }: SaveProducerDto,
  ): Promise<Producer> {
    await Promise.all([
      this.throwExceptionIfUserNotExistsByProducerId(producerId),
      this.throwExceptionIfUserAlreadyExistsByDocument(document, producerId),
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
    producerId: number | undefined = undefined,
  ): Promise<void> {
    const findProducerParameters = {
      document: producerDocument,
    };

    if (producerId) {
      findProducerParameters['NOT'] = {
        id: producerId,
      };
    }

    const producerAlreadyExists = await this.prisma.producer.findFirst({
      where: findProducerParameters,
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
