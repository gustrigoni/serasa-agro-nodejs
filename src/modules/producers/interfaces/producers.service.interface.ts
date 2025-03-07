import { ProducerEntityDto } from 'src/modules/prisma/dto/producer.entity.dto';
import { SaveProducerDto } from '../dto/saveProducer.dto';

export interface ProducersServiceInterface {
  createProducer(saveProducerDto: SaveProducerDto): Promise<ProducerEntityDto>;
  updateProducer(
    producerId: number,
    saveProducerDto: SaveProducerDto,
  ): Promise<ProducerEntityDto>;
  removeProducer(sproducerId: number): Promise<ProducerEntityDto>;
}
