import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => [
        { ttl: cfg.get('security.rateTtl', 60), limit: cfg.get('security.rateLimit', 100) },
      ],
    }),
  ],
})
export class VersioningSecurityModule {}
