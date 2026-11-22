import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { RoleOrmEntity } from './role.orm-entity';
import { PermissionOrmEntity } from './permission.orm-entity';

@Entity('role_permissions')
export class RolePermissionOrmEntity {
  @PrimaryColumn('uuid', { name: 'role_id' })
  roleId!: string;

  @PrimaryColumn('uuid', { name: 'permission_id' })
  permissionId!: string;

  @ManyToOne(() => RoleOrmEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role!: RoleOrmEntity;

  @ManyToOne(() => PermissionOrmEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission!: PermissionOrmEntity;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
