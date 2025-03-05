import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { ProducerEntityDto } from '../src/modules/prisma/dto/producer.entity.dto';
import { MainModule } from '../src/main.module';
import { SaveProducerDto } from 'src/modules/producers/dto/saveProducer.dto';

describe('Producers (e2e)', () => {
  let app: INestApplication<App>;
  let producerData: ProducerEntityDto;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/producers (POST) - should create a producer', async () => {
    const saveProducerDto: SaveProducerDto = {
      fullName: 'Gustavo Egidio Rigoni',
      document: '91150545003',
    };

    const response = await request(app.getHttpServer())
      .post('/producers')
      .send(saveProducerDto)
      .expect(HttpStatus.CREATED);

    const responseObjects = Object.keys(
      response.body as unknown as ProducerEntityDto,
    );

    producerData = response.body as ProducerEntityDto;

    expect(responseObjects).toBeDefined();
    expect(responseObjects).toStrictEqual(Object.keys(new ProducerEntityDto()));
  });

  it('/producers (POST) - should not create a farm when already has another producer with the document informed', async () => {
    const saveProducerDto: SaveProducerDto = {
      fullName: 'Gustavo Egidio Rigoni',
      document: producerData.document,
    };

    const response = await request(app.getHttpServer())
      .post('/producers')
      .send(saveProducerDto)
      .expect(HttpStatus.BAD_REQUEST);

    const responseData = response.body as unknown as { message: string };

    expect(responseData.message).toBeDefined();
    expect(responseData.message).toBe(
      'Já existe um produtor cadastrado com este CPF/CNPJ.',
    );
  });

  it('/producers (PATCH) - should update a producer', async () => {
    const saveProducerDto: SaveProducerDto = {
      fullName: 'New Gustavo Egidio Rigoni',
      document: '40994249012',
    };

    const response = await request(app.getHttpServer())
      .patch(`/producers/${producerData.id}`)
      .send(saveProducerDto)
      .expect(HttpStatus.OK);

    const responseObjects = Object.keys(
      response.body as unknown as ProducerEntityDto,
    );

    producerData = response.body as ProducerEntityDto;

    expect(responseObjects).toBeDefined();
    expect(responseObjects).toStrictEqual(Object.keys(new ProducerEntityDto()));
  });

  it('/producers (PATCH) - should not update a producer when producer unique id not exists', async () => {
    const saveProducerDto: SaveProducerDto = {
      fullName: 'New Gustavo Egidio Rigoni',
      document: '40994249012',
    };

    const response = await request(app.getHttpServer())
      .patch(`/producers/0`)
      .send(saveProducerDto)
      .expect(HttpStatus.BAD_REQUEST);

    const responseData = response.body as unknown as { message: string };

    expect(responseData.message).toBeDefined();
    expect(responseData.message).toBe('O produtor informado não existe.');
  });

  it('/producers (PATCH) - should not update a producer when already has another producer with the document informed ', async () => {
    const createNewProducerDto: SaveProducerDto = {
      fullName: 'Maria das Dores',
      document: '49838329045',
    };

    const newProducer = await request(app.getHttpServer())
      .post('/producers')
      .send(createNewProducerDto);

    const saveProducerDto: SaveProducerDto = {
      fullName: 'New Gustavo Egidio Rigoni',
      document: '49838329045',
    };

    const response = await request(app.getHttpServer())
      .patch(`/producers/${producerData.id}`)
      .send(saveProducerDto)
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer()).delete(
      `/producers/${(newProducer.body as unknown as { id: number }).id}`,
    );

    const responseData = response.body as unknown as { message: string };

    expect(responseData.message).toBeDefined();
    expect(responseData.message).toBe(
      'Já existe um produtor cadastrado com este CPF/CNPJ.',
    );
  });

  it('/producers (DELETE) - should remove a producer', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/producers/${producerData.id}`)
      .expect(HttpStatus.OK);

    const responseObjects = Object.keys(
      response.body as unknown as ProducerEntityDto,
    );

    producerData = response.body as ProducerEntityDto;

    expect(responseObjects).toBeDefined();
    expect(responseObjects).toStrictEqual(Object.keys(new ProducerEntityDto()));
  });

  it('/producers (DELETE) - should not remove a producer when producer unique id not exists', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/producers/0`)
      .expect(HttpStatus.BAD_REQUEST);

    const responseData = response.body as unknown as { message: string };

    expect(responseData.message).toBeDefined();
    expect(responseData.message).toBe('O produtor informado não existe.');
  });
});
