import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { UpdateRolesDto } from './dto/roles.update-dto';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';

@Controller('roles')
export class AuthorizationController {
  constructor(private authorizationService: AuthorizationService) {}

  @Roles(Role.Admin)
  @Post('update')
  @HttpCode(HttpStatus.OK)
  update(@Body() updateRolesDto: UpdateRolesDto) {
    return this.authorizationService.update(updateRolesDto);
  }
}
