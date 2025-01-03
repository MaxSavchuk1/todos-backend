import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindDto {
  @IsInt()
  @Min(-1)
  @Max(1000)
  @Type(() => Number)
  limit: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number;
}
