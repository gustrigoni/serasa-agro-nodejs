import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidStatesEnum } from '../enums/validStates.enum';

@ValidatorConstraint()
class IsValidStateConstraint implements ValidatorConstraintInterface {
  validate(value: ValidStatesEnum): boolean {
    return Object.values(ValidStatesEnum).includes(value);
  }

  defaultMessage() {
    return 'O estado informado não é válido';
  }
}

export class SaveFarmDto {
  @ApiProperty({
    example: 'Fazenda Coração do Campo',
    description: `Property name`,
  })
  @IsNotEmpty({
    message: 'Nome da propriedade precisa ser informado.',
  })
  @MaxLength(100, {
    message: 'Nome da propriedade deve conter no máximo 100 caracteres.',
  })
  @Matches(/[A-Za-zÀ-ÿ\s]+$/, {
    message: 'Nome da propriedade deve conter apenas letras e espaços.',
  })
  farmName: string;

  @ApiProperty({
    example: 1,
    description: `Producer unique identification that is responsible of the property`,
  })
  @IsNotEmpty({
    message: 'O identificador único do produtor precisa ser informado.',
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'O identificador único do produtor deve ser um número.' },
  )
  producerId: number;

  @ApiProperty({
    example: 'Tubarão',
    description: `Name of the city where the property is located`,
  })
  @IsNotEmpty({
    message:
      'A cidade onde a propriedade está localizada precisa ser informada.',
  })
  @MaxLength(25, {
    message: 'O nome da cidade deve conter no máximo 25 caracteres.',
  })
  @IsString({
    message: 'Nome da cidade deve conter apenas letras',
  })
  city: string;

  @ApiProperty({
    example: 'SC',
    description: `Federative unit where the property is located`,
  })
  @IsNotEmpty({
    message:
      'O estado onde a propriedade está localizada precisa ser informada.',
  })
  @Validate(IsValidStateConstraint)
  state: string;

  @ApiProperty({
    example: 30000,
    description: `Property total area (in hectares)`,
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    },
    { message: 'A área total que compõe a propriedade precisa ser informada.' },
  )
  @Min(0, {
    message: 'A área total informada não pode conter valor negativo',
  })
  totalArea: number;

  @ApiProperty({
    example: 2850.96,
    description: `Property cultivable area (in hectares)`,
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    },
    { message: 'A área cultivável informada não é um valor válido.' },
  )
  @Min(0, {
    message: 'A área cultivável informada não pode conter valor negativo.',
  })
  cultivableArea: number;

  @ApiProperty({
    example: 27000,
    description: `Property preserved area (in hectares)`,
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    },
    { message: 'A área preservada informada não é um valor válido.' },
  )
  @Min(0, {
    message: 'A área preservada informada não pode conter valor negativo.',
  })
  preservedArea: number;
}
