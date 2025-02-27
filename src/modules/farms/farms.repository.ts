import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma.service';
import { Prisma, Farm, FarmCultivation } from '@prisma/client';
import { SaveFarmDto } from './dto/saveFarm.dto';
import { SaveFarmCultivationDto } from './dto/saveFarmCultivation.dto';

@Injectable()
export class FarmsRepository {
  constructor(private prisma: PrismaService) {}

  async createFarm(saveFarmDto: SaveFarmDto): Promise<Farm> {
    const farmData = this.prisma.farm.create({ data: saveFarmDto });

    return farmData;
  }

  async findFarmById(farmId: number): Promise<Farm | null> {
    const farmData = this.prisma.farm.findUnique({
      where: { id: farmId },
    });

    return farmData;
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
  ): Promise<FarmCultivation> {
    const farmCultivationData = this.prisma.farmCultivation.create({
      data: saveFarmCultivationDto,
    });

    return farmCultivationData;
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
