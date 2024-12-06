import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import Hash from 'src/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isMatch = await Hash.compare(password, user.password);
    console.log('isMatch', isMatch);
    if (isMatch) {
      return user;
    }
    return null;
  }

  login(user: UserEntity) {
    return this.authRefreshTokenService.generateTokenPair(user);
  }
}
