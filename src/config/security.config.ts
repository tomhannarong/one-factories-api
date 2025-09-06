import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  CORS_ORIGIN: z.string().default('*'),
  RATE_TTL: z.coerce.number().default(60),
  RATE_LIMIT: z.coerce.number().default(100),
});

export const securityConfig = registerAs('security', () => {
  const v = schema.parse(process.env);
  return { corsOrigin: v.CORS_ORIGIN, rateTtl: v.RATE_TTL, rateLimit: v.RATE_LIMIT } as const;
});
