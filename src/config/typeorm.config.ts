import { DataSource } from 'typeorm';
import { dbConfig } from './database.config';

export default new DataSource({
  ...dbConfig,
  type: 'postgres',
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
