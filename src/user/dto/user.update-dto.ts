import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, Validate } from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';

export class UpdateUserDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'The email is already exists',
  })
  @IsEmail()
  email: string;
}
