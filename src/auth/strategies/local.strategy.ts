import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<UserEntity> {
    const user = await this.authenticationService.validateUser(
      username,
      password,
    );
    if (!user) {
      throw new NotFoundException('Incorrect email or password');
    }
    return user;
  }
}
