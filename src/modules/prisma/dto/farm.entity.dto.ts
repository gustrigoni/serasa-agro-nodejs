import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Farm } from '@prisma/client';

export class FarmEntityDto
  implements Omit<Farm, 'totalArea' | 'cultivableArea' | 'preservedArea'>
{
  @ApiProperty({
    description: "The farm's unique identifier number",
  })
  @ApiResponseProperty({
    example: 1,
  })
  readonly id: number;

  @ApiProperty({
    description: 'The farm name',
  })
  @ApiResponseProperty({
    example: 'Fazenda Coração do Campo',
  })
  readonly farmName: string;

  @ApiProperty({
    description: "The farm producer's unique identifier number",
  })
  @ApiResponseProperty({
    example: '1',
  })
  readonly producerId: number;

  @ApiProperty({
    description: 'The city of farm is located',
  })
  @ApiResponseProperty({
    example: 'Tubarão',
  })
  readonly city: string;

  @ApiProperty({
    description: 'The state of farm is located',
  })
  @ApiResponseProperty({
    example: 'SC',
  })
  readonly state: string;

  @ApiProperty({
    description: 'The total area of the farm',
  })
  @ApiResponseProperty({
    example: 30000,
  })
  readonly totalArea: number;

  @ApiProperty({
    description: 'The cultivable area of the farm',
  })
  @ApiResponseProperty({
    example: 2850.96,
  })
  readonly cultivableArea: number;

  @ApiProperty({
    description: 'The preserved area of the farm',
  })
  @ApiResponseProperty({
    example: 27000,
  })
  readonly preservedArea: number;

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
