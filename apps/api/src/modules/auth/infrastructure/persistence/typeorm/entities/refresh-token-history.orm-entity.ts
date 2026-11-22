import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RefreshSessionOrmEntity } from './refresh-session.orm-entity';

@Entity('refresh_token_history')
@Index('UQ_refresh_token_history_hash', ['tokenHash'], {
  unique: true,
})
@Index('IDX_refresh_token_history_session_id', ['sessionId'])
export class RefreshTokenHistoryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId!: string;

  @ManyToOne(() => RefreshSessionOrmEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session!: RefreshSessionOrmEntity;

  @Column({
    name: 'token_hash',
    type: 'varchar',
    length: 64,
  })
  tokenHash!: string;

  @CreateDateColumn({
    name: 'used_at',
    type: 'timestamptz',
  })
  usedAt!: Date;
}
