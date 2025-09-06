import 'dotenv/config'; // ensure .env is loaded when running typeorm CLI
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from './snake-naming.strategy';

const toBool = (v?: string) => /^(1|true|yes)$/i.test(String(v || ''));

const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT || 5432);
const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASS ?? '';
const database = process.env.DB_NAME || 'qc_platform';
const useSsl = toBool(process.env.DB_SSL);

if (password === '') {
  // Fail fast with a clear message rather than cryptic SASL error
  throw new Error('ENV DB_PASS is empty or undefined. Please set DB_PASS in your .env');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port,
  username,
  password, // must be a non-empty string
  database,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: ['migrations/*.{ts,js}'],
});
