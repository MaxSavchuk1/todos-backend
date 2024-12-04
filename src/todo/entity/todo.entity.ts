import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TodoStatus {
  NEW = 'new',
  IN_PROCESS = 'in process',
  TESTING = 'testing',
  DONE = 'done',
}

@Entity({ name: 'todo' })
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

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
