import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  MaxLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { producerDocumentIsValid } from '../../../utils/producerDocumentIsValid';

@ValidatorConstraint()
class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return producerDocumentIsValid(value);
  }

  defaultMessage() {
    return 'O documento informado não é um CPF ou CNPJ válido.';
  }
}

export class SaveProducerDto {
  @ApiProperty({
    example: 'Gustavo Egidio Rigoni',
    description: 'Producer full name',
  })
  @IsNotEmpty({
    message: 'Nome completo do produtor precisa ser informado.',
  })
  @Matches(/^(?=.*\s)[A-Za-zÀ-ÿ\s]+$/, {
    message:
      'Nome completo do produtor deve conter apenas letras e deve ser informado o sobrenome.',
  })
  @MaxLength(75, {
    message: 'Nome completo do produtor deve conter no máximo 75 caracteres.',
  })
  fullName: string;

  @ApiProperty({
    example: '93419415044',
    description: 'Producer document (CPF/CNPJ)',
  })
  @Validate(IsValidDocumentConstraint)
  document: string;
}
