import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthRefreshTokenEntity } from './entity/auth-refresh-token.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        AuthRefreshTokenService,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(AuthRefreshTokenEntity),
          useValue: createMock<Repository<AuthRefreshTokenEntity>>(),
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMock<Repository<UserEntity>>(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
