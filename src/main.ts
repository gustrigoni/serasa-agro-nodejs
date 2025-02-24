import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
