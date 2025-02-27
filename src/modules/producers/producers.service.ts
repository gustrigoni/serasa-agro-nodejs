import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Producer } from '@prisma/client';
import { SaveProducerDto } from './dto/saveProducer.dto';
import { ProducersRepository } from './producers.repository';

@Injectable()
export class ProducersService {
  private readonly logger = new Logger(ProducersService.name);

  constructor(private producersRepository: ProducersRepository) {}

  async createProducer({
    fullName,
    document,
  }: SaveProducerDto): Promise<Producer> {
    await this.throwExceptionIfUserAlreadyExistsByDocument(document);

    const producerData = await this.producersRepository
      .createProducer({ fullName, document })
      .catch((error) => {
        this.logger.error('There was an error trying to create a producer');

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

    const newProducerData = await this.producersRepository
      .updateProducer(producerId, { fullName, document })
      .catch((error) => {
        this.logger.error('There was an error trying to update a producer');

        throw new BadRequestException(
          'Não foi possível atualizar este produtor, tente novamente.',
          { cause: error },
        );
      });

    return newProducerData;
  }

  async removeProducer(producerId: number): Promise<Producer> {
    await this.throwExceptionIfUserNotExistsByProducerId(producerId);

    const removedProducerData = this.producersRepository
      .removeProducer(producerId)
      .catch((error) => {
        this.logger.error('There was an error trying to remove a producer');

        throw new BadRequestException(
          'Não foi possível remover este produtor, tente novamente.',
          { cause: error },
        );
      });

    return removedProducerData;
  }

  private async throwExceptionIfUserAlreadyExistsByDocument(
    producerDocument: string,
    producerId: number | undefined = undefined,
  ): Promise<void> {
    const producerAlreadyExists = await this.producersRepository
      .findProducerDocumetHasAlreadyUsed(producerId, producerDocument)
      .catch((error) => {
        this.logger.error(
          'There was an error trying to find a document by a producer',
        );

        throw new BadRequestException(
          'Não foi possível verificar se o documento informado é válido.',
          { cause: error },
        );
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
    const producerAlreadyExists = await this.producersRepository
      .findProducerById(producerId)
      .catch((error) => {
        this.logger.error('There was an error trying to find a producer by id');

        throw new BadRequestException(
          'Não foi possível verificar se o produtor informado é válido.',
          { cause: error },
        );
      });

    if (!producerAlreadyExists) {
      throw new BadRequestException('O produtor informado não existe.');
    }
  }
}
