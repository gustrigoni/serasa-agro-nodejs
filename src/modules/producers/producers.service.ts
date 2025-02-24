import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProducerDto } from './dto/createProducer.dto';
import { producerDocumentValidation } from 'src/utils/producerDocumentValidation';

@Injectable()
export class ProducersService {
  private prisma = new PrismaClient();

  async createProducer({
    fullName,
    document,
  }: CreateProducerDto): Promise<string> {
    const producerAlreadyExists = await this.prisma.producer.findUnique({
      where: {
        document,
      },
    });

    if (producerAlreadyExists) {
      throw new Error('Já existe um produtor cadastrado com este CPF/CNPJ.');
    }

    await this.prisma.producer.create({
      data: {
        fullName,
        document,
      },
    });

    return fullName + ' - ' + document;
  }
}
