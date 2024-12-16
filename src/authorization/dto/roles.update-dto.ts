import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsOptional,
  Validate,
} from 'class-validator';
import { Role } from 'src/authorization/enums/role.enum';
import { IsRoleExist } from '../decorators/is-role-exist.decorator';
import { CheckAdminCount } from '../validators/check-admin-count.validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class UpdateRolesDto {
  @IsNotEmpty()
  @Validate(IsExist, ['UserEntity', 'id'], {
    message: 'The user does not exist',
  })
  id: number;

  @IsOptional()
  @ArrayNotEmpty({
    message: 'At least one role must be selected',
  })
  @IsRoleExist()
  @Validate(CheckAdminCount, ['UserEntity'], {
    message: 'At least one admin must exist',
  })
  roles: Role[];
}
