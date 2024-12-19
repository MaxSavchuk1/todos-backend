import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { AddRoleDto } from './dto/role.add-dto';
import { RemoveRoleDto } from './dto/role.remove-dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('role')
@ApiTags('Roles')
@Roles(Role.ADMIN)
export class RoleController {
  constructor(private authorizationService: RoleService) {}

  @Post('add')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: AddRoleDto })
  add(@Body() updateRolesDto: AddRoleDto) {
    return this.authorizationService.add(updateRolesDto);
  }

  @Post('remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: RemoveRoleDto })
  remove(@Body() updateRolesDto: RemoveRoleDto) {
    return this.authorizationService.remove(updateRolesDto);
  }
}
