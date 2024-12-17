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
import { Role } from 'src/authorization/enums/role.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

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

  @Column({ type: 'character varying', array: true, default: [Role.User] })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
