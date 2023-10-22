import { DataSource } from 'typeorm';

export const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.PG_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,

  migrationsRun: false,
  logging: true,
  logger: 'simple-console',

  migrations: ['dist/**/migrations/*.js'],
  migrationsTableName: 'history',
});
