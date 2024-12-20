import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Role } from 'src/modules/role/enums/role.enum';
import { CheckUserRole } from 'src/modules/role/validators/check-user-role';

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly projectName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly projectDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Validate(CheckUserRole, [Role.PROJECT_MANAGER], {
    message: "Selected user doesn't have the project manager role",
  })
  readonly projectManager: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  readonly assignedUsers: number[];
}
