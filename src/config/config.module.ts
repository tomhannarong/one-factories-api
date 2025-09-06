import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from '@nestjs/config';
import { appConfig } from './app.config';
import { dbConfig } from './db.config';
import { securityConfig } from './security.config';

@Module({
  imports: [
    NestConfig.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, securityConfig],
      // เลือกใช้ validate แบบ zod หรือ Joi
      // validationSchema: joiSchema,
      // หรือ
      // validate: (env) => zodSchema.parse(env),
    }),
  ],
})
export class ConfigModule {}
