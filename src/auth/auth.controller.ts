import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { User } from './decorators/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authenticationService: AuthService,
    private authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    // console.log('req', req);
    return await this.authenticationService.login(req.user);
  }

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  async me(
    @User() authUser: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.header('Cache-Control', 'no-store');
    return authUser;
  }

  @Throttle({
    short: { limit: 1, ttl: 1000 },
    long: { limit: 2, ttl: 60000 },
  })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-tokens')
  refreshTokens(@Request() req: ExpressRequest) {
    if (!req.user) {
      throw new InternalServerErrorException();
    }
    return this.authRefreshTokenService.generateTokenPair(
      (req.user as any).attributes,
      req.headers.authorization?.split(' ')[1],
      (req.user as any).refreshTokenExpiresAt,
    );
  }
}
