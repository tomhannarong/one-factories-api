// src/database/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from './snake-naming.strategy';

const toBool = (v?: string) => /^(1|true|yes)$/i.test(String(v || ''));

const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT || 5432);
const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASS ?? '';
const database = process.env.DB_NAME || 'qc_platform';
const wantSsl = toBool(process.env.DB_SSL);
const isLocalHost = ['localhost', '127.0.0.1'].includes(host);
const ssl = wantSsl && !isLocalHost ? { rejectUnauthorized: false } : undefined;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  ssl, // ← undefined เมื่อไม่ใช้ SSL
  namingStrategy: new SnakeNamingStrategy(),
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: ['migrations/*.{ts,js}'],
});
