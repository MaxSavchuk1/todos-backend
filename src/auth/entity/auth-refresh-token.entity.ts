import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity({ name: 'auth_refresh_tokens' })
export class AuthRefreshTokenEntity {
  @PrimaryColumn()
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @Column({ name: 'userId' })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
