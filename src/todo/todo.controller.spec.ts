import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: createMock<Repository<TodoEntity>>(),
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
