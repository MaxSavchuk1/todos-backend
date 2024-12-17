import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoEntity } from './entity/todo.entity';
import { CreateTodoDto } from './dto/todo.create-dto';
import { UpdateTodoDto } from './dto/todo.update-dto';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { Role } from 'src/authorization/enums/role.enum';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Roles(Role.User)
  @Get()
  findRootTodos(@Request() req: any): Promise<TodoEntity[]> {
    const { id: userId } = req.user;
    return this.todoService.findRootTodos(userId);
  }

  @Roles(Role.User)
  @Get('/all')
  findAllTodos(): Promise<TodoEntity[]> {
    return this.todoService.findAll();
  }

  @Get('/:todoId')
  findOneTodo(@Param('todoId') todoId: number): Promise<TodoEntity> {
    return this.todoService.findTodoByIdWithChildren(todoId);
  }

  @Roles(Role.User)
  @Post('/create')
  createTodo(
    @Body() data: CreateTodoDto,
    @Request() req: any,
  ): Promise<TodoEntity> {
    const { id: userId } = req.user;
    return this.todoService.createTodo(data, userId);
  }

  @Roles(Role.User)
  @Patch('/:todoId')
  updateTodo(
    @Param('todoId') todoId: number,
    @Body() data: UpdateTodoDto,
    @Request() req: any,
  ): Promise<void> {
    const { id: userId } = req.user;
    return this.todoService.updateTodo(todoId, userId, data);
  }

  @Roles(Role.User)
  @Delete('/:todoId')
  removeTodo(
    @Param('todoId') todoId: number,
    @Request() req: any,
  ): Promise<void> {
    const { id: userId } = req.user;
    return this.todoService.removeTodoById(todoId, userId);
  }
}
