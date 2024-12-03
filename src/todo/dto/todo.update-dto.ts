import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateTodoDto } from './todo.create-dto';
import { TodoEntity, TodoStatus } from '../entity/todo.entity';

export class UpdateTodoDto extends CreateTodoDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly body: string;

  @IsOptional()
  @IsString()
  readonly status: TodoStatus;

  @IsOptional()
  @IsArray()
  readonly children: Array<number | TodoEntity>;
}
