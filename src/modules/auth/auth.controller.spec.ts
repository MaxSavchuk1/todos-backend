import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/modules/user/user.service';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthRefreshTokenEntity } from './entity/auth-refresh-token.entity';

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
