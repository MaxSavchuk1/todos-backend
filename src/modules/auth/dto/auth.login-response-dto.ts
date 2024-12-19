import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
