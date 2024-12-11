import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import validationOptions from './utils/validation-options';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('app.apiPrefix'));

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  await app.listen(configService.get('app.port'));
}
bootstrap();
