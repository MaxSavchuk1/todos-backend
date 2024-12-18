import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, Validate } from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  readonly firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly lastName: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'The email is already exists',
  })
  @IsEmail()
  readonly email: string;
}
