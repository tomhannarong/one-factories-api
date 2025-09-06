import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { Logger } from 'nestjs-pino';
import { VersioningType } from '@nestjs/common';
import { GlobalValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const cfg = app.get(ConfigService);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' }); // /v1/...
  app.setGlobalPrefix('');

  app.use(helmet());
  app.use(compression());
  app.enableCors({ origin: cfg.get('security.corsOrigin') || '*' });

  app.useGlobalPipes(GlobalValidationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  const port = cfg.get('app.port', 3000);
  await app.listen(port);
}
bootstrap();
