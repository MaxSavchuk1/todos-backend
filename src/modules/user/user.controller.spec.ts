import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMock<Repository<UserEntity>>(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
