import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthUpdatePasswordDto } from './dto/auth-update-password.dto';

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
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: any) {
    return await this.authenticationService.login(req.user);
  }

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  async me(@Request() req: any) {
    return await this.authenticationService.me(req.user);
  }

  @Throttle({
    short: { limit: 1, ttl: 1000 },
    long: { limit: 2, ttl: 60000 },
  })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-tokens')
  refreshTokens(@Request() req: any) {
    if (!req.user) {
      throw new InternalServerErrorException();
    }
    return this.authRefreshTokenService.generateTokenPair(
      req.user.attributes,
      req.headers.authorization?.split(' ')[1],
      req.user.refreshTokenExpiresAt,
    );
  }

  @Put('password')
  @HttpCode(HttpStatus.OK)
  updatePassword(
    @Request() req,
    @Body() authUpdatePasswordDto: AuthUpdatePasswordDto,
  ) {
    return this.authenticationService.updatePassword(
      req.user,
      authUpdatePasswordDto,
    );
  }
}
