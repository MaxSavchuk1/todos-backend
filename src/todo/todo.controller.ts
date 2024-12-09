import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoEntity } from './entity/todo.entity';
import { CreateTodoDto } from './dto/todo.create-dto';
import { UpdateTodoDto } from './dto/todo.update-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findRootTodos(@Request() req: any): Promise<TodoEntity[]> {
    const { id: userId } = req.user;
    return this.todoService.findRootTodos(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  findAllTodos(): Promise<TodoEntity[]> {
    return this.todoService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:todoId')
  findOneTodo(@Param('todoId') todoId: number): Promise<TodoEntity> {
    return this.todoService.findTodoByIdWithChildren(todoId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createTodo(
    @Body() data: CreateTodoDto,
    @Request() req: any,
  ): Promise<TodoEntity> {
    const { id: userId } = req.user;
    return this.todoService.createTodo(data, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:todoId')
  updateTodo(
    @Param('todoId') todoId: number,
    @Body() data: UpdateTodoDto,
    @Request() req: any,
  ): Promise<void> {
    const { id: userId } = req.user;
    return this.todoService.updateTodo(todoId, userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:todoId')
  removeTodo(
    @Param('todoId') todoId: number,
    @Request() req: any,
  ): Promise<void> {
    const { id: userId } = req.user;
    return this.todoService.removeTodoById(todoId, userId);
  }
}
