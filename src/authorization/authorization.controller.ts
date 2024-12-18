import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { AddRoleDto } from './dto/roles.add-dto';
import { RemoveRoleDto } from './dto/roles.remove-dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('role')
export class AuthorizationController {
  constructor(private authorizationService: AuthorizationService) {}

  @Roles(Role.Admin)
  @Post('add')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: AddRoleDto })
  add(@Body() updateRolesDto: AddRoleDto) {
    return this.authorizationService.add(updateRolesDto);
  }

  @Roles(Role.Admin)
  @Post('remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: RemoveRoleDto })
  remove(@Body() updateRolesDto: RemoveRoleDto) {
    return this.authorizationService.remove(updateRolesDto);
  }
}
