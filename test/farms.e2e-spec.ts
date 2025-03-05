import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { SaveFarmDto } from '../src/modules/farms/dto/saveFarm.dto';
import { FarmEntityDto } from '../src/modules/prisma/dto/farm.entity.dto';
import { ProducerEntityDto } from '../src/modules/prisma/dto/producer.entity.dto';
import { MainModule } from '../src/main.module';
import { SaveFarmCultivationDto } from '../src/modules/farms/dto/saveFarmCultivation.dto';
import { FarmCultivationEntityDto } from '../src/modules/prisma/dto/farmCultivation.entity.dto';

describe('Farms (e2e)', () => {
  let app: INestApplication<App>;

  let producerData: ProducerEntityDto;
  let farmData: FarmEntityDto;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const createProducerRequest = await request(app.getHttpServer())
      .post('/producers')
      .send({
        fullName: 'Gustavo Egidio Rigoni',
        document: '10859250000135',
      });

    producerData = createProducerRequest.body as ProducerEntityDto;
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete(`/producers/${producerData.id}`);
  });

  it('/farms (POST) - should create a farm', async () => {
    const saveFarmDto: SaveFarmDto = {
      farmName: 'Fazenda Teste',
      producerId: producerData.id,
      city: 'Tubarão',
      state: 'SC',
      totalArea: 100,
      cultivableArea: 80,
      preservedArea: 20,
    };

    const response = await request(app.getHttpServer())
      .post('/farms')
      .send(saveFarmDto)
      .expect(HttpStatus.CREATED);

    const responseObjects = Object.keys(
      response.body as unknown as FarmEntityDto,
    );

    farmData = response.body as FarmEntityDto;

    expect(responseObjects).toBeDefined();
    expect(responseObjects).toStrictEqual(Object.keys(new FarmEntityDto()));
  });

  it('/farms (POST) - should not create a farm when producer unique id not exists', async () => {
    const saveFarmDto: SaveFarmDto = {
      farmName: 'Fazenda Teste',
      producerId: 0,
      city: 'Tubarão',
      state: 'SC',
      totalArea: 100,
      cultivableArea: 80,
      preservedArea: 20,
    };

    const response = await request(app.getHttpServer())
      .post('/farms')
      .send(saveFarmDto)
      .expect(HttpStatus.BAD_REQUEST);

    const responseData = response.body as unknown as { message: string };

    expect(responseData.message).toBeDefined();
    expect(responseData.message).toBe('O produtor informado não existe.');
  });

  it('/farms (POST) - should not create a farm when the sum of cultivable and preserverd areas is greater than total area', async () => {
    const saveFarmDto: SaveFarmDto = {
      farmName: 'Fazenda Teste',
      producerId: producerData.id,
      city: 'Tubarão',
      state: 'SC',
      totalArea: 100,
      cultivableArea: 90,
      preservedArea: 20,
    };

    const response = await request(app.getHttpServer())
      .post('/farms')
      .send(saveFarmDto)
      .expect(HttpStatus.BAD_REQUEST);

    const responseData = response.body as unknown as { message: string };

    expect(responseData.message).toBeDefined();
    expect(responseData.message).toBe(
      'A área em uso não coincide com a área total da propriedade.',
    );
  });

  it('/farms/cultivations (POST) - should create a cultivation', async () => {
    const saveFarmCultivationDto: SaveFarmCultivationDto = {
      cultivationName: 'Feijão Vermelho',
      farmId: farmData.id,
      cultivatedArea: 10,
      harvest: '2025',
    };

    const response = await request(app.getHttpServer())
      .post('/farms/cultivation')
      .send(saveFarmCultivationDto)
      .expect(HttpStatus.CREATED);

    const responseObjects = Object.keys(
      response.body as unknown as FarmCultivationEntityDto,
    );

    expect(responseObjects).toBeDefined();
    expect(responseObjects).toStrictEqual(
      Object.keys(new FarmCultivationEntityDto()),
    );
  });

  it('/farms/cultivations (POST) - should not create a cultivation when cultivated area is already used', async () => {
    const saveFarmCultivationDto: SaveFarmCultivationDto = {
      cultivationName: 'Feijão Vermelho',
      farmId: farmData.id,
      cultivatedArea: 110,
      harvest: '2025',
    };

    const response = await request(app.getHttpServer())
      .post('/farms/cultivation')
      .send(saveFarmCultivationDto)
      .expect(HttpStatus.BAD_REQUEST);

    const responseData = response.body as unknown as { message: string };

    expect(responseData.message).toBeDefined();
    expect(responseData.message).toBe(
      'A propriedade não possui esta área para cultivo.',
    );
  });

  it('/farms/cultivations (POST) - should not create a cultivation when farm unique id not exists', async () => {
    const saveFarmCultivationDto: SaveFarmCultivationDto = {
      cultivationName: 'Feijão Vermelho',
      farmId: 0,
      cultivatedArea: 10,
      harvest: '2025',
    };

    const response = await request(app.getHttpServer())
      .post('/farms/cultivation')
      .send(saveFarmCultivationDto)
      .expect(HttpStatus.BAD_REQUEST);

    const responseData = response.body as unknown as { message: string };

    expect(responseData.message).toBeDefined();
    expect(responseData.message).toBe('A propriedade informada não existe.');
  });

  it('/farms/statistics (GET)', () => {
    return request(app.getHttpServer())
      .get('/farms/statistics')
      .expect(HttpStatus.OK);
  });
});
