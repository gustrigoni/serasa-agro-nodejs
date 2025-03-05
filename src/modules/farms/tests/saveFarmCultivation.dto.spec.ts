import { validate } from 'class-validator';
import { SaveFarmCultivationDto } from '../dto/saveFarmCultivation.dto';

describe('SaveFarmCultivationDto', () => {
  describe(`Cultivation Name`, () => {
    it(`The object cultivationName need to return a ValidationError value when it contains symbols`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = 'Aipim!';
      saveFarmCultivationDto.farmId = 1;
      saveFarmCultivationDto.cultivatedArea = 87.76;
      saveFarmCultivationDto.harvest = '2025';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.matches).toBe(
        'Nome da cultura de cultivação deve conter apenas letras, espaços e traços.',
      );
    });

    it(`The object cultivationName need to return a ValidationError value when it contains than a 50 characters`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = Array(51)
        .fill('X')
        .toString()
        .replaceAll(',', '');
      saveFarmCultivationDto.farmId = 1;
      saveFarmCultivationDto.cultivatedArea = 87.76;
      saveFarmCultivationDto.harvest = '2025';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.maxLength).toBe(
        'Nome da cultura de cultivação deve conter no máximo 50 caracteres.',
      );
    });

    it(`The object cultivationName need to return a ValidationError value when it is empty`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.farmId = 1;
      saveFarmCultivationDto.cultivatedArea = 87.76;
      saveFarmCultivationDto.harvest = '2025';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNotEmpty).toBe(
        'Nome da cultura de cultivação precisa ser informado.',
      );
    });
  });

  describe('Farm ID', () => {
    it(`The object farmId need to return a ValidationError value when it is not a number`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = 'Aipim';
      saveFarmCultivationDto.farmId = '1' as unknown as number;
      saveFarmCultivationDto.cultivatedArea = 87.76;
      saveFarmCultivationDto.harvest = '2025';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNumber).toBe(
        'O identificador único da propriedade deve ser um número.',
      );
    });

    it(`The object farmId need to return a ValidationError value when it is empty`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = 'Aipim';
      saveFarmCultivationDto.cultivatedArea = 87.76;
      saveFarmCultivationDto.harvest = '2025';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNotEmpty).toBe(
        'O identificador único da propriedade precisa ser informado.',
      );
    });
  });

  describe('Cultivated Area', () => {
    it(`The object cultivatedArea need to return a ValidationError value when it is less than zero`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = 'Aipim';
      saveFarmCultivationDto.farmId = 1;
      saveFarmCultivationDto.cultivatedArea = -1;
      saveFarmCultivationDto.harvest = '2025';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.min).toBe(
        'A área cultivada informada não pode conter valor negativo.',
      );
    });

    it(`The object cultivatedArea need to return a ValidationError value when it is not a number`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = 'Aipim';
      saveFarmCultivationDto.farmId = 1;
      saveFarmCultivationDto.cultivatedArea = '1' as unknown as number;
      saveFarmCultivationDto.harvest = '2025';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNumber).toBe(
        'A área cultivada informada não é um valor válido.',
      );
    });

    it(`The object cultivatedArea need to return a ValidationError value when it contains a value with greather of two decimal places`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = 'Aipim';
      saveFarmCultivationDto.farmId = 1;
      saveFarmCultivationDto.cultivatedArea = 87.3456;
      saveFarmCultivationDto.harvest = '2025';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNumber).toBe(
        'A área cultivada informada não é um valor válido.',
      );
    });

    it(`The object cultivatedArea need to return a ValidationError value when it is empty`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = 'Aipim';
      saveFarmCultivationDto.farmId = 1;
      saveFarmCultivationDto.harvest = '2025';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNotEmpty).toBe(
        'A área cultivada precisa precisa ser informado.',
      );
    });
  });

  describe('Harvest', () => {
    it(`The object harvest need to return a ValidationError value when it contains symbols`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = 'Aipim';
      saveFarmCultivationDto.farmId = 1;
      saveFarmCultivationDto.cultivatedArea = 87.76;
      saveFarmCultivationDto.harvest = '25,A';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.matches).toBe(
        'A safra informada não é um valor válido.',
      );
    });

    it(`The object harvest need to return a ValidationError value when it contains than a 4 characters`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = 'Aipim';
      saveFarmCultivationDto.farmId = 1;
      saveFarmCultivationDto.cultivatedArea = 87.76;
      saveFarmCultivationDto.harvest = 'XXXXX';

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.maxLength).toBe(
        'A safra do cultivo deve conter no máximo 4 caracteres.',
      );
    });

    it(`The object harvest need to return a ValidationError value when it is empty`, async () => {
      const saveFarmCultivationDto = new SaveFarmCultivationDto();

      saveFarmCultivationDto.cultivationName = 'Aipim';
      saveFarmCultivationDto.farmId = 1;
      saveFarmCultivationDto.cultivatedArea = 87.76;

      const [dtoError] = await validate(saveFarmCultivationDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNotEmpty).toBe(
        'A safra do cultivo precisa ser informada.',
      );
    });
  });

  it(`The SaveFarmCultivationDto object does not return a ValidationError value when the data is valid`, async () => {
    const saveFarmCultivationDto = new SaveFarmCultivationDto();

    saveFarmCultivationDto.cultivationName = 'Aipim';
    saveFarmCultivationDto.farmId = 1;
    saveFarmCultivationDto.cultivatedArea = 87.76;
    saveFarmCultivationDto.harvest = '2025';

    const [dtoError] = await validate(saveFarmCultivationDto);

    expect(dtoError).not.toBeDefined();
  });
});
