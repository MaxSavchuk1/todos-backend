import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthService } from './auth.service';
import { AuthRefreshTokenEntity } from './entity/auth-refresh-token.entity';
import { UserModule } from '../user/user.module';
import { UserEntity } from 'src/modules/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRefreshTokenEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.jwtSecret'),
        signOptions: { expiresIn: configService.get('auth.jwtExpires') },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthRefreshTokenService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
