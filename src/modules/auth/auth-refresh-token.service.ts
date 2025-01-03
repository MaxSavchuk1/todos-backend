import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { AuthRefreshTokenEntity } from './entity/auth-refresh-token.entity';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(AuthRefreshTokenEntity)
    private authRefreshTokenRepository: Repository<AuthRefreshTokenEntity>,
  ) {}

  async generateRefreshToken(
    authUserId: number,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUserId },
      {
        secret: this.configService.get('auth.jwtRefreshSecret'),
        expiresIn: this.configService.get('auth.jwtRefreshExpires'),
      },
    );

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      if (
        await this.isRefreshTokenBlackListed(currentRefreshToken, authUserId)
      ) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      await this.authRefreshTokenRepository.insert({
        refreshToken: currentRefreshToken,
        expiresAt: currentRefreshTokenExpiresAt,
        userId: authUserId,
      });
    }

    return newRefreshToken;
  }

  private isRefreshTokenBlackListed(refreshToken: string, userId: number) {
    return this.authRefreshTokenRepository.existsBy({ refreshToken, userId });
  }

  async generateTokenPair(
    user: UserEntity,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.generateRefreshToken(
        user.id,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      ),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredRefreshTokens() {
    await this.authRefreshTokenRepository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    });
  }
}
