import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('todos')
@ApiTags('Todos')
@ApiBearerAuth()
@Roles(Role.User)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({
    summary: "Get root todos that don't have parent todo",
  })
  @ApiOkResponse({
    type: TodoEntity,
    isArray: true,
  })
  findRootTodos(@Request() req: any): Promise<TodoEntity[]> {
    const { id: userId } = req.user;
    return this.todoService.findRootTodos(userId);
  }

  // @Get('/all')
  // findAllTodos(): Promise<TodoEntity[]> {
  //   return this.todoService.findAll();
  // }

  @Get('/:todoId')
  @ApiOkResponse({
    type: TodoEntity,
  })
  findOneTodo(@Param('todoId') todoId: number): Promise<TodoEntity> {
    return this.todoService.findTodoByIdWithChildren(todoId);
  }

  @Post('/create')
  createTodo(
    @Body() data: CreateTodoDto,
    @Request() req: any,
  ): Promise<TodoEntity> {
    const { id: userId } = req.user;
    return this.todoService.createTodo(data, userId);
  }

  @Patch('/:todoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateTodo(
    @Param('todoId') todoId: number,
    @Body() data: UpdateTodoDto,
    @Request() req: any,
  ): Promise<void> {
    const { id: userId } = req.user;
    return this.todoService.updateTodo(todoId, userId, data);
  }

  @Delete('/:todoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTodo(
    @Param('todoId') todoId: number,
    @Request() req: any,
  ): Promise<void> {
    const { id: userId } = req.user;
    return this.todoService.removeTodoById(todoId, userId);
  }
}
