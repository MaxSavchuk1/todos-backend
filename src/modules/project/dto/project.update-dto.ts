import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateProjectDto } from './project.create-dto';

export class UpdateProjectDto extends CreateProjectDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly projectManager: number;
}
