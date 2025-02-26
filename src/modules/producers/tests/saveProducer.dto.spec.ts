import { validate } from 'class-validator';
import { SaveProducerDto } from '../dto/saveProducer.dto';

describe('SaveProducerDto', () => {
  it(`Producer's name when is not informed return an error`, async () => {
    const producerIdParamDto = new SaveProducerDto();

    producerIdParamDto.document = '86170674032';

    const [dtoError] = await validate(producerIdParamDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('fullName');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.isNotEmpty).toBeDefined();
    expect(dtoError.constraints?.isNotEmpty).toBe(
      'Nome completo do produtor precisa ser informado.',
    );
  });

  it(`Producer's name characters is higher than 75 throw an error`, async () => {
    const producerIdParamDto = new SaveProducerDto();

    producerIdParamDto.fullName =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    producerIdParamDto.document = '86170674032';

    const [dtoError] = await validate(producerIdParamDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('fullName');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.maxLength).toBeDefined();
    expect(dtoError.constraints?.maxLength).toBe(
      'Nome completo do produtor deve conter no máximo 75 caracteres.',
    );
  });

  it(`Producer's full name when is not informed correctly return an error`, async () => {
    const producerIdParamDto = new SaveProducerDto();

    producerIdParamDto.fullName = 'Gustavo';
    producerIdParamDto.document = '86170674032';

    const [dtoError] = await validate(producerIdParamDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('fullName');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.matches).toBeDefined();
    expect(dtoError.constraints?.matches).toBe(
      'Nome completo do produtor deve conter apenas letras e espaços.',
    );
  });

  it(`Producer's document (CPF/CNPJ) when is not informed return an error`, async () => {
    const producerIdParamDto = new SaveProducerDto();

    producerIdParamDto.fullName = 'Gustavo Egidio Rigoni';

    const [dtoError] = await validate(producerIdParamDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('document');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBe(
      'O documento informado não é um CPF ou CNPJ válido.',
    );
  });

  it(`Producer's document (CPF/CNPJ) when is not informed only numbers return an error`, async () => {
    const producerIdParamDto = new SaveProducerDto();

    producerIdParamDto.fullName = 'Gustavo Egidio Rigoni';
    producerIdParamDto.document = '0001237893X';

    const [dtoError] = await validate(producerIdParamDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('document');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBe(
      'O documento informado não é um CPF ou CNPJ válido.',
    );
  });

  it(`Producer's document when is not a valid CPF return an error`, async () => {
    const producerIdParamDto = new SaveProducerDto();

    producerIdParamDto.fullName = 'Gustavo Egidio Rigoni';
    producerIdParamDto.document = '00012378933';

    const [dtoError] = await validate(producerIdParamDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('document');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBe(
      'O documento informado não é um CPF ou CNPJ válido.',
    );
  });

  it(`Producer's document when is not a valid CNPJ return an error`, async () => {
    const producerIdParamDto = new SaveProducerDto();

    producerIdParamDto.fullName = 'Gustavo Egidio Rigoni';
    producerIdParamDto.document = '10251426000173';

    const [dtoError] = await validate(producerIdParamDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('document');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBe(
      'O documento informado não é um CPF ou CNPJ válido.',
    );
  });

  it(`Producer's full name when is a valid not return an error`, async () => {
    const producerIdParamDto = new SaveProducerDto();

    producerIdParamDto.fullName = 'Gustavo Egidio Rigoni';
    producerIdParamDto.document = '10251426000171';

    const [dtoError] = await validate(producerIdParamDto);

    expect(dtoError).not.toBeDefined();
  });

  it(`Producer's document when is a valid CNPJ not return an error`, async () => {
    const producerIdParamDto = new SaveProducerDto();

    producerIdParamDto.fullName = 'Gustavo Egidio Rigoni';
    producerIdParamDto.document = '10251426000171';

    const [dtoError] = await validate(producerIdParamDto);

    expect(dtoError).not.toBeDefined();
  });

  it(`Producer's document when is a valid CPF not return an error`, async () => {
    const producerIdParamDto = new SaveProducerDto();

    producerIdParamDto.fullName = 'Gustavo Egidio Rigoni';
    producerIdParamDto.document = '86170674032';

    const [dtoError] = await validate(producerIdParamDto);

    expect(dtoError).not.toBeDefined();
  });
});
