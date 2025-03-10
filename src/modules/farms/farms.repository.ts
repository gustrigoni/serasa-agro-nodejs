import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SaveFarmDto } from './dto/saveFarm.dto';
import { SaveFarmCultivationDto } from './dto/saveFarmCultivation.dto';
import { FarmEntityDto } from '../prisma/dto/farm.entity.dto';
import { FarmCultivationEntityDto } from '../prisma/dto/farmCultivation.entity.dto';
import { FarmsRepositoryInterface } from './interfaces/farms.repository.interface';

@Injectable()
export class FarmsRepository implements FarmsRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async createFarm(saveFarmDto: SaveFarmDto): Promise<FarmEntityDto> {
    const farmData = await this.prisma.farm.create({ data: saveFarmDto });

    return {
      ...farmData,
      totalArea: farmData.totalArea.toNumber(),
      cultivableArea: farmData.cultivableArea.toNumber(),
      preservedArea: farmData.preservedArea.toNumber(),
    };
  }

  async findFarmById(farmId: number): Promise<FarmEntityDto | null> {
    const farmData = await this.prisma.farm.findUnique({
      where: { id: farmId },
    });

    if (!farmData) {
      return null;
    }

    return {
      ...farmData,
      totalArea: farmData.totalArea.toNumber(),
      cultivableArea: farmData.cultivableArea.toNumber(),
      preservedArea: farmData.preservedArea.toNumber(),
    };
  }

  async findCultivatedAreaByFarmId(farmId: number): Promise<Prisma.Decimal> {
    const [farmCultivationData] = await this.prisma.farmCultivation.groupBy({
      by: ['farmId'],
      _sum: {
        cultivatedArea: true,
      },
      where: {
        farmId: farmId,
      },
    });

    if (!farmCultivationData?._sum?.cultivatedArea) {
      return new Prisma.Decimal(0);
    }

    return farmCultivationData._sum.cultivatedArea;
  }

  async createFarmCultivation(
    saveFarmCultivationDto: SaveFarmCultivationDto,
  ): Promise<FarmCultivationEntityDto> {
    const farmCultivationData = await this.prisma.farmCultivation.create({
      data: saveFarmCultivationDto,
    });

    return {
      ...farmCultivationData,
      cultivatedArea: farmCultivationData.cultivatedArea.toNumber(),
    };
  }

  async countFarms(): Promise<number> {
    const farmData = await this.prisma.farm.count();

    return farmData;
  }

  async sumFarmsTotalArea(): Promise<Prisma.Decimal | null> {
    const farmData = await this.prisma.farm.aggregate({
      _sum: {
        totalArea: true,
      },
    });

    return farmData?._sum?.totalArea;
  }

  async countFarmsByState(): Promise<Record<string, number>[]> {
    const farmData = await this.prisma.farm.groupBy({
      by: ['state'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: { id: 'desc' },
      },
    });

    return farmData.map((farm) => {
      return {
        [farm.state]: farm._count.id,
      };
    });
  }

  async countFarmsCultivations(): Promise<Record<string, number>[]> {
    const farmData = await this.prisma.farmCultivation.groupBy({
      by: ['cultivationName'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: { id: 'desc' },
      },
    });

    return farmData.map((farm) => {
      return {
        [farm.cultivationName]: farm._count.id,
      };
    });
  }

  async sumFarmsCultivableAndPreservationAreas(): Promise<
    Pick<Prisma.FarmSumAggregateOutputType, 'cultivableArea' | 'preservedArea'>
  > {
    const farmData = await this.prisma.farm.aggregate({
      _sum: {
        cultivableArea: true,
        preservedArea: true,
      },
    });

    return {
      cultivableArea: farmData?._sum?.cultivableArea || null,
      preservedArea: farmData?._sum?.preservedArea || null,
    };
  }
}
