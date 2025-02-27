import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Matches, MaxLength, Min } from 'class-validator';

export class SaveFarmCultivationDto {
  @ApiProperty({
    example: 'Feijão Vermelho',
    description: `Farm cultivation name`,
  })
  @IsNotEmpty({
    message: 'Nome da cultura de cultivação precisa ser informado.',
  })
  @MaxLength(50, {
    message:
      'Nome da cultura de cultivação deve conter no máximo 50 caracteres.',
  })
  @Matches(/^[A-Za-zÀ-ÿ-]+(?:\s[A-Za-zÀ-ÿ-]+)*$/, {
    message:
      'Nome da cultura de cultivação deve conter apenas letras, espaços e traços.',
  })
  cultivationName: string;

  @ApiProperty({
    example: 1,
    description: `Property unique identification number`,
  })
  @IsNotEmpty({
    message: 'O identificador único da propriedade precisa ser informado.',
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'O identificador único da propriedade deve ser um número.' },
  )
  farmId: number;

  @ApiProperty({
    example: 1000,
    description: `Property cultivable area (in hectares)`,
  })
  @IsNotEmpty({
    message: 'A área cultivada precisa precisa ser informado.',
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    },
    { message: 'A área cultivada informada não é um valor válido.' },
  )
  @Min(0, {
    message: 'A área cultivada informada não pode conter valor negativo.',
  })
  cultivatedArea: number;

  @ApiProperty({
    example: '2021',
    description: `Harvest year of the cultivation`,
  })
  @IsNotEmpty({
    message: 'A safra do cultivo precisa ser informada.',
  })
  @MaxLength(4, {
    message: 'A safra do cultivo deve conter no máximo 4 caracteres.',
  })
  @Matches(/^[0-9A-Za-z\s-]+$/, {
    message: 'A safra informada não é um valor válido.',
  })
  harvest: string;
}
