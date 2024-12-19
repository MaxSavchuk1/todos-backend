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
import { Roles } from 'src/modules/role/decorators/roles.decorator';
import { Role } from 'src/modules/role/enums/role.enum';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('todos')
@ApiTags('Todos')
@ApiBearerAuth()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Roles(Role.APP_USER)
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

  @Roles(Role.APP_USER, Role.USER_MANAGER)
  @Get('/:todoId')
  @ApiOkResponse({
    type: TodoEntity,
  })
  findOneTodo(@Param('todoId') todoId: number): Promise<TodoEntity> {
    return this.todoService.findTodoByIdWithChildren(todoId);
  }

  @Roles(Role.APP_USER)
  @Post('/create')
  createTodo(
    @Body() data: CreateTodoDto,
    @Request() req: any,
  ): Promise<TodoEntity> {
    const { id: userId } = req.user;
    return this.todoService.createTodo(data, userId);
  }

  @Roles(Role.APP_USER)
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

  @Roles(Role.APP_USER)
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
