import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  readonly body: string;

  @IsOptional()
  @IsNumber()
  readonly parentId: number;
}
