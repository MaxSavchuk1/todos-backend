import { IsNotEmpty, Validate } from 'class-validator';
import { Role } from 'src/role/enums/role.enum';
import { IsRoleExist } from '../decorators/is-role-exist.decorator';
import { CheckAdminCount } from '../validators/check-admin-count.validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddRoleDto } from './role.add-dto';

export class RemoveRoleDto extends AddRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsRoleExist()
  @Validate(CheckAdminCount, ['UserEntity'], {
    message: 'At least one admin must exist',
  })
  role: Role;
}
