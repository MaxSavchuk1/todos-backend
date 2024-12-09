import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly body: string;

  @IsOptional()
  @IsNumber()
  readonly parentId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;
}
