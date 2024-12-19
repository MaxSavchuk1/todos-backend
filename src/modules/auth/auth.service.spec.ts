import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/modules/user/user.service';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { AuthRefreshTokenEntity } from './entity/auth-refresh-token.entity';
import { AuthRefreshTokenService } from './auth-refresh-token.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
