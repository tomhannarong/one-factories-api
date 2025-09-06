import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule as Pino } from 'nestjs-pino';
import { RequestIdMiddleware } from './request-id.middleware';
import { pinoOptions } from './pino.options';

@Module({ imports: [Pino.forRoot(pinoOptions)] })
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
