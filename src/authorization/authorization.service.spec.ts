import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

describe('AuthorizationService', () => {
  let service: AuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMock<Repository<UserEntity>>(),
        },
      ],
      controllers: [AuthorizationController],
    }).compile();

    service = module.get<AuthorizationService>(AuthorizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
