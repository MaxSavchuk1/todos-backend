import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
// import { Roles } from '../role/decorators/roles.decorator';
// import { Role } from '../role/enums/role.enum';
import { CreateProjectDto } from './dto/project.create-dto';

@Controller('projects')
@ApiTags('Projects')
@UseInterceptors(ClassSerializerInterceptor)
// @Roles(Role.PROJECT_MANAGER)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @ApiBody({ type: CreateProjectDto })
  @Post('/create')
  create(@Body() createUserDto: CreateProjectDto) {
    return this.projectService.create(createUserDto);
  }
}
