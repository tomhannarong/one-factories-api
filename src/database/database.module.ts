// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from './snake-naming.strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const host = cfg.get<string>('db.host') ?? 'localhost';
        const wantSsl = cfg.get<boolean>('db.ssl') === true;
        const isLocalHost = ['localhost', '127.0.0.1'].includes(host);

        // ปิด SSL อัตโนมัติถ้าเป็น localhost แม้ DB_SSL จะเป็น true
        const useSsl = wantSsl && !isLocalHost;
        const ssl = useSsl ? { rejectUnauthorized: false } : undefined;

        return {
          type: 'postgres',
          host,
          port: cfg.get<number>('db.port') ?? 5432,
          username: cfg.get<string>('db.user') ?? 'postgres',
          password: cfg.get<string>('db.pass') ?? '',
          database: cfg.get<string>('db.name') ?? 'qc_platform',
          namingStrategy: new SnakeNamingStrategy(),
          autoLoadEntities: true,
          synchronize: false,
          ssl, // ← สำคัญ: undefined = ไม่ใช้ SSL
        };
      },
    }),
  ],
})
export class DatabaseModule {}
