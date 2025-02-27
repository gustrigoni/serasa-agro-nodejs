import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SaveProducerDto } from './dto/saveProducer.dto';
import { ProducersRepository } from './producers.repository';
import { ProducerEntityDto } from '../prisma/dto/producer.entity.dto';

@Injectable()
export class ProducersService {
  constructor(
    private producersRepository: ProducersRepository,
    private readonly logger: Logger = new Logger(ProducersService.name),
  ) {}

  async createProducer({
    fullName,
    document,
  }: SaveProducerDto): Promise<ProducerEntityDto> {
    await this.throwExceptionIfUserAlreadyExistsByDocument(document);

    const producerData = await this.producersRepository
      .createProducer({ fullName, document })
      .catch((error) => {
        this.logger.error('There was an error trying to create a producer');

        throw new InternalServerErrorException(
          'Não foi possível criar este produtor, tente novamente.',
          { cause: error },
        );
      });

    return producerData;
  }

  async updateProducer(
    producerId: number,
    { fullName, document }: SaveProducerDto,
  ): Promise<ProducerEntityDto> {
    await Promise.all([
      this.throwExceptionIfUserNotExistsByProducerId(producerId),
      this.throwExceptionIfUserAlreadyExistsByDocument(document, producerId),
    ]);

    const newProducerData = await this.producersRepository
      .updateProducer(producerId, { fullName, document })
      .catch((error) => {
        this.logger.error('There was an error trying to update a producer');

        throw new InternalServerErrorException(
          'Não foi possível atualizar este produtor, tente novamente.',
          { cause: error },
        );
      });

    return newProducerData;
  }

  async removeProducer(producerId: number): Promise<ProducerEntityDto> {
    await this.throwExceptionIfUserNotExistsByProducerId(producerId);

    const removedProducerData = this.producersRepository
      .removeProducer(producerId)
      .catch((error) => {
        this.logger.error('There was an error trying to remove a producer');

        throw new InternalServerErrorException(
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

        throw new InternalServerErrorException(
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

        throw new InternalServerErrorException(
          'Não foi possível verificar se o produtor informado é válido.',
          { cause: error },
        );
      });

    if (!producerAlreadyExists) {
      throw new BadRequestException('O produtor informado não existe.');
    }
  }
}
