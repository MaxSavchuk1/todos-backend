import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import Hash from 'src/utils/hash';
import { Repository } from 'typeorm';
import { AuthUpdatePasswordDto } from './dto/auth.update-password-dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
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
    if (isMatch) {
      return user;
    }
    return null;
  }

  login(user: UserEntity) {
    return this.authRefreshTokenService.generateTokenPair(user);
  }

  async me({ id }): Promise<UserEntity | null> {
    const foundUser = await this.usersRepository.findOneBy({ id });
    return foundUser;
  }

  async updatePassword({ id }, authUpdatePasswordDto: AuthUpdatePasswordDto) {
    const user = await this.usersRepository.findOneBy({ id });
    const isValidPassword = await Hash.compare(
      authUpdatePasswordDto.oldPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Old password is wrong',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.usersRepository.save(
      this.usersRepository.create({
        ...user,
        password: authUpdatePasswordDto.password,
      }),
    );
    return;
  }
}
