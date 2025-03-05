import { validate } from 'class-validator';
import { SaveFarmDto } from '../dto/saveFarm.dto';

describe('SaveFarmDto', () => {
  describe(`Farm Name`, () => {
    it(`The object farmName need to return a ValidationError value when it contains than a 100 characters`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = Array(101)
        .fill('X')
        .toString()
        .replaceAll(',', '');
      saveFarmDto.producerId = 0;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.maxLength).toBe(
        'Nome da propriedade deve conter no máximo 100 caracteres.',
      );
    });

    it(`The object farmName need to return a ValidationError value when it contains symbols`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Lorem ipsum.';
      saveFarmDto.producerId = 0;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.matches).toBe(
        'Nome da propriedade deve conter apenas letras e espaços.',
      );
    });

    it(`The object farmName need to return a ValidationError value when it is empty`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = '';
      saveFarmDto.producerId = 0;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNotEmpty).toBe(
        'Nome da propriedade precisa ser informado.',
      );
    });
  });

  describe('Producer ID', () => {
    it(`The object producerId need to return a ValidationError value when it is not a number`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = '0' as unknown as number;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNumber).toBe(
        'O identificador único do produtor deve ser um número.',
      );
    });

    it(`The object producerId need to return a ValidationError value when it is empty`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNotEmpty).toBe(
        'O identificador único do produtor precisa ser informado.',
      );
    });
  });

  describe('City Name', () => {
    it(`The object city need to return a ValidationError value when it is not a string`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 3 as unknown as string;
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isString).toBe(
        'Nome da cidade deve conter apenas letras.',
      );
    });

    it(`The object city need to return a ValidationError value when it contains than a 25 characters`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = Array(26).fill('X').toString().replaceAll(',', '');
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.maxLength).toBe(
        'O nome da cidade deve conter no máximo 25 caracteres.',
      );
    });

    it(`The object city need to return a ValidationError value when it contains symbols`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão!';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.matches).toBe(
        'Nome da cidade deve conter apenas letras, espaços e traços.',
      );
    });

    it(`The object city need to return a ValidationError value when it is empty`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNotEmpty).toBe(
        'A cidade onde a propriedade está localizada precisa ser informada.',
      );
    });
  });

  describe('State Name', () => {
    it(`The object state need to return a ValidationError value when it is not a ValidStatesEnum value`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'XX';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.IsValidStateConstraint).toBe(
        'O estado informado não é válido.',
      );
    });

    it(`The object state need to return a ValidationError value when it is empty`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNotEmpty).toBe(
        'O estado onde a propriedade está localizada precisa ser informada.',
      );
    });
  });

  describe('Total Area', () => {
    it(`The object totalArea need to return a ValidationError value when it is less than zero`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = -100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.min).toBe(
        'A área total informada não pode conter valor negativo.',
      );
    });

    it(`The object totalArea need to return a ValidationError value when it is not a number`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = '100' as unknown as number;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNumber).toBe(
        'A área total que compõe a propriedade precisa ser informada.',
      );
    });

    it(`The object totalArea need to return a ValidationError value when it contains a value with greather of two decimal places`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100.679;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNumber).toBe(
        'A área total que compõe a propriedade precisa ser informada.',
      );
    });
  });

  describe('Cultivable Area', () => {
    it(`The object cultivableArea need to return a ValidationError value when it is less than zero`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = -1;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.min).toBe(
        'A área cultivável informada não pode conter valor negativo.',
      );
    });

    it(`The object cultivableArea need to return a ValidationError value when it is not a number`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = '1' as unknown as number;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNumber).toBe(
        'A área cultivável informada não é um valor válido.',
      );
    });

    it(`The object cultivableArea need to return a ValidationError value when it contains a value with greather of two decimal places`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 100.679;
      saveFarmDto.preservedArea = 0;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNumber).toBe(
        'A área cultivável informada não é um valor válido.',
      );
    });
  });

  describe('Cultivable Area', () => {
    it(`The object preservedArea need to return a ValidationError value when it is less than zero`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = -1;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.min).toBe(
        'A área preservada informada não pode conter valor negativo.',
      );
    });

    it(`The object preservedArea need to return a ValidationError value when it is not a number`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = '1' as unknown as number;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNumber).toBe(
        'A área preservada informada não é um valor válido.',
      );
    });

    it(`The object preservedArea need to return a ValidationError value when it contains a value with greather of two decimal places`, async () => {
      const saveFarmDto = new SaveFarmDto();

      saveFarmDto.farmName = 'Fazenda Bom Jardim';
      saveFarmDto.producerId = 1;
      saveFarmDto.city = 'Tubarão';
      saveFarmDto.state = 'SC';
      saveFarmDto.totalArea = 100;
      saveFarmDto.cultivableArea = 0;
      saveFarmDto.preservedArea = 100.679;

      const [dtoError] = await validate(saveFarmDto);

      expect(dtoError).toBeDefined();
      expect(dtoError.constraints?.isNumber).toBe(
        'A área preservada informada não é um valor válido.',
      );
    });
  });

  it(`The SaveFarmDto object does not return a ValidationError value when the data is valid`, async () => {
    const saveFarmDto = new SaveFarmDto();

    saveFarmDto.farmName = 'Fazenda Bom Jardim';
    saveFarmDto.producerId = 1;
    saveFarmDto.city = 'Tubarão';
    saveFarmDto.state = 'SC';
    saveFarmDto.totalArea = 100;
    saveFarmDto.cultivableArea = 0;
    saveFarmDto.preservedArea = 0;

    const [dtoError] = await validate(saveFarmDto);

    expect(dtoError).not.toBeDefined();
  });
});
