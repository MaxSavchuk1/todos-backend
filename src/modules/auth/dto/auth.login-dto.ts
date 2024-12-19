import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@example.com' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  readonly password: string;
}
