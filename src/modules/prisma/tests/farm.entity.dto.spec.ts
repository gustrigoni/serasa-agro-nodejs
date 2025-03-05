import { FarmEntityDto } from '../dto/farm.entity.dto';

describe('FarmEntityDto', () => {
  it('The FarmEntityDto need to match defined type', () => {
    const farmEntityDto = new FarmEntityDto();

    expect(farmEntityDto).toStrictEqual(new FarmEntityDto());
  });

  it('The FarmEntityDto need to have the correct default values', () => {
    const farmEntityDto = new FarmEntityDto();

    expect(farmEntityDto.id).toBeUndefined();
    expect(farmEntityDto.farmName).toBeUndefined();
    expect(farmEntityDto.producerId).toBeUndefined();
    expect(farmEntityDto.city).toBeUndefined();
    expect(farmEntityDto.state).toBeUndefined();
    expect(farmEntityDto.totalArea).toBeUndefined();
    expect(farmEntityDto.cultivableArea).toBeUndefined();
    expect(farmEntityDto.preservedArea).toBeUndefined();
    expect(farmEntityDto.createdAt).toBeUndefined();
    expect(farmEntityDto.updatedAt).toBeUndefined();
  });
});
