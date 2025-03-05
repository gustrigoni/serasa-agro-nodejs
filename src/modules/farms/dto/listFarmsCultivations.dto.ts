import { ApiResponseProperty } from '@nestjs/swagger';

export class ListFarmsCultivationsDto {
  @ApiResponseProperty({
    example: 1,
  })
  readonly totalFarmsCount: number;

  @ApiResponseProperty({
    example: 1,
  })
  readonly totalFarmsCountByState: Record<string, number>[];

  @ApiResponseProperty({
    example: 1,
  })
  readonly totalFarmsCountCultivations: Record<string, number>[];

  @ApiResponseProperty({
    example: 30000,
  })
  readonly totalFarmsSumTotalAreas: number;

  @ApiResponseProperty({
    example: 2850.96,
  })
  readonly totalFarmsSumCultivableAreas: number;

  @ApiResponseProperty({
    example: 27000,
  })
  readonly totalFarmsSumPreservationAreas: number;
}
