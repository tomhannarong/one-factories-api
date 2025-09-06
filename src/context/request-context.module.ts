import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { ALS_TOKEN, RequestContextStore } from './request-context.types';
import { RequestContextService } from './request-context.service';

@Module({
  providers: [
    { provide: ALS_TOKEN, useValue: new AsyncLocalStorage<RequestContextStore>() },
    RequestContextService,
  ],
  exports: [RequestContextService, ALS_TOKEN],
})
export class RequestContextModule {}
