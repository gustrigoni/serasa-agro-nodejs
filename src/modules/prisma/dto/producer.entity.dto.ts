import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Producer } from '@prisma/client';

export class ProducerEntityDto implements Producer {
  @ApiProperty({
    description: "The producer's unique identifier number",
  })
  @ApiResponseProperty({
    example: 1,
  })
  readonly id: number;

  @ApiProperty({
    description: "The producer's full name",
  })
  @ApiResponseProperty({
    example: 'Gustavo Egidio Rigoni',
  })
  readonly fullName: string;

  @ApiProperty({
    description: "The producer's document",
  })
  @ApiResponseProperty({
    example: '93419415044',
  })
  readonly document: string;

  @ApiProperty({
    description: 'The date when the data was created',
  })
  @ApiResponseProperty({
    example: new Date(),
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'The date when the data has last update',
  })
  @ApiResponseProperty({
    example: new Date(),
  })
  readonly updatedAt: Date;
}
