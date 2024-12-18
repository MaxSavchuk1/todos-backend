import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import validationOptions from './utils/validation-options';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Todos')
    .setDescription('Todos api')
    .setVersion('0.1')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('app.apiPrefix'));

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  await app.listen(configService.get('app.port'));
}
bootstrap();
