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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthUpdatePasswordDto } from './dto/auth.update-password-dto';
import { AuthLoginDto } from 'src/auth/dto/auth.login-dto';
import { AuthLoginResponseDto } from './dto/auth.login-response-dto';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
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
  @ApiBody({ type: AuthLoginDto })
  @ApiOkResponse({
    type: AuthLoginResponseDto,
  })
  async login(@Request() req: any) {
    return await this.authenticationService.login(req.user);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserEntity,
  })
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
  @ApiBearerAuth()
  @ApiOkResponse({
    type: AuthLoginResponseDto,
  })
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: AuthUpdatePasswordDto })
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
