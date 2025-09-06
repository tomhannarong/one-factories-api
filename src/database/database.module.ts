import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from './snake-naming.strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.getOrThrow('db.host'),
        port: cfg.getOrThrow<number>('db.port'),
        username: cfg.getOrThrow('db.user'),
        password: cfg.getOrThrow('db.pass'),
        database: cfg.getOrThrow('db.name'),
        ssl: cfg.get('db.ssl') ? { rejectUnauthorized: false } : false,
        autoLoadEntities: true,
        synchronize: false,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class DatabaseModule {}
