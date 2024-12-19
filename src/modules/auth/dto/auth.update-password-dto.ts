import { IsConfirmed } from 'src/modules/auth/decorators/is-confirmed.decorator';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsNotEqualTo } from 'src/utils/validators/is-not-equal.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @IsConfirmed()
  @IsNotEqualTo('oldPassword', {
    message: 'The old password and the new password are the same',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  passwordConfirmation: string;
}
