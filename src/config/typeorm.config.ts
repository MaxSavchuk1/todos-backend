import { DataSource } from 'typeorm';
import { dbConfig } from './database.config';

const isDev = process.env.NODE_ENV === 'development';

export default new DataSource({
  ...dbConfig,
  type: 'postgres',
  entities: [isDev ? 'src/**/entities/*.ts' : 'dist/**/entities/*.js'],
  migrations: [isDev ? 'src/migrations/*.ts' : 'dist/migrations/*.js'],
});
