import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TodoStatus {
  NEW = 'new',
  IN_PROCESS = 'in process',
  TESTING = 'testing',
  DONE = 'done',
}

@Entity({ name: 'todos' })
export class TodoEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ nullable: true })
  body: string;

  @ApiProperty()
  @Column({ default: TodoStatus.NEW })
  status: TodoStatus;

  @ApiProperty()
  @Column({ type: 'integer', array: true, default: [] })
  children: Array<number | TodoEntity>;

  @ApiProperty()
  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => UserEntity, (user) => user.todos, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
