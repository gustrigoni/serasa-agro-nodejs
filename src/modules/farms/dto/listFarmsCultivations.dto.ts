import { ApiResponseProperty } from '@nestjs/swagger';

export class ListFarmsCultivationsDto {
  @ApiResponseProperty({
    example: 1,
  })
  totalFarmsCount: number;

  @ApiResponseProperty({
    example: 1,
  })
  totalFarmsCountByState: Record<string, number>[];

  @ApiResponseProperty({
    example: 1,
  })
  totalFarmsCountCultivations: Record<string, number>[];

  @ApiResponseProperty({
    example: 30000,
  })
  totalFarmsSumTotalAreas: number;

  @ApiResponseProperty({
    example: 2850.96,
  })
  totalFarmsSumCultivableAreas: number;

  @ApiResponseProperty({
    example: 27000,
  })
  totalFarmsSumPreservationAreas: number;
}
