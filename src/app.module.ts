// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { HealthModule } from './health/health.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { VersioningSecurityModule } from './versioning-security/versioning-security.module';
import { RequestContextModule } from './context/request-context.module';
import { AlsInitMiddleware } from './context/request-context.middleware';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    HealthModule,
    CommonModule,
    DatabaseModule,
    VersioningSecurityModule,
    RequestContextModule, // <- สำคัญ
  ],
  providers: [AlsInitMiddleware], // <- ให้ DI มองเห็น middleware class
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsInitMiddleware).forRoutes('*');
  }
}
