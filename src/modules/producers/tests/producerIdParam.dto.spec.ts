import { validate } from 'class-validator';
import { ProducerIdParamDto } from '../dto/producerIdParam.dto';

describe('ProducerIdParamDto', () => {
  it(`Producer's unique id can not contain letters`, async () => {
    const producerIdParamDto = new ProducerIdParamDto();

    producerIdParamDto.producerId = 'AaBb';

    const dtoError = await validate(producerIdParamDto);

    expect(dtoError).not.toBeNull();
    expect(dtoError).toHaveLength(1);
  });

  it(`Producer's unique id can not contain symbols`, async () => {
    const producerIdParamDto = new ProducerIdParamDto();

    producerIdParamDto.producerId = '@)-[]{}~~``';

    const dtoError = await validate(producerIdParamDto);

    expect(dtoError).not.toBeNull();
    expect(dtoError).toHaveLength(1);
  });

  it(`Producer's unique id can only contain numbers`, async () => {
    const producerIdParamDto = new ProducerIdParamDto();

    producerIdParamDto.producerId = '123456';

    const dtoError = await validate(producerIdParamDto);

    expect(dtoError).not.toBeNull();
    expect(dtoError).toHaveLength(0);
  });
});
