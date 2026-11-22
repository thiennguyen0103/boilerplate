import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { UserOrmEntity } from 'src/modules/users/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from './role.orm-entity';

@Entity('user_roles')
export class UserRoleOrmEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @PrimaryColumn('uuid', { name: 'role_id' })
  roleId!: string;

  @ManyToOne(() => UserOrmEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserOrmEntity;

  @ManyToOne(() => RoleOrmEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role!: RoleOrmEntity;

  @Column({
    name: 'assigned_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  assignedAt!: Date;

  @Column({
    name: 'assigned_by',
    type: 'uuid',
    nullable: true,
  })
  assignedBy!: string | null;
}
