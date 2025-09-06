import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  APP_PORT: z.coerce.number().default(3000),
  APP_NAME: z.string().default('qc-platform'),
});

export const appConfig = registerAs('app', () => {
  const parsed = schema.parse(process.env);
  return {
    env: parsed.NODE_ENV,
    port: parsed.APP_PORT,
    name: parsed.APP_NAME,
  } as const;
});
