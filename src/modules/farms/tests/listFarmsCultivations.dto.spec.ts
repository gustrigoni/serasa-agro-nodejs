import { ListFarmsCultivationsDto } from '../dto/listFarmsCultivations.dto';

describe('ListFarmsCultivationsDto', () => {
  it('The ListFarmsCultivationsDto need to match defined type', () => {
    const listFarmsCultivationsDto = new ListFarmsCultivationsDto();

    expect(listFarmsCultivationsDto).toStrictEqual(
      new ListFarmsCultivationsDto(),
    );
  });

  it('The ListFarmsCultivationsDto need to have the correct default values', () => {
    const listFarmsCultivationsDto = new ListFarmsCultivationsDto();

    expect(listFarmsCultivationsDto.totalFarmsCount).toBeUndefined();
    expect(listFarmsCultivationsDto.totalFarmsCountByState).toBeUndefined();
    expect(
      listFarmsCultivationsDto.totalFarmsCountCultivations,
    ).toBeUndefined();
    expect(listFarmsCultivationsDto.totalFarmsSumTotalAreas).toBeUndefined();
    expect(
      listFarmsCultivationsDto.totalFarmsSumCultivableAreas,
    ).toBeUndefined();
    expect(
      listFarmsCultivationsDto.totalFarmsSumPreservationAreas,
    ).toBeUndefined();
  });
});
