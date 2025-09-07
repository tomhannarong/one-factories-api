// src/context/request-context.module.ts
import { Module, Global } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestContextService } from './request-context.service';
import { ALS_TOKEN } from './request-context.types';
import type { RequestContextStore } from './request-context.types';

@Global() // <- ถ้าอยากใช้ข้ามทั้งแอปโดยไม่ต้อง import ซ้ำ (ทางเลือก)
@Module({
  providers: [
    { provide: ALS_TOKEN, useValue: new AsyncLocalStorage<RequestContextStore>() },
    RequestContextService,
  ],
  exports: [RequestContextService, ALS_TOKEN], // <- สำคัญ
})
export class RequestContextModule {}
