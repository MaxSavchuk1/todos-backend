import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userService: UserService;

  constructor(userService: UserService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwtSecret'),
    });
    this.userService = userService;
  }

  async validate(payload: any): Promise<UserEntity | null> {
    const authUser = await this.userService.findOneById(payload.sub);
    // console.log(payload, authUser);
    if (!authUser) {
      throw new UnauthorizedException();
    }

    return authUser;
  }
}
