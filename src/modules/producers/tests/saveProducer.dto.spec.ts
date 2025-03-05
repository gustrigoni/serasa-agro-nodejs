import { validate } from 'class-validator';
import { SaveProducerDto } from '../dto/saveProducer.dto';
import { ValidationError } from '@nestjs/common';

describe('SaveProducerDto', () => {
  it(`Producer's name when is not informed return an error`, async () => {
    const saveProducerDto = new SaveProducerDto();

    saveProducerDto.document = '86170674032';

    const [dtoError]: ValidationError[] = await validate(saveProducerDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('fullName');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.isNotEmpty).toBeDefined();
    expect(dtoError.constraints?.isNotEmpty).toBe(
      'Nome completo do produtor precisa ser informado.',
    );
  });

  it(`Producer's name characters is higher than 75 throw an error`, async () => {
    const saveProducerDto = new SaveProducerDto();

    saveProducerDto.fullName = Array(76)
      .fill('X')
      .toString()
      .replaceAll(',', ' ');
    saveProducerDto.document = '86170674032';

    const [dtoError]: ValidationError[] = await validate(saveProducerDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('fullName');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.maxLength).toBeDefined();
    expect(dtoError.constraints?.maxLength).toBe(
      'Nome completo do produtor deve conter no máximo 75 caracteres.',
    );
  });

  it(`Producer's full name when is not informed correctly return an error`, async () => {
    const saveProducerDto = new SaveProducerDto();

    saveProducerDto.fullName = 'Gustavo';
    saveProducerDto.document = '86170674032';

    const [dtoError]: ValidationError[] = await validate(saveProducerDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('fullName');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.matches).toBeDefined();
    expect(dtoError.constraints?.matches).toBe(
      'Nome completo do produtor deve conter apenas letras e deve ser informado o sobrenome.',
    );
  });

  it(`Producer's document (CPF/CNPJ) when is not informed return an error`, async () => {
    const saveProducerDto = new SaveProducerDto();

    saveProducerDto.fullName = 'Gustavo Egidio Rigoni';

    const [dtoError]: ValidationError[] = await validate(saveProducerDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('document');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBe(
      'O documento informado não é um CPF ou CNPJ válido.',
    );
  });

  it(`Producer's document (CPF/CNPJ) when is not informed only numbers return an error`, async () => {
    const saveProducerDto = new SaveProducerDto();

    saveProducerDto.fullName = 'Gustavo Egidio Rigoni';
    saveProducerDto.document = '0001237893X';

    const [dtoError]: ValidationError[] = await validate(saveProducerDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('document');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBe(
      'O documento informado não é um CPF ou CNPJ válido.',
    );
  });

  it(`Producer's document when is not a valid CPF return an error`, async () => {
    const saveProducerDto = new SaveProducerDto();

    saveProducerDto.fullName = 'Gustavo Egidio Rigoni';
    saveProducerDto.document = '00012378933';

    const [dtoError]: ValidationError[] = await validate(saveProducerDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('document');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBe(
      'O documento informado não é um CPF ou CNPJ válido.',
    );
  });

  it(`Producer's document when is not a valid CNPJ return an error`, async () => {
    const saveProducerDto = new SaveProducerDto();

    saveProducerDto.fullName = 'Gustavo Egidio Rigoni';
    saveProducerDto.document = '10251426000173';

    const [dtoError]: ValidationError[] = await validate(saveProducerDto);

    expect(dtoError).toBeDefined();
    expect(dtoError.property).toBe('document');
    expect(dtoError.constraints).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBeDefined();
    expect(dtoError.constraints?.IsValidDocumentConstraint).toBe(
      'O documento informado não é um CPF ou CNPJ válido.',
    );
  });

  it(`Producer's full name when is a valid not return an error`, async () => {
    const saveProducerDto = new SaveProducerDto();

    saveProducerDto.fullName = 'Gustavo Egidio Rigoni';
    saveProducerDto.document = '10251426000171';

    const [dtoError]: ValidationError[] = await validate(saveProducerDto);

    expect(dtoError).not.toBeDefined();
  });

  it(`Producer's document when is a valid CNPJ not return an error`, async () => {
    const saveProducerDto = new SaveProducerDto();

    saveProducerDto.fullName = 'Gustavo Egidio Rigoni';
    saveProducerDto.document = '10251426000171';

    const [dtoError]: ValidationError[] = await validate(saveProducerDto);

    expect(dtoError).not.toBeDefined();
  });

  it(`Producer's document when is a valid CPF not return an error`, async () => {
    const saveProducerDto = new SaveProducerDto();

    saveProducerDto.fullName = 'Gustavo Egidio Rigoni';
    saveProducerDto.document = '86170674032';

    const [dtoError]: ValidationError[] = await validate(saveProducerDto);

    expect(dtoError).not.toBeDefined();
  });
});
