import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { AddRoleDto } from './dto/roles.add-dto';
import { RemoveRoleDto } from './dto/roles.remove-dto';

@Controller('role')
export class AuthorizationController {
  constructor(private authorizationService: AuthorizationService) {}

  @Roles(Role.Admin)
  @Post('add')
  @HttpCode(HttpStatus.OK)
  add(@Body() updateRolesDto: AddRoleDto) {
    return this.authorizationService.add(updateRolesDto);
  }

  @Roles(Role.Admin)
  @Post('remove')
  @HttpCode(HttpStatus.OK)
  remove(@Body() updateRolesDto: RemoveRoleDto) {
    return this.authorizationService.remove(updateRolesDto);
  }
}
