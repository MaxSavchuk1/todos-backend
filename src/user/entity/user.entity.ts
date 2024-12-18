import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Hash from '../../utils/hash';
import { TodoEntity } from '../../todo/entity/todo.entity';
import { AuthRefreshTokenEntity } from 'src/auth/entity/auth-refresh-token.entity';
import { Role } from 'src/role/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      this.password = await Hash.make(this.password);
    }
  }

  @OneToMany(() => TodoEntity, (todo) => todo.user, {
    cascade: true,
  })
  todos: TodoEntity[];

  @OneToMany(() => AuthRefreshTokenEntity, (token) => token.userId, {
    cascade: true,
  })
  tokens: AuthRefreshTokenEntity[];

  @ApiProperty()
  @Column({ type: 'character varying', array: true, default: [Role.User] })
  roles: Role[];

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
