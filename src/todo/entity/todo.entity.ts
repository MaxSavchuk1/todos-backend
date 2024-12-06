import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

export enum TodoStatus {
  NEW = 'new',
  IN_PROCESS = 'in process',
  TESTING = 'testing',
  DONE = 'done',
}

@Entity({ name: 'todos' })
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  body: string;

  @Column({ default: TodoStatus.NEW })
  status: TodoStatus;

  @Column({ type: 'integer', array: true, default: [] })
  children: number[] | TodoEntity[];

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => UserEntity, (user) => user.todos)
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
