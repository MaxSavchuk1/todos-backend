import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource, Raw } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'CheckAdminCount', async: true })
export class CheckAdminCount implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: string[], validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0];
    const adminCount: number = await this.dataSource
      .getRepository(repository)
      .count({
        where: {
          roles: Raw((alias) => `${alias} @> ARRAY['admin']::varchar[]`),
        },
      });
    return adminCount > 1;
  }
}
