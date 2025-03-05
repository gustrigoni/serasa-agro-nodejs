import { ProducerEntityDto } from '../dto/producer.entity.dto';

describe('ProducerEntityDto', () => {
  it('The ProducerEntityDto need to match defined type', () => {
    const producerEntityDto = new ProducerEntityDto();

    expect(producerEntityDto).toStrictEqual(new ProducerEntityDto());
  });

  it('The ProducerEntityDto need to have the correct default values', () => {
    const producerEntityDto = new ProducerEntityDto();

    expect(producerEntityDto.id).toBeUndefined();
    expect(producerEntityDto.fullName).toBeUndefined();
    expect(producerEntityDto.document).toBeUndefined();
    expect(producerEntityDto.createdAt).toBeUndefined();
    expect(producerEntityDto.updatedAt).toBeUndefined();
  });
});
