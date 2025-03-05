import { FarmCultivationEntityDto } from '../dto/farmCultivation.entity.dto';

describe('FarmCultivationEntityDto', () => {
  it('The FarmCultivationEntityDto need to match defined type', () => {
    const farmCultivationEntityDto = new FarmCultivationEntityDto();

    expect(farmCultivationEntityDto).toStrictEqual(
      new FarmCultivationEntityDto(),
    );
  });

  it('The FarmCultivationEntityDto need to have the correct default values', () => {
    const farmCultivationEntityDto = new FarmCultivationEntityDto();

    expect(farmCultivationEntityDto.id).toBeUndefined();
    expect(farmCultivationEntityDto.cultivationName).toBeUndefined();
    expect(farmCultivationEntityDto.farmId).toBeUndefined();
    expect(farmCultivationEntityDto.cultivatedArea).toBeUndefined();
    expect(farmCultivationEntityDto.harvest).toBeUndefined();
    expect(farmCultivationEntityDto.updatedAt).toBeUndefined();
  });
});
