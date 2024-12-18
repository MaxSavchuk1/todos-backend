import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

describe('AuthorizationController', () => {
  let controller: AuthorizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationController],
      providers: [
        AuthorizationService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMock<Repository<UserEntity>>(),
        },
      ],
    }).compile();

    controller = module.get<AuthorizationController>(AuthorizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
