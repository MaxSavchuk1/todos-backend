import { IsConfirmed } from 'src/utils/validators/is-confirmed.decorator';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsNotEqualTo } from 'src/utils/validators/is-not-equal.decorator';

export class AuthUpdatePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @IsConfirmed()
  @IsNotEqualTo('oldPassword', {
    message: 'The old password and the new password are the same',
  })
  password: string;

  @IsNotEmpty()
  passwordConfirmation: string;
}
