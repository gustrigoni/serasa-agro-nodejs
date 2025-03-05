import { validate } from 'class-validator';
import { ProducerIdParamDto } from '../dto/producerIdParam.dto';
import { ValidationError } from '@nestjs/common';

describe('ProducerIdParamDto', () => {
  it(`Producer's unique id can not contain letters`, async () => {
    const producerIdParamDto = new ProducerIdParamDto();

    producerIdParamDto.producerId = 'AaBb';

    const dtoError: ValidationError[] = await validate(producerIdParamDto);

    expect(dtoError).not.toBeNull();
    expect(dtoError).toHaveLength(1);
  });

  it(`Producer's unique id can not contain symbols`, async () => {
    const producerIdParamDto = new ProducerIdParamDto();

    producerIdParamDto.producerId = '@)-[]{}~~``';

    const dtoError: ValidationError[] = await validate(producerIdParamDto);

    expect(dtoError).not.toBeNull();
    expect(dtoError).toHaveLength(1);
  });

  it(`Producer's unique id can only contain numbers`, async () => {
    const producerIdParamDto = new ProducerIdParamDto();

    producerIdParamDto.producerId = '123456';

    const dtoError: ValidationError[] = await validate(producerIdParamDto);

    expect(dtoError).not.toBeNull();
    expect(dtoError).toHaveLength(0);
  });
});
