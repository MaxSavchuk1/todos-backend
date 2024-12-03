import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoEntity } from './entity/todo.entity';
import { CreateTodoDto } from './dto/todo.create-dto';
import { UpdateTodoDto } from './dto/todo.update-dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findRootTodos(): Promise<TodoEntity[]> {
    return this.todoService.findRootTodos();
  }

  @Get('/all')
  findAllTodos(): Promise<TodoEntity[]> {
    return this.todoService.findAll();
  }

  @Get('/:todoId')
  findOneTodo(@Param('todoId') todoId: number): Promise<TodoEntity> {
    return this.todoService.findTodoByIdWithChildren(todoId);
  }

  @Post('/create')
  createTodo(@Body() data: CreateTodoDto): Promise<TodoEntity> {
    return this.todoService.createTodo(data);
  }

  @Patch('/:todoId')
  updateTodo(
    @Param('todoId') todoId: number,
    @Body() data: UpdateTodoDto,
  ): Promise<void> {
    return this.todoService.updateTodo(todoId, data);
  }

  @Delete('/:todoId')
  removeTodo(@Param('todoId') todoId: number): Promise<void> {
    return this.todoService.removeTodoById(todoId);
  }
}
