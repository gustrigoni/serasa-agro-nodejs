import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { producerDocumentValidation } from './../../../utils/producerDocumentValidation';

@ValidatorConstraint()
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return producerDocumentValidation(value);
  }

  defaultMessage() {
    return 'O documento informado não é um CPF ou CNPJ válido.';
  }
}

export class CreateProducerDto {
  @ApiProperty({
    example: 'Gustavo Egidio Rigoni',
  })
  @IsNotEmpty({
    message: 'Nome completo do produtor precisa ser informado.',
  })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Nome completo do produtor deve conter apenas letras e espaços.',
  })
  fullName: string;

  @ApiProperty({
    example: '93419415044',
  })
  @Validate(IsValidDocumentConstraint)
  document: string;
}
