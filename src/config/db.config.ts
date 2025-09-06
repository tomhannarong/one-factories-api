import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  DB_SSL: z.coerce.boolean().default(false),
});

export const dbConfig = registerAs('db', () => {
  const v = schema.parse(process.env);
  return {
    host: v.DB_HOST,
    port: v.DB_PORT,
    user: v.DB_USER,
    pass: v.DB_PASS,
    name: v.DB_NAME,
    ssl: v.DB_SSL,
  } as const;
});
