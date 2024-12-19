import { IsNotEmpty, Validate } from 'class-validator';
import { Role } from 'src/modules/role/enums/role.enum';
import { IsRoleExist } from '../decorators/is-role-exist.decorator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsExist, ['UserEntity', 'id'], {
    message: 'The user does not exist',
  })
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsRoleExist()
  role: Role;
}
