import { IsNotEmpty, Validate } from 'class-validator';
import { Role } from 'src/authorization/enums/role.enum';
import { IsRoleExist } from '../decorators/is-role-exist.decorator';
import { CheckAdminCount } from '../validators/check-admin-count.validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class RemoveRoleDto {
  @IsNotEmpty()
  @Validate(IsExist, ['UserEntity', 'id'], {
    message: 'The user does not exist',
  })
  userId: number;

  @IsNotEmpty()
  @IsRoleExist()
  @Validate(CheckAdminCount, ['UserEntity'], {
    message: 'At least one admin must exist',
  })
  role: Role;
}
