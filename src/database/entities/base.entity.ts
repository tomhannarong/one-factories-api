import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum EntityStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn({ type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt: Date;
}
