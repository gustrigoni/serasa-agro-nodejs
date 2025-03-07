import { ProducerEntityDto } from './../../../modules/prisma/dto/producer.entity.dto';
import { SaveProducerDto } from '../dto/saveProducer.dto';

export interface ProducersRepositoryInterface {
  createProducer(saveProducer: SaveProducerDto): Promise<ProducerEntityDto>;
  updateProducer(
    producerId: number,
    saveProducerDto: SaveProducerDto,
  ): Promise<ProducerEntityDto>;
  removeProducer(producerId: number): Promise<ProducerEntityDto>;
  findProducerById(producerId: number): Promise<ProducerEntityDto | null>;
  findProducerDocumetHasAlreadyUsed(
    producerId: number,
    producerDocument: string,
  ): Promise<ProducerEntityDto | null>;
}
