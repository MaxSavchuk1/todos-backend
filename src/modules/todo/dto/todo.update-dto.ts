import { IsArray, IsOptional, IsString } from 'class-validator';
import { TodoEntity, TodoStatus } from '../entity/todo.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly body: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly status: TodoStatus;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  readonly children: Array<number | TodoEntity>;
}
