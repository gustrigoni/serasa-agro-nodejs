import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { FarmCultivation } from '@prisma/client';

export class FarmCultivationEntityDto
  implements Omit<FarmCultivation, 'cultivatedArea'>
{
  @ApiProperty({
    description: "The cultivation's unique identifier number",
  })
  @ApiResponseProperty({
    example: 1,
  })
  readonly id: number;

  @ApiProperty({
    description: 'The cultivation name',
  })
  @ApiResponseProperty({
    example: 'Feijão Vermelho',
  })
  readonly cultivationName: string;

  @ApiProperty({
    description: "The farm's unique identifier number",
  })
  @ApiResponseProperty({
    example: '1',
  })
  readonly farmId: number;

  @ApiProperty({
    description: 'The cultivable area of the farm',
  })
  @ApiResponseProperty({
    example: 1000,
  })
  readonly cultivatedArea: number;

  @ApiProperty({
    description: 'The haverst of cultivation',
  })
  @ApiResponseProperty({
    example: '2021',
  })
  readonly harvest: string;

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
