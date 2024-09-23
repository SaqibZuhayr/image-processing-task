import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Images } from './entities/images';
import { Comments } from './entities/comments';
import { env } from '../common/utils/envConfig';

const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [Images, Comments],
  migrations: ['dist/database/migrations/*.js'],
  schema: 'image-upload',
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
