import { IsNotEmpty, Validate } from 'class-validator';
import { Role } from 'src/authorization/enums/role.enum';
import { IsRoleExist } from '../decorators/is-role-exist.decorator';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class AddRoleDto {
  @IsNotEmpty()
  @Validate(IsExist, ['UserEntity', 'id'], {
    message: 'The user does not exist',
  })
  userId: number;

  @IsNotEmpty()
  @IsRoleExist()
  role: Role;
}
