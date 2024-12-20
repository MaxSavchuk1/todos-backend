import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { Role } from '../enums/role.enum';

@Injectable()
@ValidatorConstraint({ name: 'CheckUserRole', async: true })
export class CheckUserRole implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(
    value: string,
    { constraints, object, property }: ValidationArguments,
  ) {
    const role = constraints[0] as Role;
    const userId = object[property];

    const foundUser = (await this.dataSource
      .getRepository('UserEntity')
      .findOneBy({
        id: userId,
      })) as UserEntity;

    if (foundUser && foundUser.roles.includes(role)) {
      return true;
    }

    return false;
  }
}
