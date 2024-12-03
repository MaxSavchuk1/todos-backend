import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
