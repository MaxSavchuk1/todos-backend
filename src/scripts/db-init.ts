import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DbInitializationService } from '../db-initialization/db-initialization.service';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);

  const dbInitializationService = application.get(DbInitializationService, {
    strict: false,
  });

  console.log('Db init started.');
  await dbInitializationService.dbInit();
  console.log('Db init completed.');

  await application.close();
  process.exit(0);
}

bootstrap();
