// file: src/authz/authz.module.ts
import { Module, Optional } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthzGuard } from './authz.guard';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RequestContextModule } from '../context/request-context.module';

@Module({
  imports: [
    // Optional ALS module — if you don't use ALS yet, remove this import
    RequestContextModule,
  ],
  providers: [
    Reflector,
    // Register as global guard or use @UseGuards(AuthzGuard) per controller
    { provide: APP_GUARD, useClass: AuthzGuard },
  ],
  exports: [],
})
export class AuthzModule {}
