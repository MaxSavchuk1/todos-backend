import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: createMock<Repository<TodoEntity>>(),
        },
      ],
      controllers: [TodoController],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
