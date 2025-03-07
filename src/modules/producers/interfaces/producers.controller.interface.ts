import { ProducerEntityDto } from 'src/modules/prisma/dto/producer.entity.dto';
import { SaveProducerDto } from '../dto/saveProducer.dto';
import { ProducerIdParamDto } from '../dto/producerIdParam.dto';

export interface ProducersControllerInterface {
  createProducer(saveProducer: SaveProducerDto): Promise<ProducerEntityDto>;
  updateProducer(
    saveProducer: SaveProducerDto,
    params: ProducerIdParamDto,
  ): Promise<ProducerEntityDto>;
  removeProducer(params: ProducerIdParamDto): Promise<ProducerEntityDto>;
}
