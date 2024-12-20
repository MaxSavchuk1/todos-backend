import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/modules/user/entity/user.entity';

@Entity({ name: 'projects' })
export class ProjectEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  projectName: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  projectDescription: string;

  @ApiProperty()
  @Column({ type: 'integer', nullable: false })
  projectManager: number;

  @ApiProperty()
  @Column({ type: 'integer', array: true, default: [] })
  assignedUsers: number[];

  @ManyToMany(() => UserEntity, (user) => user.userProjects)
  assignedUsersRelation: UserEntity[];

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
