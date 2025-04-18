import { Uuid } from '@common/types/common.type';
import { hashPassword as hashPass } from '@common/utils/password.util';
import { AbstractEntity } from '@database/entities/abstract.entity';
import { RoleEntity } from '@modules/role/entities/role.entity';
import { SessionEntity } from '@modules/session/entities/session.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user', { schema: 'public' })
export class UserEntity extends AbstractEntity {
  constructor(data?: Partial<UserEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_user_id' })
  id!: Uuid;

  @Column()
  @Index('UQ_user_email', { where: '"deleted_at" IS NULL', unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    length: 50,
    nullable: true,
  })
  @Index('UQ_user_info_username', {
    where: '"deleted_at" IS NULL',
    unique: true,
  })
  username!: string;

  @Column({
    length: 50,
    nullable: true,
  })
  name: string;

  @Column({
    length: 255,
    nullable: true,
  })
  avatar: string;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive?: boolean;

  @Column({ name: 'is_confirmed', type: 'boolean', default: false })
  isConfirmed?: boolean;

  @Column({ name: 'role_id', type: 'uuid' })
  roleId: Uuid;

  @OneToOne(() => RoleEntity)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_user_role',
  })
  role: RoleEntity;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions?: SessionEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashPass(this.password);
    }
  }
}
